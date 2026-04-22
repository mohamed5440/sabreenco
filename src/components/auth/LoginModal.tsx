import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Send, AlertCircle } from 'lucide-react';
import { apiService } from '../../lib/apiService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await apiService.signIn(email, password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message === 'Invalid login credentials' || err.message === 'Invalid credentials') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من بيانات الاعتماد.');
      } else {
        setError(err.message || 'حدث خطأ أثناء العملية. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset to login state when closed
      setTimeout(() => {
        setError('');
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-muted-dark/40 backdrop-blur-md z-[150] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface rounded-xl w-full max-w-md border border-border relative z-10 overflow-y-auto custom-scrollbar max-h-[90vh]"
            dir="rtl"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-10 blur-2xl"></div>
            
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-light text-primary rounded-xl flex items-center justify-center mb-6 border border-primary-soft shrink-0">
                    <Lock size={28} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-normal text-muted-dark leading-tight">
                    تسجيل دخول الإدارة
                  </h2>
                  <p className="text-muted mt-3 text-sm font-medium leading-[1.6]">
                    يرجى إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 bg-surface-alt hover:bg-border rounded-xl transition-all text-muted hover:text-muted-dark active:scale-95 border border-border"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2 text-right">
                  <label className="block text-xs font-bold text-muted-dark opacity-70 pr-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                      <Mail size={20} />
                    </div>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-alt border border-border rounded-xl pl-11 pr-4 py-4 text-sm md:text-base text-muted-dark font-bold focus:outline-none focus:border-primary focus:bg-surface transition-all text-left"
                      placeholder="البريد الإلكتروني"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <label className="block text-xs font-bold text-muted-dark opacity-70 pr-1">كلمة المرور</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                      <Lock size={20} />
                    </div>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-alt border border-border rounded-xl pl-11 pr-4 py-4 text-sm md:text-base text-muted-dark font-bold focus:outline-none focus:border-primary focus:bg-surface transition-all text-left tracking-widest"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4.5 rounded-xl font-extrabold text-base transition-all duration-300 active:scale-95 select-none flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} />
                      دخول النظام
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
