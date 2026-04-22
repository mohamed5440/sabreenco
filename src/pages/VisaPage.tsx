import React from 'react';
import { FileText, Calendar, Zap, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { Visa } from '../types';
import { ServicePageLayout } from '../components/layout/ServicePageLayout';
import { optimizeImageUrl } from '../lib/utils';

interface VisaPageProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  visas: Visa[];
}

export const VisaPage: React.FC<VisaPageProps> = ({ onNavigate, visas }) => {
  const features = [
    {
      icon: <Zap size={28} />,
      title: 'إنجاز سريع',
      description: 'نضمن لك سرعة إصدار التأشيرة في زمن قياسي بفضل علاقاتنا المباشرة وخبرتنا الطويلة.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'موثوقية تامة',
      description: 'نلتزم بالشفافية الكاملة في الرسوم والإجراءات، ونوفر لك كافة الضمانات التي تضمن حقك.'
    },
    {
      icon: <Clock size={28} />,
      title: 'دعم فني',
      description: 'فريقنا متاح للرد على استفساراتك ومساعدتك في تجهيز الأوراق المطلوبة لضمان قبول الطلب.'
    }
  ];

  return (
    <ServicePageLayout
      id="visa-page"
      badge="خدمة سريعة"
      title="خدمات"
      highlight="التأشيرات"
      description="نقدم خدمات استخراج تأشيرات زيارة الإمارات بسرعة وسهولة وبأسعار تنافسية لجميع الجنسيات مع دعم فني متكامل طوال العملية."
      features={features}
      ctaTitle="هل تحتاج إلى استشارة؟"
      ctaDescription="فريق خبرائنا جاهز لمساعدتك في اختيار نوع التأشيرة الأنسب لمخططات سفرك وشرح كافة التفاصيل المطلوبة."
      ctaButtonText="ارسل طلب تأشيرة"
      onCtaClick={() => onNavigate('booking', 'visa')}
    >
      {/* Visa Cards Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {visas.map((visa) => (
            <div key={visa.id} className="bg-surface rounded-2xl border border-border flex flex-col hover:border-primary-soft transition-all duration-300 group overflow-hidden">
              <div className="w-full aspect-[16/9] bg-primary-soft flex items-center justify-center text-primary group-hover:scale-[1.05] transition-all shrink-0 border-b border-border overflow-hidden relative">
                {visa.image ? (
                  <img 
                    src={optimizeImageUrl(visa.image, 600)} 
                    alt={visa.title} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileText size={48} strokeWidth={1} />
                )}
              </div>
              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-muted-dark mb-2 tracking-normal">{visa.title}</h3>
                <div className="text-3xl font-bold text-primary mb-4 flex items-baseline gap-1">
                  {visa.price} 
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">{visa.currency || 'درهم'}</span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-muted-dark font-bold">
                    <Calendar size={18} className="text-primary shrink-0"/>
                    المدة: {visa.duration}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-dark font-bold">
                    <Clock size={18} className="text-primary shrink-0"/>
                    الإنجاز: {visa.processingTime}
                  </li>
                  {(visa.features || []).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-dark font-bold">
                      <CheckCircle size={18} className="text-success shrink-0"/>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    const isUAE = visa.title.includes('الإمارات') || visa.title.includes('دبي');
                    onNavigate('booking', isUAE ? 'visa_uae' : 'visa_other', { visaName: visa.title });
                  }} 
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-8 rounded-xl font-extrabold text-base transition-all duration-300 flex items-center justify-center active:scale-95 select-none"
                >
                  قدم طلبك الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents Section */}
      <div className="bg-surface rounded-2xl p-4 md:p-6 mb-8 border border-border">
        <h2 className="text-2xl md:text-3xl font-bold text-muted-dark text-center mb-8 flex items-center justify-center gap-3">
          <div className="accent-line"></div>
          المستندات <span className="text-primary">المطلوبة</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-extrabold text-xl mx-auto mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
              ٠١
            </div>
            <h3 className="text-lg font-bold text-muted-dark mb-3">صورة جواز السفر</h3>
            <p className="text-sm text-muted leading-[1.7] font-medium">صورة واضحة وملونة لجواز السفر صالح لمدة 6 أشهر على الأقل من تاريخ السفر.</p>
          </div>
          
          <div className="text-center group">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-extrabold text-xl mx-auto mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
              ٠٢
            </div>
            <h3 className="text-lg font-bold text-muted-dark mb-3">صورة شخصية</h3>
            <p className="text-sm text-muted leading-[1.7] font-medium">صورة شخصية حديثة بخلفية بيضاء وبجودة عالية لضمان قبول المعاملة.</p>
          </div>
          
          <div className="text-center group">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-extrabold text-xl mx-auto mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
              ٠٣
            </div>
            <h3 className="text-lg font-bold text-muted-dark mb-3">الهوية الوطنية</h3>
            <p className="text-sm text-muted leading-[1.7] font-medium">صورة الهوية الوطنية (لبعض الجنسيات المحددة) لتدقيق البيانات الأمنية.</p>
          </div>
        </div>
      </div>
    </ServicePageLayout>
  );
};

