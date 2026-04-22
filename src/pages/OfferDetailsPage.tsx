import React, { useEffect } from 'react';
import { Clock, CheckCircle2, ArrowRight, ArrowLeft, MapPin, X, ShieldCheck, Headphones, MessageCircle, Heart, Share2, Info } from 'lucide-react';
import { Offer } from '../types';
import { optimizeImageUrl } from '../lib/utils';

interface OfferDetailsPageProps {
  offer: Offer;
  onNavigate: (page: string, service?: string, context?: any) => void;
}

export const OfferDetailsPage: React.FC<OfferDetailsPageProps> = ({ offer, onNavigate }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!offer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-surface">
        <p className="text-lg font-medium text-muted mb-6">لم يتم العثور على تفاصيل هذا العرض.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="px-8 py-3 bg-primary text-white rounded-full font-extrabold transition-all hover:scale-105"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-surface pb-24 md:pb-12" dir="rtl">
      
      {/* Soft Top Background */}
      <div className="w-full h-64 md:h-80 bg-primary/5 absolute top-0 left-0 -z-10 rounded-b-[3rem] md:rounded-b-[5rem]"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        
        {/* Top Navigation */}
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-surface-alt/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-border w-fit order-2 md:order-1">
            <button onClick={() => onNavigate('home')} className="text-xs font-bold text-muted hover:text-primary transition-colors">الرئيسية</button>
            <ArrowLeft size={12} className="text-border-dark" />
            <button onClick={() => onNavigate('offers')} className="text-xs font-bold text-muted hover:text-primary transition-colors">العروض</button>
            <ArrowLeft size={12} className="text-border-dark" />
            <span className="text-xs font-bold text-primary truncate max-w-[120px] md:max-w-xs">{offer.title}</span>
          </div>

          <button 
            onClick={() => onNavigate('offers')}
            className="flex items-center gap-3 text-muted-dark hover:text-primary transition-all font-bold group order-1 md:order-2 self-start md:self-auto"
          >
            <span className="text-lg md:text-xl">العودة للعروض</span>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
              <ArrowLeft size={20} className="rotate-180" />
            </div>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Image Banner */}
            <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-border relative group bg-surface-alt">
              <img decoding="async" loading="eager" fetchPriority="high"
                src={optimizeImageUrl(offer.image, 1200)} 
                alt={offer.title} 
                className="w-full aspect-[16/10] md:aspect-video object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
            </div>

            {/* Content Title & Badges requested by user */}
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted-dark leading-[1.3] flex items-center gap-3 flex-wrap">
                {offer.title} <span className="text-2xl md:text-3xl">🔥</span>
              </h2>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-primary-soft text-primary px-4 py-2 rounded-xl border border-primary/10">
                  <Clock size={18} strokeWidth={2.5} />
                  <span className="text-sm font-bold">المدة: {offer.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-success-soft text-success px-4 py-2 rounded-xl border border-success/10">
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                  <span className="text-sm font-bold">متاح للحجز</span>
                </div>
                {offer.destination && (
                   <div className="flex items-center gap-2 bg-surface-alt text-muted-dark px-4 py-2 rounded-xl border border-border">
                      <MapPin size={18} />
                      <span className="text-sm font-bold">{offer.destination}</span>
                   </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <section className="bg-surface-alt p-5 md:p-8 rounded-2xl border border-border">
              <h2 className="text-xl md:text-2xl font-bold text-muted-dark mb-6 flex items-center gap-3">
                <div className="accent-line"></div>
                {offer.descriptionTitle || 'برنامج الرحلة التفصيلي'}
              </h2>
              <p className="text-base md:text-lg text-muted leading-[1.8] md:leading-[2] font-medium whitespace-pre-wrap">
                {offer.description || 'استمتع برحلة لا تُنسى مع برنامجنا السياحي المتكامل.'}
              </p>
            </section>

            {/* Inclusions & Exclusions */}
            {((offer.features && offer.features.length > 0) || (offer.notIncluded && offer.notIncluded.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offer.features && offer.features.length > 0 && (
                  <section className="bg-success/5 p-6 rounded-2xl border border-success/10">
                    <h3 className="text-lg font-bold text-success mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} />
                      العرض يشمل
                    </h3>
                    <ul className="space-y-3">
                      {offer.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm font-bold text-muted-dark">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-success"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                
                {offer.notIncluded && offer.notIncluded.length > 0 && (
                  <section className="bg-danger/5 p-6 rounded-2xl border border-danger/10">
                    <h3 className="text-lg font-bold text-danger mb-4 flex items-center gap-2">
                      <X size={20} />
                      العرض لا يشمل
                    </h3>
                    <ul className="space-y-3">
                      {offer.notIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm font-bold text-muted-dark">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-danger"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area - Pricing & Booking */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-primary-soft-border transition-colors">
              <div className="absolute top-0 right-0 left-0 h-2 bg-primary group-hover:bg-primary-hover transition-colors"></div>
              
              {/* Pricing Section */}
              <div className="mb-6 pt-2 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-muted text-lg line-through font-medium opacity-50">
                    {offer.oldPrice || (offer.price && !isNaN(parseInt(offer.price.replace(/,/g, ''))) ? Math.round(parseInt(offer.price.replace(/,/g, '')) * 1.25).toLocaleString() : '')}
                  </span>
                  <div className="bg-danger-soft text-danger label-caps !text-3xs px-2 py-0.5 rounded">
                    {offer.badgeText || 'وفر 25%'}
                  </div>
                </div>

                <div className="flex items-baseline justify-center gap-2 text-primary">
                  <span className="text-5xl md:text-6xl font-bold tracking-normal">{offer.price}</span>
                  <span className="text-xl md:text-2xl font-bold uppercase">{offer.currency || 'جنيه مصري'}</span>
                </div>
              </div>

              <div className="h-px bg-border/50 mb-6 w-full"></div>

              {/* Highlights List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-muted-dark font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <ShieldCheck size={16} />
                  </div>
                  <span>تأكيد فوري للحجز</span>
                </div>
                <div className="flex items-center gap-3 text-muted-dark font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>ضمان أقل سعر متوفر</span>
                </div>
                <div className="flex items-center gap-3 text-muted-dark font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary-soft flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Headphones size={16} />
                  </div>
                  <span>دعم فني وتوجيه 24/7</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                <button 
                  onClick={() => onNavigate('booking', 'flight', { offerName: offer.title })}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-5 rounded-xl font-extrabold text-lg md:text-xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <span>أرسل طلب حجز الآن</span>
                  <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => window.open('https://wa.me/201012345678', '_blank')}
                  className="w-full border-2 border-primary/20 hover:border-primary text-primary py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-95 bg-primary/5"
                >
                  <MessageCircle size={20} fill="currentColor" fillOpacity={0.1} />
                  <span>استفسار عبر واتساب</span>
                </button>
                
                <div className="bg-surface-alt rounded-xl p-5 border border-border">
                  <p className="text-xs text-muted-dark font-bold leading-[1.8] text-right">
                    <span className="text-primary block mb-1 underline">ملاحظة هامة:</span>
                    سيقوم فريقنا بالتواصل معك فور تلقي الطلب لتأكيد المواعيد وتوافر الأماكن النهائية.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Urgency Badge below card */}
            <div className="mt-4 flex items-center justify-center gap-2 text-danger label-caps !text-3xs bg-danger-soft/30 py-2 rounded-2xl border border-danger/10">
              <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
              <span>{offer.urgencyText || 'متبقي 4 أماكن فقط بهذا السعر'}</span>
            </div>
          </aside>

        </div>
      </main>

    </div>
  );
};

