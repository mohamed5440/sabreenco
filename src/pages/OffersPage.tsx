import React from 'react';
import { OfferCard } from '../components/sections/OfferCard';
import { Offer } from '../types';

interface OffersPageProps {
  onNavigate: (page: string, service?: string, context?: any) => void;
  offers: Offer[];
  onViewDetails: (offer: Offer) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate, offers, onViewDetails }) => {
  return (
    <div className="py-8 md:py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary label-caps !text-base-alt mb-6 border border-primary-soft-border mx-auto">
           أفضل الأسعار
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-muted-dark mb-8 leading-tight max-w-[90%] tracking-normal">
          أحدث <span className="text-primary relative inline-block">
            العروض
            <svg className="absolute -bottom-3 left-0 w-full h-4 text-primary/20" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 18 100 10" fill="transparent" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          اكتشف أفضل العروض والخصومات على الرحلات السياحية حول العالم. باقات متكاملة تشمل الطيران والفنادق والجولات السياحية المميزة.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(offers || []).filter(o => o.status === 'نشط').map((offer, idx) => (
          <OfferCard 
            key={offer.id} 
            offer={offer} 
            idx={idx} 
            onNavigate={onNavigate} 
            onViewDetails={onViewDetails} 
          />
        ))}
      </div>
    </div>
  );
};
