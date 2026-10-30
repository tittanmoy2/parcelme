import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { HeroSection } from '@/components/public/HeroSection';
import { StatsSection } from '@/components/public/StatsSection';
import { ServicesSection } from '@/components/public/ServicesSection';
import { HowItWorksSection } from '@/components/public/HowItWorksSection';
import { PricingSection } from '@/components/public/PricingSection';
import { MerchantSection } from '@/components/public/MerchantSection';
import { CoverageSection } from '@/components/public/CoverageSection';
import { FaqSection } from '@/components/public/FaqSection';
import { CtaSection } from '@/components/public/CtaSection';

export default function HomePage() {
  return (
    <div data-area="public" data-page="Landing" className="min-h-screen flex flex-col bg-white font-sans text-slate-900 overflow-x-hidden">
      <PublicNavbar />
      <main className="flex-1">
        <div className="bg-white font-sans text-slate-900 overflow-hidden">
          {/* 1. Hero Section */}
          <HeroSection />

          {/* 2. Stats Section */}
          <StatsSection />

          {/* 3. Services Section */}
          <ServicesSection />

          {/* 4. How It Works Section */}
          <HowItWorksSection />

          {/* 5. Pricing & Calculator Section */}
          <PricingSection />

          {/* 6. Merchant Dashboard Section */}
          <MerchantSection />

          {/* 7. Coverage Directory Section */}
          <CoverageSection />

          {/* 8. FAQ Accordion Section */}
          <FaqSection />

          {/* 9. CTA Banner Section */}
          <CtaSection />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
