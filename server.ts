import express, { Request, Response, NextFunction } from "express";
import 'dotenv/config';
import { createServer as createViteServer } from "vite";
import mysql from 'mysql2/promise';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod_123!';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('CRITICAL WARNING: JWT_SECRET is missing. Using dynamic fallback secret (sessions will reset on restart).');
}

// Auth Middleware
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: { message: "غير مصرح لك بالوصول" } });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: { message: "انتهت صلاحية الجلسة" } });
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  
  // Necessary for rate limiting behind the Nginx reverse proxy
  app.set('trust proxy', 1);
  
  // Enable gzip/deflate compression
  app.use(compression());
  
  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs some flexibility in dev
    crossOriginEmbedderPolicy: false
  }));
  
  // Rate Limiting
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: { message: "محاولات تسجيل دخول كثيرة جداً، يرجى المحاولة لاحقاً" } }
  });

  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // 100 requests per minute
  });

  const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 bookings per hour per IP
    message: { error: { message: "لقد تجاوزت الحد الأقصى للحجوزات خلال ساعة واحدة. يرجى المحاولة لاحقاً أو التواصل معنا مباشرة." } }
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize MySQL pool with optimized settings
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 20, // Increased for better concurrency
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  });

  // Database initialization
  async function initDb() {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('Connected to MySQL successfully.');

      // Migration helpers
      const checkCol = async (table: string, col: string) => {
        const [rows]: any = await connection.query(`
          SELECT COLUMN_NAME
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
        `, [table, col]);
        return rows.length > 0;
      };

      const addCol = async (table: string, col: string, type: string) => {
        const exists = await checkCol(table, col);
        if (!exists) {
          try { await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${type}`); } catch(e) {}
        }
      };

      const modifyCol = async (table: string, col: string, type: string) => {
        try { await connection.query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`${col}\` ${type}`); } catch(e) {}
      };

      // Users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (email)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      // Ensure the primary admin user exists (must be set in .env)
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPass = process.env.ADMIN_PASSWORD;
      
      if (adminEmail && adminPass) {
        const [existingUser]: any = await connection.query('SELECT password FROM users WHERE email = ?', [adminEmail]);
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);

        if (existingUser.length === 0) {
          await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [adminEmail, hashedPassword]);
          console.log('Main admin account created.');
        }
      } else {
        console.warn('WARNING: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables.');
      }
      
      // Add secondary admin user from env if available
      const samEmail = process.env.SECONDARY_ADMIN_EMAIL;
      const samPass = process.env.SECONDARY_ADMIN_PASSWORD;
      
      if (samEmail && samPass) {
        const [existingSamUser]: any = await connection.query('SELECT password FROM users WHERE email = ?', [samEmail]);
        if (existingSamUser.length === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedSamPassword = await bcrypt.hash(samPass, salt);
          await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [samEmail, hashedSamPassword]);
          console.log('Secondary admin account created.');
        }
      }

      await connection.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          phone VARCHAR(100) UNIQUE,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      console.log('Secure admin account verified.');
      
      // Auto-create tables if they don't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS offers (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255),
          description TEXT,
          descriptionTitle VARCHAR(255),
          destination VARCHAR(255),
          image LONGTEXT,
          badgeText VARCHAR(255),
          urgencyText VARCHAR(255),
          price VARCHAR(100),
          oldPrice VARCHAR(100),
          currency VARCHAR(100),
          duration VARCHAR(100),
          status VARCHAR(50),
          features JSON,
          notIncluded JSON,
          category VARCHAR(100),
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (status),
          INDEX (category),
          INDEX (sort_order)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      // Migration: Safety for offers table
      await addCol('offers', 'descriptionTitle', 'VARCHAR(255)');
      await addCol('offers', 'badgeText', 'VARCHAR(255)');
      await addCol('offers', 'urgencyText', 'VARCHAR(255)');
      await addCol('offers', 'oldPrice', 'VARCHAR(100)');
      await addCol('offers', 'category', 'VARCHAR(100)');
      await addCol('offers', 'sort_order', 'INT DEFAULT 0');
      // Ensure image is LONGTEXT
      await modifyCol('offers', 'image', 'LONGTEXT');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS visas (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255),
          description TEXT,
          descriptionTitle VARCHAR(255),
          image LONGTEXT,
          price VARCHAR(100),
          currency VARCHAR(100),
          status VARCHAR(50),
          processingTime VARCHAR(255),
          duration VARCHAR(255),
          features JSON,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (status),
          INDEX (sort_order)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      // Migration: Ensure processingTime and duration exists if table was created earlier
      await addCol('visas', 'processingTime', 'VARCHAR(255)');
      await addCol('visas', 'duration', 'VARCHAR(255)');
      await addCol('visas', 'sort_order', 'INT DEFAULT 0');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS destinations (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255),
          description TEXT,
          image LONGTEXT,
          category VARCHAR(100),
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (category),
          INDEX (sort_order)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      await addCol('destinations', 'sort_order', 'INT DEFAULT 0');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          user_id BIGINT,
          name VARCHAR(255),
          phone VARCHAR(100),
          email VARCHAR(255),
          passportNumber VARCHAR(100),
          service VARCHAR(255),
          serviceType VARCHAR(255),
          date VARCHAR(100),
          status VARCHAR(50),
          amount VARCHAR(100),
          details TEXT,
          passportImage LONGTEXT,
          personalPhoto LONGTEXT,
          documents JSON,
          preferredContact VARCHAR(100),
          preferredContactTime VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (status),
          INDEX (serviceType),
          INDEX (user_id),
          INDEX (created_at)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      // Migration: Safety for bookings table
      await modifyCol('bookings', 'user_id', 'BIGINT');
      await addCol('bookings', 'passportNumber', 'VARCHAR(100)');
      await addCol('bookings', 'serviceType', 'VARCHAR(255)');
      await addCol('bookings', 'passportImage', 'LONGTEXT');
      await addCol('bookings', 'personalPhoto', 'LONGTEXT');
      await addCol('bookings', 'documents', 'JSON');
      await addCol('bookings', 'preferredContact', 'VARCHAR(100)');
      await addCol('bookings', 'preferredContactTime', 'VARCHAR(100)');
      // Ensure image columns are LONGTEXT if they exist
      await modifyCol('bookings', 'passportImage', 'LONGTEXT');
      await modifyCol('bookings', 'personalPhoto', 'LONGTEXT');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS social_links (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          platform VARCHAR(100),
          url VARCHAR(1024),
          icon VARCHAR(100),
          visible BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      await connection.query(`
        CREATE TABLE IF NOT EXISTS contact_info (
          id INT PRIMARY KEY DEFAULT 1,
          phones JSON,
          email VARCHAR(255),
          address TEXT,
          addressUrl VARCHAR(1024),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);

      // Initialize contact info if empty
      const [contactRows]: any = await connection.query('SELECT id FROM contact_info WHERE id = 1');
      if (contactRows.length === 0) {
        await connection.query(
          'INSERT INTO contact_info (id, phones, email, address, addressUrl) VALUES (1, ?, ?, ?, ?)',
          [JSON.stringify(['+201154162244', '+201103103362', '+201553004593']), 'reservation@sabreentourism.com', 'روكسي - الدور السادس - مصر الجديده - القاهرة', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3452.0395265189827!2d31.3157442!3d30.0930543!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f2677e86c29%3A0x9db43d23d014bfc5!2ssteps%20co%20working%20space%20Heliopolis!5e0!3m2!1sar!2seg!4v1776437866510!5m2!1sar!2seg']
        );
      }

      // Initialize social links if empty
      const [socialRows]: any = await connection.query('SELECT id FROM social_links LIMIT 1');
      if (socialRows.length === 0) {
        await connection.query(
          'INSERT INTO social_links (platform, url, icon, visible) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
          ['facebook', 'https://www.facebook.com/share/1C6WokSrAE/', 'Facebook', true, 'whatsapp', 'https://wa.me/201154162244', 'MessageCircle', true]
        );
      }

    } catch (error) {
      console.error('MySQL Initialization Error:', error);
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Define APIs
  // Ensure we avoid naming collisions and use standard JSON responses

  app.get('/api/health', (req, res) => res.json({ status: "ok" }));

  // Generic Query Helper
  const q = async (sql: string, params: any[] = []) => {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch(err) {
      console.warn("Query failed:", err);
      throw err;
    }
  };
  const exec = async (sql: string, params: any[] = []) => {
    try {
      const [result] = await pool.execute(sql, params);
      return result;
    } catch(err) {
      console.warn("Execute failed:", err);
      throw err;
    }
  };

  // --- Cache Helper ---
  const cache: Record<string, { data: any, expiry: number }> = {};
  const CACHE_TTL = 30000; // 30 seconds
  
  const getCached = (key: string) => {
    const item = cache[key];
    if (item && item.expiry > Date.now()) return item.data;
    return null;
  };
  
  const setCache = (key: string, data: any) => {
    cache[key] = { data, expiry: Date.now() + CACHE_TTL };
  };
  
  const clearCache = (keyPrefix?: string) => {
    if (!keyPrefix) {
      Object.keys(cache).forEach(k => delete cache[k]);
    } else {
      Object.keys(cache).forEach(k => { if (k.startsWith(keyPrefix)) delete cache[k]; });
    }
  };

  // --- Bulk Sort Update ---
  app.post('/api/sort-order', authenticateToken, async (req, res) => {
    try {
      const { table, items } = req.body; // items: [{id, sort_order}, ...]
      const allowedTables = ['offers', 'visas', 'destinations'];
      if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
      
      for (const item of items) {
        await exec(`UPDATE ${table} SET sort_order = ? WHERE id = ?`, [item.sort_order, item.id]);
      }
      clearCache(table);
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Offers ---
  app.get('/api/offers', async (req, res) => {
    try {
      const cached = getCached('offers');
      if (cached) return res.json(cached);
      
      const rows = await q('SELECT * FROM offers ORDER BY sort_order ASC, id DESC');
      setCache('offers', rows);
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/offers', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      const result: any = await exec(
        'INSERT INTO offers (title, description, descriptionTitle, destination, image, badgeText, urgencyText, price, oldPrice, currency, duration, status, features, notIncluded, category) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [p.title||null, p.description||null, p.descriptionTitle||null, p.destination||null, p.image||null, p.badgeText||null, p.urgencyText||null, p.price||null, p.oldPrice||null, p.currency||null, p.duration||null, p.status||'نشط', JSON.stringify(p.features||[]), JSON.stringify(p.notIncluded||[]), p.category||null]
      );
      clearCache('offers');
      res.json([{ id: result.insertId, ...p, status: p.status||'نشط' }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.put('/api/offers/:id', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      await exec(
        'UPDATE offers SET title=?, description=?, descriptionTitle=?, destination=?, image=?, badgeText=?, urgencyText=?, price=?, oldPrice=?, currency=?, duration=?, status=?, features=?, notIncluded=?, category=? WHERE id=?',
        [p.title||null, p.description||null, p.descriptionTitle||null, p.destination||null, p.image||null, p.badgeText||null, p.urgencyText||null, p.price||null, p.oldPrice||null, p.currency||null, p.duration||null, p.status||null, JSON.stringify(p.features||[]), JSON.stringify(p.notIncluded||[]), p.category||null, req.params.id]
      );
      clearCache('offers');
      res.json([{ id: req.params.id, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.delete('/api/offers/:id', authenticateToken, async (req, res) => {
    try {
      await exec('DELETE FROM offers WHERE id=?', [req.params.id]);
      clearCache('offers');
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Visas ---
  app.get('/api/visas', async (req, res) => {
    try {
      const cached = getCached('visas');
      if (cached) return res.json(cached);
      
      const rows = await q('SELECT * FROM visas ORDER BY sort_order ASC, id DESC');
      setCache('visas', rows);
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/visas', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      const result: any = await exec(
        'INSERT INTO visas (title, description, descriptionTitle, image, price, currency, status, processingTime, duration, features) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [p.title||null, p.description||null, p.descriptionTitle||null, p.image||null, p.price||null, p.currency||null, p.status||'نشط', p.processingTime||null, p.duration||null, JSON.stringify(p.features||[])]
      );
      clearCache('visas');
      res.json([{ id: result.insertId, ...p, status: p.status||'نشط' }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.put('/api/visas/:id', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      await exec(
        'UPDATE visas SET title=?, description=?, descriptionTitle=?, image=?, price=?, currency=?, status=?, processingTime=?, duration=?, features=? WHERE id=?',
        [p.title||null, p.description||null, p.descriptionTitle||null, p.image||null, p.price||null, p.currency||null, p.status||null, p.processingTime||null, p.duration||null, JSON.stringify(p.features||[]), req.params.id]
      );
      clearCache('visas');
      res.json([{ id: req.params.id, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.delete('/api/visas/:id', authenticateToken, async (req, res) => {
    try {
      await exec('DELETE FROM visas WHERE id=?', [req.params.id]);
      clearCache('visas');
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Destinations ---
  app.get('/api/destinations', async (req, res) => {
    try {
      const cached = getCached('destinations');
      if (cached) return res.json(cached);
      
      const rows = await q('SELECT * FROM destinations ORDER BY sort_order ASC, id DESC');
      setCache('destinations', rows);
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/destinations', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      const result: any = await exec(
        'INSERT INTO destinations (name, description, image, category) VALUES (?,?,?,?)',
        [p.name||null, p.description||null, p.image||null, p.category||null]
      );
      clearCache('destinations');
      res.json([{ id: result.insertId, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.put('/api/destinations/:id', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      await exec(
        'UPDATE destinations SET name=?, description=?, image=?, category=? WHERE id=?',
        [p.name||null, p.description||null, p.image||null, p.category||null, req.params.id]
      );
      clearCache('destinations');
      res.json([{ id: req.params.id, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.delete('/api/destinations/:id', authenticateToken, async (req, res) => {
    try {
      await exec('DELETE FROM destinations WHERE id=?', [req.params.id]);
      clearCache('destinations');
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Bookings ---
  app.get('/api/bookings', authenticateToken, async (req, res) => {
    try {
      // Exclude heavy LONGTEXT columns (passportImage, personalPhoto, documents) to drastically improve load times
      const rows = await q('SELECT id, user_id, name, phone, email, passportNumber, service, serviceType, date, status, amount, details, preferredContact, preferredContactTime, created_at FROM bookings ORDER BY created_at DESC');
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
      const rows: any = await q('SELECT * FROM bookings WHERE id=?', [req.params.id]);
      if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/bookings', bookingLimiter, async (req, res) => {
    try {
      const p = req.body;
      
      // Image size validation (roughly limit to 7MB base64) to prevent DB exhaustion DoS
      if ((p.passportImage && p.passportImage.length > 8 * 1024 * 1024) || 
          (p.personalPhoto && p.personalPhoto.length > 8 * 1024 * 1024)) {
        return res.status(400).json({ error: { message: "حجم الصورة يتجاوز الحد المسموح به" } });
      }

      const result: any = await exec(
        'INSERT INTO bookings (user_id, name, phone, email, passportNumber, service, serviceType, date, status, amount, details, passportImage, personalPhoto, documents, preferredContact, preferredContactTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [p.userId||null, p.name||null, p.phone||null, p.email||null, p.passportNumber||null, p.service||null, p.serviceType||null, p.date||null, 'قيد الانتظار', null, p.details||null, p.passportImage||null, p.personalPhoto||null, JSON.stringify(p.documents||[]), p.preferredContact||null, p.preferredContactTime||null]
      );
      
      const [newBooking]: any = await q('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
      res.json([newBooking]);
    } catch (e: any) { 
      console.error(e); 
      res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); 
    }
  });
  app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      const allowedKeys = [
        'user_id', 'name', 'phone', 'email', 'passportNumber', 'service', 
        'serviceType', 'date', 'status', 'amount', 'details', 
        'passportImage', 'personalPhoto', 'documents', 
        'preferredContact', 'preferredContactTime'
      ];
      
      let sql = 'UPDATE bookings SET ';
      const updates = [];
      const values = [];
      
      for (const key of Object.keys(p)) {
        if (allowedKeys.includes(key)) {
          updates.push(`\`${key}\`=?`);
          if (p[key] === null) {
            values.push(null);
          } else if (typeof p[key] === 'object') {
            values.push(JSON.stringify(p[key]));
          } else {
            values.push(p[key]);
          }
        }
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: { message: "لا توجد بيانات صالحة للتحديث" } });
      }
      
      values.push(req.params.id);
      sql += updates.join(', ') + ' WHERE id=?';
      
      await exec(sql, values);
      res.json([{ id: req.params.id, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
      await exec('DELETE FROM bookings WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Social Links ---
  app.get('/api/social_links', async (req, res) => {
    try {
      const rows = await q('SELECT * FROM social_links ORDER BY id ASC');
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/social_links/bulk', authenticateToken, async (req, res) => {
    try {
      const links = req.body;
      await exec('DELETE FROM social_links WHERE id != 0');
      if (links && Array.isArray(links) && links.length > 0) {
        for (const link of links) {
          await exec(
            'INSERT INTO social_links (platform, url, icon, visible) VALUES (?,?,?,?)',
            [link.platform||null, link.url||null, link.icon||null, (link.visible === false || link.visible === 0 || link.visible === '0') ? 0 : 1]
          );
        }
      }
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Contact Info ---
  app.get('/api/contact_info', async (req, res) => {
    try {
      const rows = await q('SELECT * FROM contact_info WHERE id=1');
      res.json(rows[0] || null);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });
  app.post('/api/contact_info', authenticateToken, async (req, res) => {
    try {
      const p = req.body;
      await exec(
        'UPDATE contact_info SET phones=?, email=?, address=?, addressUrl=? WHERE id=1',
        [JSON.stringify(p.phones||[]), p.email||null, p.address||null, p.addressUrl||null]
      );
      res.json([{ id: 1, ...p }]);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  // --- Auth (MySQL based) ---
  app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      const users: any = await q('SELECT * FROM users WHERE email = ?', [email]);
      
      if (users.length > 0) {
        const isMatch = await bcrypt.compare(password, users[0].password);
        if (isMatch) {
          const userToken = { id: users[0].id, email: users[0].email };
          const token = jwt.sign(userToken, JWT_SECRET, { expiresIn: '24h' });
          res.json({ user: userToken, token });
        } else {
          res.status(401).json({ error: { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" } });
        }
      } else {
        res.status(401).json({ error: { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" } });
      }
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } });
    }
  });

  app.post('/api/auth/change-password', authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userEmail = req.user.email;
      
      const users: any = await q('SELECT * FROM users WHERE email = ?', [userEmail]);
      if (users.length === 0) return res.status(404).json({ error: { message: "المستخدم غير موجود" } });

      const isMatch = await bcrypt.compare(currentPassword, users[0].password);
      if (!isMatch) return res.status(400).json({ error: { message: "كلمة المرور الحالية غير صحيحة" } });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await exec('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, userEmail]);
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } });
    }
  });

  // --- Subscribers ---
  app.get('/api/subscribers', authenticateToken, async (req, res) => {
    try {
      const rows = await q('SELECT * FROM subscribers ORDER BY created_at DESC');
      res.json(rows);
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  app.post('/api/subscribe', async (req, res) => {
    try {
      const { phone, name } = req.body;
      if (!phone) return res.status(400).json({ error: { message: "رقم الهاتف مطلوب" } });
      
      await exec(
        'INSERT INTO subscribers (phone, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [phone, name || null]
      );
      res.json({ success: true, message: "تم الاشتراك بنجاح في تنبيهات واتساب" });
    } catch (e: any) { 
      console.error(e); 
      res.status(500).json({ error: { message: "حدث خطأ أثناء الاشتراك، يرجى المحاولة لاحقاً" } }); 
    }
  });

  app.delete('/api/subscribers/:id', authenticateToken, async (req, res) => {
    try {
      await exec('DELETE FROM subscribers WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (e: any) { console.error(e); res.status(500).json({ error: { message: "حدث خطأ داخلي في الخادم." } }); }
  });

  await initDb();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // app.use((req, res, next) => {
    //   if (req.url.startsWith('/api')) return next();
    //   vite.middlewares(req, res, next);
    // });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Set 1 year cache for static assets (js, css, images) since Vite hashes them natively
    app.use(express.static(distPath, { 
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
