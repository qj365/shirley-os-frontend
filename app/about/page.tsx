import AboutHero from "@/components/about/about-hero";
import MissionSection from "@/components/about/mission-section";
import TimelineSection from "@/components/about/timeline-section";
import Premium from "@/components/landing/premium";
import React from "react";

function about() {
  return (
    <div>
      <AboutHero />

      <TimelineSection />

      <MissionSection />

      <Premium />
    </div>
  );
}

export default about;
