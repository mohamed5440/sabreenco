import React from 'react';
import { motion } from 'motion/react';
import { Offer } from '../../types';
import { OfferCard } from './OfferCard';

interface OffersSectionProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  offers: Offer[];
  onViewDetails: (offer: Offer) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onNavigate, offers, onViewDetails }) => {
  const activeOffers = (offers || []).filter(o => o.status === 'نشط');

  return (
    <section id="offers-section" className="py-4 md:py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8"
      >
        <div className="text-right cursor-pointer group/title" onClick={() => onNavigate('offers')}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-soft text-primary label-caps !text-base-alt mb-4 border border-primary-soft-border">
            عروض حصرية
          </div>
          <div className="flex items-center justify-start gap-4 mb-4">
            <div className="accent-line !h-10"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-normal text-muted-dark group-hover/title:text-primary transition-colors">
              وجهات مختارة <span className="text-primary">لك</span>
            </h2>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-muted font-medium max-w-[90%] md:max-w-2xl leading-[1.7]">وجهات سياحية مختارة بعناية لتناسب تطلعاتك وتمنحك تجربة سفر لا تُنسى.</p>
        </div>
        <button 
          onClick={() => onNavigate('offers')} 
          className="group text-base font-bold text-primary hover:text-primary-hover flex items-center gap-2 transition-all duration-300 active:scale-95 select-none"
        >
          عرض كل الوجهات
          <span className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <motion.div whileHover={{ x: -2 }}>
              ←
            </motion.div>
          </span>
        </button>
      </motion.div>

      {activeOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6">
          {activeOffers.slice(0, 3).map((offer, idx) => (
            <OfferCard 
              key={offer.id}
              offer={offer}
              idx={idx}
              onNavigate={onNavigate}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-alt rounded-xl border border-border border-dashed p-8 md:p-10 text-center">
          <p className="text-muted font-bold">لا توجد عروض نشطة حالياً. يرجى مراجعة لوحة التحكم لإضافة عروض جديدة.</p>
        </div>
      )}
    </section>
  );
};

