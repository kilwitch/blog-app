import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff] px-4 text-center font-['Geist',sans-serif]">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-[#e1e2e9]">
        {/* Error Alert Icon */}
        <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <span className="material-symbols-outlined text-2xl">warning</span>
        </div>

        <h1 className="text-2xl font-bold text-[#191c21] mb-2 tracking-tight">
          Something Went Wrong
        </h1>
        <p className="text-[#5a4138] text-sm mb-4 leading-relaxed">
          An unexpected system error occurred while rendering this view.
        </p>

        <div className="text-[#ba1a1a] bg-[#ffdad6]/40 p-3 rounded-lg border border-red-200 font-['JetBrains_Mono',monospace] text-xs mb-6 text-left overflow-x-auto">
          {error?.statusText || error?.message || 'An unexpected error occurred.'}
        </div>

        <Link
          to="/"
          className="inline-block bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;