import React, { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Twitter, Globe, MapPin, Phone, Mail, Banknote, Landmark, Smartphone, Link, CreditCard, ShieldCheck, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';
import { apiService } from '../../lib/apiService';

interface FooterProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  socialLinks?: any[];
  contactInfo?: any;
}

interface SubscriptionFormProps {
  className?: string;
  idPrefix?: string;
  subscribeName: string;
  setSubscribeName: (val: string) => void;
  subscribePhone: string;
  setSubscribePhone: (val: string) => void;
  subscribeStatus: 'idle' | 'loading' | 'success' | 'error';
  handleSubscribe: (e: React.FormEvent) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  className = "", 
  idPrefix = "desktop",
  subscribeName,
  setSubscribeName,
  subscribePhone,
  setSubscribePhone,
  subscribeStatus,
  handleSubscribe
}) => (
  <div className={`p-6 bg-[#FFF8F4] rounded-xl border border-[#FF5F00]/10 group overflow-hidden relative w-full ${className}`}>
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="accent-line !h-8 bg-primary"></div>
        <div className="text-right">
          <h4 className="text-base md:text-lg font-bold text-muted-dark leading-tight">نشرة العروض</h4>
          <p className="text-xs font-bold text-muted leading-none mt-1">تنبيهات فورية عبر واتساب</p>
        </div>
      </div>
      <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
        <Bell size={22} />
      </div>
    </div>
    
    <form onSubmit={handleSubscribe} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-subscribe-name`} className="text-xs font-bold text-muted-dark pr-1 cursor-pointer">الاسم بالكامل</label>
        <input 
          id={`${idPrefix}-subscribe-name`}
          type="text" 
          required
          placeholder="مثال: أحمد محمد..."
          value={subscribeName}
          onChange={(e) => setSubscribeName(e.target.value)}
          className="w-full bg-white border border-[#F0F0F0] rounded-xl px-5 py-3.5 text-sm font-bold text-muted-dark focus:border-primary outline-none transition-all placeholder:text-muted/30"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-subscribe-phone`} className="text-xs font-bold text-muted-dark pr-1 cursor-pointer">رقم الواتساب</label>
        <div className="relative">
          <input 
            id={`${idPrefix}-subscribe-phone`}
            type="tel" 
            required
            placeholder="01xxxxxxxxx"
            value={subscribePhone}
            onChange={(e) => setSubscribePhone(e.target.value)}
            className="w-full bg-white border border-[#F0F0F0] rounded-xl px-5 py-3.5 text-sm font-bold text-muted-dark focus:border-primary outline-none transition-all text-right placeholder:text-muted/30"
          />
          <button 
            type="submit"
            disabled={subscribeStatus === 'loading'}
            className={`absolute left-1.5 top-1.5 bottom-1.5 px-5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
              subscribeStatus === 'loading' ? 'bg-muted/20 text-muted' : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {subscribeStatus === 'loading' ? '...' : (
              <>
                <WhatsAppIcon size={14} />
                <span>اشترك</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>

    {subscribeStatus === 'success' && (
      <div className="flex items-center gap-1.5 text-success font-bold text-xs mt-4 p-3 bg-success-soft rounded-xl border border-success-soft-border animate-in fade-in slide-in-from-top-1">
        <CheckCircle2 size={14} /> تم الاشتراك بنجاح في التنبيهات
      </div>
    )}
  </div>
);

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  socialLinks = [], 
  contactInfo = { phones: [], email: '', address: '', addressUrl: '' } 
}) => {
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribePhone, setSubscribePhone] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribePhone || !subscribeName) return;

    setSubscribeStatus('loading');
    try {
      await apiService.subscribeToWhatsApp(subscribePhone, subscribeName);
      setSubscribeStatus('success');
      setSubscribePhone('');
      setSubscribeName('');
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    } catch (err: any) {
      setSubscribeStatus('error');
      setSubscribeError(err.message || 'خطأ');
    }
  };

  const visibleSocialLinks = (socialLinks || []).filter(l => l && l.url && (l.visible === true || l.visible === 1 || l.visible === undefined));
  
  const commonFormProps = {
    subscribeName,
    setSubscribeName,
    subscribePhone,
    setSubscribePhone,
    subscribeStatus,
    handleSubscribe
  };

  return (
    <footer id="main-footer" className="bg-surface relative pt-12 pb-4 px-4 md:px-6 lg:px-8 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Mobile View: Subscription Form First */}
        <div className="md:hidden mb-12">
          <SubscriptionForm idPrefix="mobile" {...commonFormProps} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          {/* Row 1, Column 1 (Right): Brand & About */}
          <div className="space-y-6 flex flex-col items-start w-full md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center overflow-hidden border border-border shrink-0">
                <img loading="lazy" decoding="async" src="https://i.postimg.cc/t4cfJRBD/FB-IMG-1775329049732.jpg" 
                  alt="صابرينكو للخدمات السياحية" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-muted-dark tracking-normal">صابرينكو</h2>
                <p className="text-primary label-caps !text-2xs mt-1">للخدمات السياحية</p>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-muted-dark leading-relaxed font-bold">
              شريكك الموثوق في عالم السفر والسياحة. نقدم لك أفضل العروض والوجهات السياحية حول العالم بأسعار تنافسية وخدمة عملاء استثنائية.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              {visibleSocialLinks.map((link, idx) => (
                <a 
                  key={link.id || idx}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={`زيارة صفحتنا على ${link.platform}`}
                  className="w-10 h-10 rounded-md bg-surface-alt border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-muted-dark shrink-0 group"
                >
                  {link.platform === 'facebook' && <Facebook size={18} className="group-hover:scale-110 transition-transform" />}
                  {link.platform === 'instagram' && <Instagram size={18} className="group-hover:scale-110 transition-transform" />}
                  {link.platform === 'whatsapp' && <WhatsAppIcon size={18} className="group-hover:scale-110 transition-transform" />}
                  {link.platform === 'twitter' && <Twitter size={18} className="group-hover:scale-110 transition-transform" />}
                  {!['facebook', 'instagram', 'whatsapp', 'twitter'].includes(link.platform) && <Globe size={18} className="group-hover:scale-110 transition-transform" />}
                </a>
              ))}
            </div>
          </div>

          {/* Row 1, Column 2 (Center): Quick Links */}
          <div className="flex flex-col items-start w-full md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-start-1">
            <h3 className="text-muted-dark text-base md:text-lg font-bold mb-6 tracking-normal flex items-center gap-2">
              <div className="accent-line"></div>
              روابط سريعة
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-y-3.5 w-full">
              {[
                { id: 'home', label: 'الرئيسية' },
                { id: 'about', label: 'من نحن' },
                { id: 'destinations', label: 'الوجهات' },
                { id: 'offers', label: 'العروض' },
                { id: 'visa', label: 'التأشيرات' },
                { id: 'contact', label: 'تواصل معنا' }
              ].map((item) => (
                <li key={item.id} className="w-full">
                  <button 
                    type="button"
                    onClick={() => onNavigate(item.id)} 
                    className="flex items-center gap-3 text-muted-dark hover:text-primary transition-all duration-300 font-medium text-sm md:text-base group w-full text-right"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all duration-300 shrink-0"></div>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Row 1 + 2, Column 3 (Left): Contact Info + Subscription (Taller) */}
          <div className="md:col-span-2 lg:col-span-1 md:col-start-1 md:row-start-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 md:grid md:grid-cols-2 lg:flex lg:flex-col gap-6 w-full relative">
            <div className="flex flex-col items-start w-full">
              <h3 className="text-muted-dark text-base md:text-lg font-bold mb-6 tracking-normal flex items-center gap-2">
                <div className="accent-line"></div>
                تواصل معنا
              </h3>
              <ul className="space-y-4 w-full">
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div className="pt-1 w-full overflow-hidden">
                    <a href={contactInfo?.addressUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-bold leading-[1.6] text-muted-dark hover:text-primary transition-colors block">
                      {contactInfo?.address || 'القاهرة، مصر'}
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1 items-start w-full">
                    {(contactInfo?.phones || []).map((phone: string, idx: number) => (
                      <a key={idx} href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-sm font-bold text-muted-dark hover:text-primary transition-colors text-right block w-full">
                        <span dir="ltr" className="inline-block">{phone}</span>
                      </a>
                    ))}
                  </div>
                </li>

                <li className="flex items-center gap-3 group w-full overflow-hidden">
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <a href={`mailto:${contactInfo?.email || 'info@sabreentourism.com'}`} className="text-sm font-bold text-muted-dark hover:text-primary transition-colors truncate block w-full">
                    {contactInfo?.email || 'info@sabreentourism.com'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription (Desktop Only) */}
            <SubscriptionForm className="hidden md:block mt-2 lg:mt-6" idPrefix="desktop" {...commonFormProps} />
          </div>

          {/* Row 2, Column 1: Payment Methods */}
          <div className="flex flex-col items-start w-full md:col-start-1 md:row-start-3 lg:col-start-1 lg:row-start-2">
            <h3 className="text-muted-dark text-base md:text-lg font-bold mb-6 tracking-normal flex items-center gap-2">
              <div className="accent-line"></div>
              طرق الدفع
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-y-3.5 gap-x-4 w-full">
              {[
                { icon: <Banknote size={18} />, label: 'الدفع كاش' },
                { icon: <Landmark size={18} />, label: 'التحويل البنكي' },
                { icon: <Smartphone size={18} />, label: 'إنستاباي (InstaPay)' },
                { icon: <Link size={18} />, label: 'لينك دفع' },
                { icon: <CreditCard size={18} />, label: 'ماكينة فيزا (POS)' }
              ].map((method, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {method.icon}
                  </div>
                  <span className="text-sm font-bold text-muted-dark">{method.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Row 2, Column 2: QR Code */}
          <div className="flex flex-col items-start w-full lg:pl-8 md:col-start-2 md:row-start-3 lg:col-start-2 lg:row-start-2">
            <h3 className="text-muted-dark text-base md:text-lg font-bold mb-6 tracking-normal flex items-center gap-2">
              <div className="accent-line"></div>
              تابعنا
            </h3>
          <div className="bg-[#F4F9FF] rounded-xl p-6 border border-[#E5F0FF] group hover:border-[#CADFFF] transition-all w-full max-w-sm">
            <div className="flex flex-row items-center justify-between gap-6">
              <div className="bg-white p-2.5 rounded-md border border-[#F0F0F0] shrink-0 group-hover:scale-105 transition-transform duration-500">
                <div className="w-20 h-20 sm:w-24 sm:h-24">
                  <img 
                    src="https://i.postimg.cc/RCfFrC3W/Whats-App-Image-2026-04-21-at-6-54-29-PM.jpg"
                    alt="QR Code"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-lg font-bold text-[#1E293B] mb-2">صفحتنا على فيسبوك</h4>
                <p className="text-xs font-bold text-[#64748B] leading-relaxed">
                  امسح الكود <br />لمتابعة أحدث <br />العروض والرحلات.
                </p>
              </div>
            </div>
          </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <p className="text-sm font-bold text-muted max-w-md">
            © {new Date().getFullYear()} صابرينكو <span className="text-primary font-extrabold">للخدمات السياحية</span>. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 bg-surface-alt/50 px-5 py-3 rounded-md border border-border shrink-0 group cursor-default hover:border-primary-soft transition-colors">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <ShieldCheck size={22} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="label-caps !text-[10px] leading-none text-muted">مرخص ومعتمد حكومياً</span>
              <span className="text-sm font-bold text-muted-dark leading-none">رقم السجل التجاري: <span className="text-primary font-extrabold" dir="ltr">275093</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
