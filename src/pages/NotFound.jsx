import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff] px-4 text-center font-['Geist',sans-serif]">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#e1e2e9]">
        <h1 className="text-7xl font-black text-[#ea580c] mb-3 font-['JetBrains_Mono',monospace] tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#191c21] mb-2 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-[#5a4138] mb-8 text-sm leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
        >
          Return to Safety
        </Link>
      </div>
    </div>
  );
}

export default NotFound;