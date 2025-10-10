'use client';

import About from '@/components/landing/about';
import HeroSection from '@/components/landing/hero-section';
import HotSeller from '@/components/landing/hot-seller';
import Premium from '@/components/landing/premium';
import ProductCategory from '@/components/landing/product-category';
import WestAfricanSection from '@/components/landing/west-african-section';
import YellowBar from '@/components/landing/yellow-bar';
import WestAfricanBrand from '@/components/landing/west-african-brand';
import WestAfricanIngredients from '@/components/landing/west-african-ingredients';
import OurRecipes from '@/components/landing/our-recipes';
import TestimonialsSection from '@/components/landing/testimonial-section';
import React, { ReactNode } from 'react';

// Layout wrapper component for consistent spacing and width
interface SectionWrapperProps {
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  fullWidth = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {fullWidth ? children : <div className="container">{children}</div>}
    </div>
  );
};

function HomePage() {
  return (
    <div className="h-full w-full bg-[#fffbf2]">
      {/* Full-width hero section */}
      <SectionWrapper fullWidth>
        <HeroSection />
      </SectionWrapper>

      {/* Contained sections with consistent padding */}
      <SectionWrapper>
        <HotSeller />
      </SectionWrapper>

      <SectionWrapper>
        <About img="/image/landingPageImages/yellowShirtMan.png" />
      </SectionWrapper>

      {/* Product Category has its own background, so it's full width */}
      <SectionWrapper fullWidth>
        <ProductCategory />
      </SectionWrapper>

      <SectionWrapper>
        <Premium />
      </SectionWrapper>

      {/* West African Section has a split layout, so it's full width */}
      <SectionWrapper fullWidth>
        <WestAfricanSection />
      </SectionWrapper>

      <SectionWrapper fullWidth>
        <YellowBar />
      </SectionWrapper>

      <SectionWrapper fullWidth>
        <WestAfricanIngredients />
      </SectionWrapper>

      {/* Our Recipes has its own background, so it's full width */}
      <SectionWrapper fullWidth>
        <OurRecipes />
      </SectionWrapper>

      <SectionWrapper fullWidth>
        <WestAfricanBrand />
      </SectionWrapper>

      <SectionWrapper fullWidth>
        <TestimonialsSection />
      </SectionWrapper>
    </div>
  );
}

export default HomePage;
