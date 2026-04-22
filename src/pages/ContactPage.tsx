import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Globe, MessageCircle } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { optimizeImageUrl } from '../lib/utils';

interface ContactPageProps {
  contactInfo?: {
    phones: string[];
    email: string;
    address: string;
    addressUrl: string;
  };
  socialLinks?: { platform: string; url: string }[];
}

export const ContactPage: React.FC<ContactPageProps> = ({ contactInfo, socialLinks }) => {
  const primaryPhone = contactInfo?.phones?.[0] || '+201553004593';
  const secondaryPhone = contactInfo?.phones?.[1] || '+201103103362';
  const tertiaryPhone = contactInfo?.phones?.[2] || '+201154162244';
  
  const displayPhones = contactInfo?.phones && contactInfo.phones.length > 0 
    ? contactInfo.phones 
    : [primaryPhone, secondaryPhone, tertiaryPhone];

  const contactEmail = contactInfo?.email || 'reservations@sabreenco.com';
  const whatsappLink = socialLinks?.find(s => s.platform === 'whatsapp' || s.platform === 'واتساب')?.url || `https://wa.me/${primaryPhone.replace(/\D/g, '')}`;

  return (
    <section id="contact-page" className="py-4 md:py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="text-center mb-4 md:mb-6">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-soft text-primary label-caps !text-base-alt mb-4 border border-primary-soft-border uppercase mx-auto">
           دعم متواصل
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-muted-dark mb-4 leading-tight tracking-normal">
          نسعد دائماً <br className="md:hidden" /> بـ <span className="text-primary">تواصلكم معنا</span>
        </h1>
        <p className="text-base text-muted font-medium max-w-2xl mx-auto leading-relaxed px-4">
          نحن هنا لمساعدتكم في كل ما يخص رحلاتكم. فريقنا جاهز للرد على جميع استفساراتكم وتقديم الدعم اللازم بكل احترافية على مدار الساعة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Contact Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl p-6 lg:p-8 border border-border flex flex-col justify-between"
        >
          <div className="space-y-6 md:space-y-8">
            {/* Address Section */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Globe size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="label-caps mb-2 text-right">العنوان</h3>
                <a href={contactInfo?.addressUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-dark hover:text-primary transition-colors text-base font-bold leading-relaxed block w-full text-right tracking-wide">
                  {contactInfo?.address || '1 ميدان روكسي - بجوار سينما روكسي - الدور السادس - مصر الجديده - القاهره'}
                </a>
              </div>
            </div>

            {/* Phones Section */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-col items-start w-full pt-1">
                <h3 className="label-caps mb-2 text-right">أرقام الهاتف</h3>
                <div className="flex flex-col gap-1.5 items-start w-full">
                  {displayPhones.map((phone, idx) => (
                    <a key={idx} href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-muted-dark hover:text-primary transition-colors text-base font-bold text-right block tracking-wide w-full">
                      <span dir="ltr" className="inline-block">{phone}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Section */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="label-caps mb-2 text-right">البريد الإلكتروني</h3>
                <a href={`mailto:${contactEmail}`} className="text-muted-dark hover:text-primary transition-colors text-base font-bold break-words w-full truncate block text-right tracking-wide">
                  {contactEmail}
                </a>
              </div>
            </div>
            
            {/* Facebook QR Code */}
            <div className="pt-6 md:pt-8 border-t border-border flex items-center gap-4">
               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface p-2 rounded-xl border border-border shrink-0 group hover:border-primary-soft transition-all">
                  <img 
                    src={optimizeImageUrl("https://i.postimg.cc/RCfFrC3W/Whats-App-Image-2026-04-21-at-6-54-29-PM.jpg", 200)}
                    alt="Facebook QR Code"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <div className="flex-1">
                  <h3 className="text-muted-dark text-base font-bold mb-1 tracking-wide">امسح كود فيسبوك</h3>
                  <p className="text-sm text-muted font-medium">للوصول السريع لصفحتنا والتواصل</p>
               </div>
            </div>
          </div>

          {/* WhatsApp Button */}
          <div className="mt-8 md:mt-10">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-white py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 text-base font-extrabold tracking-wide hover:bg-primary-hover transition-all active:scale-95"
            >
              <WhatsAppIcon size={20} />
              تحدث معنا عبر واتساب
            </a>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative min-h-[350px] lg:h-auto rounded-2xl border border-border overflow-hidden bg-surface"
        >
          <iframe 
            src={contactInfo?.addressUrl || "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3452.0395265189827!2d31.3157442!3d30.0930543!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f2677e86c29%3A0x9db43d23d014bfc5!2ssteps%20co%20working%20space%20Heliopolis!5e0!3m2!1sar!2seg!4v1776437866510!5m2!1sar!2seg"} 
            className="absolute inset-0 w-full h-full border-0" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع الشركة"
          ></iframe>
        </motion.div>
        
      </div>
    </section>
  );
};
