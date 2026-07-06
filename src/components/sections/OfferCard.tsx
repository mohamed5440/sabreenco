import React from "react";
import { motion } from "motion/react";
import { Clock, ArrowLeft, ArrowUpLeft, MapPin } from "lucide-react";
import { Offer } from "../../types";
import { optimizeImageUrl, getWhatsAppBookingUrl } from "../../lib/utils";

interface OfferCardProps {
  offer: Offer;
  idx: number;
  onViewDetails: (offer: Offer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = React.memo(({
  offer,
  idx,
  onViewDetails,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-primary/20 flex flex-col h-full cursor-pointer text-right"
      onClick={() => onViewDetails(offer)}
      dir="rtl"
    >
      {/* Top Image Area */}
      <div className="w-full aspect-[16/10] bg-primary/5 overflow-hidden relative shrink-0 border-b border-gray-200">
        <img
          decoding="async"
          loading="lazy"
          src={optimizeImageUrl(offer.image, 600)}
          alt={offer.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-all duration-500 ease-out"
          referrerPolicy="no-referrer"
          width="400"
          height="250"
        />

        {/* Destination floating badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-2xs font-semibold border border-white/10 flex items-center gap-1.5">
            <MapPin size={10} className="text-white" />
            {offer.destination || "وجهة مختارة"}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 tracking-normal group-hover:text-primary transition-colors line-clamp-1">
          {offer.title}
        </h3>

        {/* Price & Duration Row */}
        <div className="flex items-center justify-between gap-2 mb-4 mt-2">
          {/* Duration (Right side in RTL) */}
          <div className="flex items-center gap-1.5 text-gray-800 bg-white px-2 sm:px-2.5 py-1.5 rounded-lg border border-gray-200 text-3xs sm:text-2xs font-medium shrink-0">
            <Clock size={12} className="text-primary" />
            <span>{offer.duration}</span>
          </div>

          {/* Price (Left side in RTL) */}
          <div className="text-lg sm:text-xl font-bold text-primary flex items-baseline gap-1 shrink-0">
            <span className="text-[10px] text-gray-500 font-normal ml-1">
              يبدأ من
            </span>
            <span>{offer.price}</span>
            <span className="text-xs font-semibold text-gray-500 mr-1">
              {offer.currency || "EGP"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Order / Book Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = getWhatsAppBookingUrl(offer);
              try {
                window.open(url, "_blank");
              } catch (e) {
                console.warn("window.open blocked in sandbox", e);
                window.location.href = url;
              }
            }}
            className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 px-3 rounded-xl font-medium text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>اطلب حجز</span>
            <ArrowLeft size={14} />
          </button>

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(offer);
            }}
            className="flex-1 bg-white text-gray-800 hover:text-primary py-2.5 px-3 rounded-xl font-medium text-xs md:text-sm border border-gray-200 hover:border-primary/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>التفاصيل</span>
            <ArrowUpLeft size={14} className="rotate-45" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});
