import React from "react";

const FaqHero = () => {
  return (
    <div
      className="relative w-full h-[400px] sm:h-[400px] md:h-[700px] bg-cover bg-center"
      style={{
        backgroundImage: "url('/image/faq-hero.png')",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default FaqHero;