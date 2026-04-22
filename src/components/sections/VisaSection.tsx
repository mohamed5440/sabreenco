import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap } from 'lucide-react';
import { optimizeImageUrl } from '../../lib/utils';

import { Visa } from '../../types';

interface VisaSectionProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  visas?: Visa[];
}

export const VisaSection: React.FC<VisaSectionProps> = ({ onNavigate, visas = [] }) => {
  return (
    <section id="visa-section" className="py-4 md:py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Right Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative z-10 text-right"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary label-caps !text-2xs mb-6 border border-primary/20 uppercase tracking-widest">
              خدمات التأشيرة
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-normal text-muted-dark mb-6 leading-tight">حلول تأشيرة <br className="hidden md:block"/><span className="text-primary">سريعة وموثوقة</span></h2>
            <p className="text-base text-muted mb-8 leading-relaxed font-medium max-w-lg">
              نحن نوفر لك أسرع وأسهل طريقة للحصول على تأشيرات الدخول مع متابعة دقيقة لطلبك أونلاين بالكامل. لدينا حالياً {visas.length > 0 ? `${visas.length} أنواع مختلفة من التأشيرات` : 'مجموعة متنوعة من التأشيرات'} المتاحة.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-10">
              {[
                'سياحة داخلية',
                'سياحة خارجية',
                'تأشيرة الإمارات',
                'رحلات عمرة',
                'حجز طيران',
                'حجز فنادق'
              ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-surface hover:bg-primary/5 border border-border hover:border-primary-soft transition-all group">
                  <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-muted group-hover:text-primary shrink-0 transition-colors">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold text-muted-dark">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('booking', 'visa')} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-extrabold text-sm transition-all duration-300 w-full sm:w-auto flex items-center justify-center active:scale-95">
              ابدأ طلب التأشيرة
            </button>
          </motion.div>

          {/* Left Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative mt-8 lg:mt-0"
          >
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-[80px] pointer-events-none -z-10"></div>
            
            <div className="rounded-2xl overflow-hidden relative z-10 border border-border">
              <img decoding="async" loading="lazy" 
                src={optimizeImageUrl("https://images.unsplash.com/photo-1512453979798-5ea266f8880c", 800)}
                alt="Dubai Burj Al Arab"
                className="w-full h-[400px] md:h-[550px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -right-4 sm:-right-8 top-12 bg-surface/95 backdrop-blur-md p-4 pr-5 rounded-2xl border border-border flex items-center gap-4 z-20 animate-bounce-slow">
              <div className="text-right">
                <p className="text-sm font-bold text-muted-dark leading-tight mb-0.5">موافقة سريعة</p>
                <p className="text-base-alt text-muted font-bold">خلال 48 ساعة</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="absolute -left-4 sm:-left-8 bottom-12 bg-surface/95 backdrop-blur-md p-4 pl-5 rounded-2xl border border-border flex items-center gap-4 z-20 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <Zap size={20} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-muted-dark leading-tight mb-0.5">إجراءات مبسطة</p>
                <p className="text-base-alt text-muted font-bold">أونلاين بالكامل</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
