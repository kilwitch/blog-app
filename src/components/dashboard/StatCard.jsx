import React from 'react';

export default function StatCard({ label, value, icon, valueColor = "text-[#191c21]", loading }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-4 hover:border-[#EA580C] transition-colors duration-150 flex flex-col gap-1 shadow-sm">
      <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#5a4138] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-end justify-between mt-1">
        <span className={`font-['JetBrains_Mono',monospace] text-2xl font-semibold ${valueColor}`}>
          {loading ? '...' : value}
        </span>
        <span className="material-symbols-outlined text-[#5a4138] text-[20px]">{icon}</span>
      </div>
    </div>
  );
}
