import React from 'react';

export default function ProfileSummaryCard({ userName, userInitial, joinDate, repScore, onManage }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-6 flex items-center gap-6 relative overflow-hidden group hover:border-[#EA580C] transition-colors duration-300 shadow-sm">
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#e1e2e9] shrink-0 bg-[#ea580c] text-white flex items-center justify-center font-bold text-xl shadow-md">
        {userInitial}
      </div>
      <div className="flex flex-col gap-1 z-10">
        <h2 className="text-xl font-bold text-[#191c21]">{userName}</h2>
        <div className="flex items-center gap-4 font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] flex-wrap">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span> Joined {joinDate}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#10B981]">military_tech</span> Rep: {repScore}
          </span>
        </div>
        <button
          onClick={onManage}
          className="mt-2 self-start text-[#ea580c] font-['JetBrains_Mono',monospace] text-[11px] font-semibold uppercase border border-[#e1e2e9] rounded px-3 py-1 hover:border-[#ea580c] hover:bg-[rgba(234,88,12,0.05)] transition-colors cursor-pointer"
        >
          Manage Posts
        </button>
      </div>
    </div>
  );
}
