import React from 'react';

export default function ExploreHeader() {
  return (
    <section className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 pt-4 font-['Geist',sans-serif]">
      <p className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#ea580c] tracking-widest uppercase mb-3">
        EXPLORE
      </p>
      
      <p className="text-base md:text-lg text-[#5a4138] font-normal">
        Discover ideas, stories, and perspectives from the Inkflow community.
      </p>
    </section>
  );
}
