import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <section className="flex flex-col items-center text-center max-w-4xl mx-auto mt-8 sm:mt-12 mb-12 sm:mb-16 px-4 relative font-['Geist',sans-serif]">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(234,88,12,0.12)_0%,transparent_70%)] blur-3xl -z-10 pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#e6e8ef] border border-[#e2bfb2]/50 text-[10px] sm:text-[11px] font-['JetBrains_Mono',monospace] font-semibold text-[#5a4138] uppercase tracking-widest mb-6 sm:mb-8 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
        Write. Share. Discover.
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#191c21] mb-4 sm:mb-6 leading-tight font-['Geist'] tracking-tight">
        Where ideas find<br className="hidden sm:inline" /> their flow.
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-[#5a4138] max-w-2xl mb-8 sm:mb-10 font-normal leading-relaxed px-2">
        Inkflow is a modern platform to publish your engineering insights, discover technical stories, and join conversations around the ideas that matter.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto gap-3 sm:gap-4 mb-8 px-4 sm:px-0">
        <Button
          onClick={() => navigate(authStatus ? '/add-post' : '/signup')}
          className="w-full sm:w-auto bg-[#ea580c] text-white px-8 py-5 sm:py-6 rounded-full font-semibold hover:bg-[#c2410c] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base cursor-pointer"
        >
          Start Writing
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/all-posts')}
          className="w-full sm:w-auto bg-transparent text-[#191c21] border border-[#e1e2e9] px-8 py-5 sm:py-6 rounded-full font-semibold hover:bg-[#e6e8ef] transition-colors text-base cursor-pointer"
        >
          Explore Posts
        </Button>
      </div>
    </section>
  );
}
