import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowLeft, ArrowUpLeft, MapPin } from 'lucide-react';
import { Offer } from '../../types';
import { optimizeImageUrl } from '../../lib/utils';

interface OfferCardProps {
  offer: Offer;
  idx: number;
  onNavigate: (page: string, service?: string, context?: any) => void;
  onViewDetails: (offer: Offer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, idx, onNavigate, onViewDetails }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-primary-soft-border flex flex-col relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden cursor-pointer shrink-0" onClick={() => onViewDetails(offer)}>
        <img decoding="async" loading="lazy" 
          src={optimizeImageUrl(offer.image, 600)} 
          alt={offer.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent"></div>
        
        {/* Offer Category/Badge */}
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full label-caps !text-2xs border border-primary-light/20">
          عرض خاص
        </div>

        {/* Location / Meta on Image */}
        <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
          <div className="flex items-center gap-1.5 text-white/90">
             <MapPin size={14} className="text-white" />
             <span className="text-xs font-bold truncate max-w-[120px]">{offer.destination || 'وجهات مختارة'}</span>
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3">
        
        {/* Title */}
        <h3 
          onClick={() => onViewDetails(offer)}
          className="text-[15px] sm:text-base font-bold text-muted-dark mb-3 leading-[1.6] cursor-pointer group-hover:text-primary transition-colors text-right"
        >
          {offer.title}
        </h3>
        
        {/* Tags / Meta Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-muted-dark text-xs sm:text-sm font-bold bg-surface-alt px-2.5 py-1.5 rounded-xl border border-border">
            <Clock size={14} className="text-primary/80" />
            {offer.duration}
          </span>
        </div>

        {/* Bottom Section: Price & Buttons */}
        <div className="mt-auto border-t border-border/80 pt-4 flex flex-col gap-3">
          
          {/* Price Header */}
          <div className="flex justify-between items-center">
            <span className="label-caps !text-3xs">السعر يبدأ من</span>
            <div className="flex items-baseline gap-1.5 text-primary text-left">
              <span className="text-xl sm:text-2xl font-bold">{offer.price}</span>
              <span className="text-xs font-bold">{offer.currency || 'ر.س'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('booking', 'flight', { offerName: offer.title })}
              className="flex-1 bg-primary text-white py-3 px-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-1.5"
            >
               <span>اطلب حجز</span>
               <ArrowLeft size={16} />
            </button>
            <button 
              onClick={() => onViewDetails(offer)}
              className="flex-1 bg-surface-alt text-muted-dark py-3 px-2 rounded-xl font-extrabold text-xs sm:text-sm border border-border hover:border-primary/30 hover:text-primary transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
               <span>التفاصيل</span>
               <ArrowUpLeft size={16} className="rotate-45" />
            </button>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};
