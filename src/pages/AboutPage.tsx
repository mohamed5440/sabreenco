import React from 'react';
import { Globe, Award, Briefcase, Plane, Building, Target, Eye, Zap, CheckCircle, Map, Heart, FileCode } from 'lucide-react';
import { optimizeImageUrl } from '../lib/utils';

export const AboutPage: React.FC = () => {
  return (
    <section id="about-page" className="py-4 md:py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      
      {/* Header / Intro */}
      <div className="text-center mb-4 md:mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary label-caps !text-[11px] mb-4 border border-primary-soft-border mx-auto">
           عن صابرينكو
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-muted-dark mb-4 md:mb-6 leading-tight max-w-[90%] tracking-normal">
          من <span className="text-primary relative inline-block">
            نحن
            <svg className="absolute -bottom-3 left-0 w-full h-4 text-primary/20" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 18 100 10" fill="transparent" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          نحن رفيقك الموثوق في عالم السفر والخدمات اللوجستية، نسعى دائماً لتقديم تجربة فريدة تجمع بين الراحة، الاحترافية، والأسعار المنافسة.
        </p>
      </div>
        
        {/* Intro Section: Text & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-center mb-6 max-w-6xl mx-auto">
          <div className="order-2 lg:order-1 bg-primary/5 rounded-2xl p-4 md:p-6 border border-primary/10 flex flex-col justify-center text-right relative overflow-hidden h-full">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary mb-6 relative z-10">
              <Building size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-muted-dark mb-6 relative z-10 flex items-center gap-3">
              <div className="accent-line"></div>
              نبذة عنا
            </h2>
            <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium mb-8 relative z-10">
              شركة صابرينكو للخدمات السياحية هي شريكك الموثوق في عالم السفر والأعمال، حيث نقدم حلولاً سياحية متكاملة وفق أعلى معايير الجودة والاحترافية، لنمنح عملاءنا تجربة سلسة ومتميزة في كل خطوة.
            </p>
            <div className="flex items-center gap-3 bg-surface/80 backdrop-blur-sm self-start px-5 py-2.5 rounded-xl border border-primary/10 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileCode size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">التوثيق الرسمي</span>
                <span className="text-sm font-bold text-muted-dark">رقم السجل التجاري: 275093</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 w-full overflow-hidden rounded-2xl">
            <img loading="lazy" decoding="async" src={optimizeImageUrl("https://i.imghippo.com/files/GHI8600bY.png", 800)} alt="عن صابرينكو" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>

        {/* Journey Section */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-muted-dark mb-2 flex items-center justify-center gap-3">
              <div className="accent-line"></div>
              مسيرتنا
            </h2>
          </div>
          <div className="bg-surface-alt rounded-2xl p-4 md:p-6 border border-border space-y-6 text-right">
            <div className="relative pr-10 border-r-2 border-primary/30">
              <div className="absolute top-1.5 -right-[9px] w-4 h-4 rounded-full bg-primary border-4 border-surface-alt transition-transform hover:scale-125"></div>
              <h3 className="text-lg font-bold text-primary mb-3">19/03/2025</h3>
              <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium">
                انطلقت رحلتنا في دولة الإمارات العربية المتحدة تحت اسم شركة صابرين للسياحة، واضعين رؤية واضحة تتمثل في تقديم خدمات سياحية متطورة تلبي احتياجات الأفراد ورواد الأعمال على حد سواء.
              </p>
            </div>
            
            <div className="relative pr-10 border-r-2 border-primary/30">
              <div className="absolute top-1.5 -right-[9px] w-4 h-4 rounded-full bg-primary border-4 border-surface-alt transition-transform hover:scale-125"></div>
              <h3 className="text-lg font-bold text-primary mb-3">10/11/2025</h3>
              <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium">
                وانطلاقًا من حرصنا على التوسع وخدمة عملائنا بشكل أفضل، وعلى رأسهم العميل المصري الذي نعتز بثقته، تم تأسيس شركة صابرينكو للخدمات السياحية، لتكون امتدادًا قويًا لأعمالنا، ومنصة متخصصة لخدمة السوق المصري بمستوى عالٍ من المصداقية والاحترافية.
              </p>
            </div>
          </div>
        </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface p-4 md:p-6 rounded-2xl border border-border hover:border-primary-soft transition-all group relative overflow-hidden text-right">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center text-primary mb-4 border border-primary-soft-border">
            <Eye size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-muted-dark mb-3">رؤيتنا</h2>
          <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium">
            أن نكون من الشركات الرائدة في مجال السياحة والخدمات الاستثمارية في المنطقة، من خلال تقديم حلول مبتكرة وتجربة عملاء استثنائية.
          </p>
        </div>
        
        <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border hover:border-primary-soft transition-all group relative overflow-hidden text-right">
          <div className="absolute top-0 left-0 w-24 h-24 bg-secondary/5 rounded-br-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center text-primary mb-4 border border-primary-soft-border">
            <Target size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-muted-dark mb-3">رسالتنا</h2>
          <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium">
            تقديم خدمات سياحية واستثمارية موثوقة، سريعة، وذات جودة عالية، تساهم في تسهيل السفر وتنمية الأعمال لعملائنا.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-6">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-muted-dark mb-2 flex items-center justify-center gap-3">
            <div className="accent-line"></div>
            خدماتنا
          </h2>
          <p className="text-base md:text-lg text-muted-dark font-medium leading-[1.8]">
            نقدم في صابرينكو باقة متكاملة من الخدمات تشمل:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Map size={24} />, text: 'إصدار تأشيرات السياحة إلى دولة الإمارات العربية المتحدة' },
            { icon: <Globe size={24} />, text: 'إصدار التأشيرات السياحية لمختلف الوجهات العالمية' },
            { icon: <Plane size={24} />, text: 'حجز تذاكر الطيران بأفضل الأسعار' },
            { icon: <Building size={24} />, text: 'حجز الفنادق وفق أعلى معايير الراحة والجودة' },
            { icon: <Briefcase size={24} />, text: 'خدمات متخصصة لرجال الأعمال' },
            { icon: <Award size={24} />, text: 'تأسيس الشركات في دولة الإمارات وتقديم الاستشارات اللازمة' },
          ].map((service, index) => (
            <div key={index} className="bg-surface p-6 rounded-2xl border border-border flex items-start gap-4 hover:border-primary-soft transition-all group text-right">
              <div className="w-12 h-12 bg-surface-alt rounded-xl flex items-center justify-center text-primary shrink-0 border border-border group-hover:bg-primary-light transition-colors">
                {service.icon}
              </div>
              <p className="text-base md:text-lg text-muted-dark font-medium leading-[1.6] pt-1">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-surface-alt rounded-2xl p-5 md:p-6 lg:p-8 border border-border mb-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-muted-dark mb-4 flex items-center justify-center gap-3">
            <div className="accent-line"></div>
            قيمنا
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {[
            { icon: <Eye size={28} />, text: 'الشفافية' },
            { icon: <Award size={28} />, text: 'الاحترافية' },
            { icon: <Zap size={28} />, text: 'السرعة في التنفيذ' },
            { icon: <CheckCircle size={28} />, text: 'الدقة والالتزام' },
            { icon: <Heart size={28} />, text: 'رضا العميل أولاً' },
          ].map((value, index) => (
            <div key={index} className={`bg-surface p-6 rounded-2xl border border-border hover:border-primary-soft transition-all text-center flex flex-col items-center justify-center gap-4 group ${
 index === 4 
 ? 'w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]' 
 : 'w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]'
 }`}>
              <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-muted-dark">{value.text}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="text-center max-w-4xl mx-auto space-y-6 mb-8">
        <p className="text-base md:text-lg text-muted-dark leading-[1.8] font-medium">
          نؤمن بأن نجاحنا يبدأ من ثقة عملائنا، لذلك نحرص دائمًا على تقديم تجربة مميزة تعتمد على الجودة العالية وخدمة عملاء احترافية، مدعومة بفريق عمل ذو خبرة متنامية في السوق السياحي والاستثماري.
        </p>
        <div className="inline-block bg-primary-light/50 border border-primary-soft rounded-2xl p-5 md:p-6">
          <p className="text-xl md:text-2xl font-bold text-primary leading-relaxed">
            صابرينكو... حيث تبدأ رحلتك بثقة، وتنمو أعمالك باحترافية.
          </p>
        </div>
      </div>

    </section>
  );
};
