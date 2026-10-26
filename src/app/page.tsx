'use client';

import React from 'react';
import PerkNavbar from '@/components/landing/PerkNavbar';
import PerkHero from '@/components/landing/PerkHero';
import PerkGreenband from '@/components/landing/PerkGreenband';
import PerkSteps from '@/components/landing/PerkSteps';
import PerkFeatures from '@/components/landing/PerkFeatures';
import PerkPricing from '@/components/landing/PerkPricing';
import PerkFaq from '@/components/landing/PerkFaq';
import PerkBand from '@/components/landing/PerkBand';
import PerkFooter from '@/components/landing/PerkFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#16201C] font-sans selection:bg-[#E4F4EC] selection:text-[#0A3D2C]">
      {/* 1. Header Navigation */}
      <PerkNavbar />

      <main>
        {/* 2. Hero Section with Mint Radial Halo & Interactive Widget Mockup */}
        <PerkHero />

        {/* 3. Greenband with Floating Stars, Cash Pulse & Live Subpanel Mockups */}
        <PerkGreenband />

        {/* 4. 3-Step Sequence (1-2-3 numbered cards) */}
        <PerkSteps />

        {/* 5. 3 Core Feature Pillars */}
        <PerkFeatures />

        {/* 6. Transparent Pricing with Monthly / Quarterly Toggle */}
        <PerkPricing />

        {/* 7. FAQ Accordion */}
        <PerkFaq />

        {/* 8. Conversion CTA Band with Stars */}
        <PerkBand />
      </main>

      {/* 9. Minimalist Footer */}
      <PerkFooter />
    </div>
  );
}
