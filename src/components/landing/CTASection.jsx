import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  return (
    <section className="py-20 text-center rounded-3xl bg-[#f2f3fa] border border-[#e1e2e9] mx-auto max-w-4xl px-8 relative overflow-hidden my-16 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(234,88,12,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 font-['Geist',sans-serif]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#191c21] mb-8 leading-tight tracking-tight">
          Your next idea deserves<br />to be written.
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate(authStatus ? '/add-post' : '/signup')}
            className="w-full sm:w-auto bg-[#ea580c] text-white px-8 py-6 rounded-full font-semibold hover:bg-[#c2410c] transition-all shadow-md hover:shadow-lg text-base cursor-pointer"
          >
            Start Writing
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/all-posts')}
            className="w-full sm:w-auto bg-white text-[#191c21] border border-[#e1e2e9] px-8 py-6 rounded-full font-semibold hover:bg-[#e6e8ef] transition-colors text-base cursor-pointer"
          >
            Explore Inkflow
          </Button>
        </div>
      </div>
    </section>
  );
}
