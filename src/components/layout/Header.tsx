import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Plane, Building, MapPin, Gift, ShieldCheck, 
  LayoutDashboard, Menu, X, Facebook, Instagram, 
  Twitter, Info, Headset, ArrowUpRight, LayoutGrid 
} from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { optimizeImageUrl } from '../../lib/utils';

interface HeaderProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  currentPage: string;
  isLoggedIn: boolean;
  socialLinks?: any[];
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, isLoggedIn, socialLinks = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const visibleSocialLinks = (socialLinks || []).filter(l => l && l.url && (l.visible === true || l.visible === 1 || l.visible === undefined));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", id: "home", icon: Home },
    { name: "الطيران", id: "flights", icon: Plane },
    { name: "الفنادق", id: "hotels", icon: Building },
    { name: "الوجهات", id: "destinations", icon: MapPin },
    { name: "العروض", id: "offers", icon: Gift },
    { name: "التأشيرات", id: "visa", icon: ShieldCheck },
    { name: "تواصل معنا", id: "contact", icon: Headset },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-surface/95 backdrop-blur-md border-b border-border py-3"
            : "bg-surface/70 backdrop-blur-md border-b border-transparent py-4 md:py-6"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-surface rounded-2xl flex items-center justify-center overflow-hidden transition-all border border-border shrink-0 group-hover:border-primary/30">
              <img decoding="async" 
                src={optimizeImageUrl("https://i.postimg.cc/t4cfJRBD/FB-IMG-1775329049732.jpg", 100)} 
                alt="صابرينكو للخدمات السياحية" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-extrabold text-muted-dark leading-tight tracking-tight">صابرينكو <span className="text-primary">للخدمات السياحية</span></span>
              <span className="label-caps !text-2xs md:!text-sm text-muted tracking-[0.2em] leading-none mt-1.5">رحلتك تبدأ هنا</span>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all active:scale-95 whitespace-nowrap ${
                  currentPage === link.id
                    ? "bg-primary-light text-primary"
                    : "text-muted hover:bg-surface-alt hover:text-muted-dark"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="hidden lg:flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all bg-primary text-white hover:bg-primary-hover active:scale-95 whitespace-nowrap shrink-0"
              >
                <LayoutGrid size={18} />
                <span className="leading-none">لوحة التحكم</span>
              </button>
            )}
            <button
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className="lg:hidden p-2.5 rounded-xl transition-all text-muted-dark hover:bg-border active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-muted-dark/60 backdrop-blur-md z-[150] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[340px] bg-surface z-[160] lg:hidden flex flex-col border-l border-border"
              dir="rtl"
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-surface-alt/20 backdrop-blur-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center overflow-hidden border border-border shrink-0">
                    <img decoding="async" src={optimizeImageUrl("https://i.postimg.cc/t4cfJRBD/FB-IMG-1775329049732.jpg", 100)} 
                      alt="صابرينكو للخدمات السياحية" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold text-muted-dark leading-tight">صابرينكو <span className="text-primary">للخدمات السياحية</span></span>
                    <span className="label-caps !text-2xs mt-1 tracking-[0.1em]">رحلتك تبدأ هنا</span>
                  </div>
                </div>
                <button
                  aria-label="إغلاق القائمة"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-muted-light hover:text-muted-dark hover:bg-border rounded-xl transition-all active:scale-95 border border-transparent"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Navigation */}
              <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                <div className="px-2 mb-4">
                  <p className="label-caps mb-4 opacity-70">القائمة الرئيسية</p>
                </div>
                <div className="space-y-1.5">
                  {navLinks.filter(l => l.id !== 'contact').map((link, idx) => (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      onClick={() => {
                        onNavigate(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all active:scale-95 group relative overflow-hidden ${
 currentPage === link.id
 ? "bg-primary text-white "
 : "bg-surface text-muted-dark hover:bg-primary-light hover:text-primary border border-transparent hover:border-primary-soft"
 }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
 currentPage === link.id ? "bg-white/20 text-white" : "bg-surface-alt text-muted group-hover:text-primary "
 } shrink-0`}>
                          <link.icon size={20} strokeWidth={currentPage === link.id ? 2.5 : 2} />
                        </div>
                        <span className="tracking-normal">{link.name}</span>
                      </div>
                      {currentPage === link.id && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover"
                        />
                      )}
                      <ArrowUpRight size={16} className={`opacity-0 group-hover:opacity-40 transition-opacity ${currentPage === link.id ? 'text-white' : 'text-primary'}`} />
                    </motion.button>
                  ))}
                </div>

                {/* Secondary Links Section */}
                <div className="mt-8 px-2">
                  <p className="label-caps mb-4 opacity-70">معلومات إضافية</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onNavigate('about');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center gap-2 py-5 bg-surface-alt/50 text-muted-dark rounded-xl font-bold text-xs hover:bg-primary-light hover:text-primary transition-all border border-border hover:border-primary-soft group"
                    >
                      <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                        <Info size={20} />
                      </div>
                      من نحن
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center gap-2 py-5 bg-surface-alt/50 text-muted-dark rounded-xl font-bold text-xs hover:bg-primary-light hover:text-primary transition-all border border-border hover:border-primary-soft group"
                    >
                      <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                        <Headset size={20} />
                      </div>
                      تواصل معنا
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-6 border-t border-border bg-surface-alt/40 backdrop-blur-sm space-y-5">
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-3 hover:bg-primary-hover transition-all active:scale-95"
                  >
                    <LayoutGrid size={20} />
                    لوحة التحكم الإدارية
                  </button>
                )}

                <div className="flex flex-col items-center gap-4">
                  <p className="label-caps mb-1 opacity-70">تابعنا على</p>
                  <div className="flex items-center justify-center gap-3">
                    {visibleSocialLinks.map((link, idx) => (
                      <a 
                        key={link.id || idx}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`زيارة صفحتنا على ${link.platform}`}
                        className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
                      >
                        {link.platform === 'facebook' && <Facebook size={20} className="group-hover:scale-110 transition-transform" />}
                        {link.platform === 'instagram' && <Instagram size={20} className="group-hover:scale-110 transition-transform" />}
                        {link.platform === 'whatsapp' && <WhatsAppIcon size={20} className="group-hover:scale-110 transition-transform" />}
                        {link.platform === 'twitter' && <Twitter size={20} className="group-hover:scale-110 transition-transform" />}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
