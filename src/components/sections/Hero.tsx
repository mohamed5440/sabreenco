import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, Building, FileText, Globe, ShieldCheck, Briefcase, Check } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('flights');

  const tabs = [
    { id: 'flights', label: 'طيران', icon: Plane },
    { id: 'hotels', label: 'فنادق', icon: Building },
    { id: 'uae-visa', label: 'تاشيرة سياحة الامارات', icon: FileText },
    { id: 'other-visa', label: 'تاشيره سياحة اخري', icon: Globe },
    { id: 'insurance', label: 'تامين سفر', icon: ShieldCheck },
    { id: 'companies', label: 'تاسيس شركات', icon: Briefcase },
  ];

  const content = {
    flights: {
      type: 'flight',
      title: 'أفضل عروض الطيران',
      desc: 'احجز رحلتك القادمة بأفضل الأسعار مع كبرى شركات الطيران العالمية والمحلية.',
      features: ['امكانية التعديل', 'ادارة الحجز و Check in', 'دعم 24/7'],
      btnText: 'ارسال طلب حجز'
    },
    hotels: {
      type: 'hotel',
      title: 'فنادق ومنتجعات فاخرة',
      desc: 'استمتع بإقامة لا تنسى في أفضل الفنادق حول العالم مع خيارات تناسب جميع الميزانيات.',
      features: ['الغاء مجاني', 'وجبات', 'افضل الاختيارات'],
      btnText: 'ارسال طلب حجز'
    },
    'uae-visa': {
      type: 'visa_uae',
      title: 'تأشيرة سياحة الإمارات',
      desc: 'استخرج تأشيرة الإمارات بكل سهولة وسرعة مع فريقنا المتخصص.',
      features: ['موافقة سريعة', 'أقل المتطلبات', 'دعم فني'],
      btnText: 'ارسال طلب حجز'
    },
    'other-visa': {
      type: 'visa_other',
      title: 'تأشيرات سياحية أخرى',
      desc: 'نقدم خدمات استخراج التأشيرات لمختلف دول العالم بمهرافية عالية.',
      features: ['تغطية عالمية', 'استشارات مجانية', 'متابعة الطلب'],
      btnText: 'ارسال طلب حجز'
    },
    insurance: {
      type: 'travel_insurance',
      title: 'تأمين سفر متكامل',
      desc: 'احمِ نفسك وعائلتك أثناء السفر مع أفضل برامج التأمين الطبي والحوادث.',
      features: ['تغطية طبية واسعة', 'تعويض فوري', 'مقبول عالمياً'],
      btnText: 'ارسال طلب حجز'
    },
    companies: {
      type: 'company_setup',
      title: 'تأسيس شركات دولية',
      desc: 'نساعدك في تأسيس عملك الخاص وتوسيع نشاطك التجاري في أفضل البيئات الاستثمارية.',
      features: ['استشارات قانونية', 'سرعة في التنفيذ', 'دعم إداري'],
      btnText: 'ارسال طلب حجز'
    }
  };

  const active = content[activeTab as keyof typeof content];

  return (
    <section id="hero-section" className="relative pt-4 pb-4 md:pt-6 md:pb-6 lg:pt-8 lg:pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden w-full">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-muted/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-primary-soft/50 backdrop-blur-md text-primary label-caps !text-3xs md:!text-2xs mb-4 md:mb-6 border border-primary-soft-border/50 relative z-10"
      >
        <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-muted opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-primary"></span>
        </span>
        عروض الصيف متاحة الآن
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-normal text-muted-dark mb-4 leading-[1.2] md:leading-[1.1] max-w-5xl relative z-10 px-2"
      >
        صابرينكو <span className="text-primary">للخدمات السياحية</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-muted text-sm sm:text-base md:text-lg lg:text-xl max-w-[95%] md:max-w-3xl mb-6 md:mb-8 leading-[1.7] md:leading-[1.7] font-medium relative z-10"
      >
        نحن نأخذك في رحلة لا تنسى حول العالم بأفضل الأسعار وأرقى الخدمات، لتصنع ذكريات تدوم للأبد بكل سهولة وأمان.
      </motion.p>

      {/* Booking Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-[95vw] md:max-w-2xl lg:max-w-3xl bg-surface rounded-3xl border border-border p-4 md:p-6 relative z-10 mx-auto"
      >
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 md:gap-2 py-3 md:py-4 rounded-xl md:rounded-2xl text-3xs sm:text-2xs md:text-sm font-bold transition-all duration-300 w-full text-center ${
 activeTab === tab.id
 ? "bg-primary-light text-primary border border-primary-soft"
 : "text-muted hover:text-muted-dark bg-surface-alt/50 border border-transparent hover:bg-surface-alt"
 }`}
            >
              <tab.icon size={20} className="mb-0.5 md:mb-1 shrink-0 md:w-6 md:h-6" strokeWidth={activeTab === tab.id ? 2 : 1.5} />
              <span className="line-clamp-1 px-0.5">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center text-center px-2 md:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-normal text-muted-dark mb-3 md:mb-4 leading-tight">{active.title}</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-dark leading-[1.6] md:leading-[1.8] font-medium max-w-lg mx-auto mb-4 md:mb-6">{active.desc}</p>
          
          <button
            onClick={() => onNavigate("booking", active.type)}
            className="w-full sm:w-[90%] md:w-[80%] px-6 md:px-8 py-3.5 md:py-4 bg-primary text-white rounded-xl font-extrabold text-sm md:text-lg flex items-center justify-center hover:bg-primary-hover transition-all duration-300 active:scale-95 select-none mb-6"
          >
            {active.btnText}
          </button>

          <div className="flex flex-col items-center gap-2.5 md:gap-3 w-full">
            {active.features.map((feature, i) => (
              <div key={i} className="flex items-center justify-between gap-3 md:gap-4 text-xs md:text-base font-bold text-muted-dark bg-surface-alt px-4 md:px-6 py-2.5 md:py-3 rounded-xl border border-border w-full sm:max-w-[280px] md:max-w-[320px]">
                <span className="truncate">{feature}</span>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
                  <Check size={12} className="md:w-3.5 md:h-3.5" strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
