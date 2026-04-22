import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ServicePageLayoutProps {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  features: Feature[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  onCtaClick: () => void;
  children?: React.ReactNode;
}

export const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  id, badge, title, highlight, description, features, ctaTitle, ctaDescription, ctaButtonText, onCtaClick, children
}) => {
  return (
    <section id={id} className="py-4 md:py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary label-caps !text-[11px] mb-6 border border-primary-soft-border mx-auto">
          {badge}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-muted-dark mb-8 leading-tight max-w-[90%] tracking-normal">
          {title} <span className="text-primary relative inline-block">
            {highlight}
            <svg className="absolute -bottom-3 left-0 w-full h-4 text-primary/20" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 18 100 10" fill="transparent" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {children}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-surface rounded-2xl p-6 md:p-8 border border-border hover:border-primary-soft transition-all group">
            <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-primary-soft-border">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-muted-dark mb-4">{feature.title}</h3>
            <p className="text-sm text-muted leading-[1.7] font-medium">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-alt rounded-2xl p-6 md:p-8 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-right">
          <h2 className="text-2xl md:text-3xl font-bold text-muted-dark mb-4">{ctaTitle}</h2>
          <p className="text-muted font-medium max-w-xl leading-[1.7]">{ctaDescription}</p>
        </div>
        <button 
          onClick={onCtaClick}
          className="bg-primary hover:bg-primary-hover text-white px-12 py-4 rounded-xl font-extrabold text-base transition-all duration-300 flex items-center gap-3 active:scale-95 select-none shrink-0"
        >
          {ctaButtonText}
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    </section>
  );
};
