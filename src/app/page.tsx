'use client';

import React from 'react';
import PerkFluidNavbar from '@/components/landing/PerkFluidNavbar';
import PerkFluidHero from '@/components/landing/PerkFluidHero';
import PerkImpactStrip from '@/components/landing/PerkImpactStrip';
import PerkExpandableCarousel from '@/components/landing/PerkExpandableCarousel';
import PerkSocialProof from '@/components/landing/PerkSocialProof';
import PerkFluidPricing from '@/components/landing/PerkFluidPricing';
import PerkFluidFaq from '@/components/landing/PerkFluidFaq';
import PerkFluidBand from '@/components/landing/PerkFluidBand';
import PerkFluidFooter from '@/components/landing/PerkFluidFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f0] text-[#14140f] font-sans selection:bg-[#beff50] selection:text-[#14140f]">
      {/* 1. Apple-Fluid Morphing Pill Navbar */}
      <PerkFluidNavbar />

      <main>
        {/* 2. Hero Section with 3-Tab Feature Showcase */}
        <PerkFluidHero />

        {/* 3. Impact Metrics Strip (3 Large Figures) */}
        <PerkImpactStrip />

        {/* 4. The Signature Expandable Feature Carousel with Step Player */}
        <PerkExpandableCarousel />

        {/* 5. Real Businesses Social Proof */}
        <PerkSocialProof />

        {/* 6. Transparent Pricing with Monthly / Quarterly Toggle */}
        <PerkFluidPricing />

        {/* 7. FAQ Accordion */}
        <PerkFluidFaq />

        {/* 8. Conversion Grand Finale Band */}
        <PerkFluidBand />
      </main>

      {/* 9. Minimalist Footer with Copy Email */}
      <PerkFluidFooter />
    </div>
  );
}
