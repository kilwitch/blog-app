import React from 'react';

export default function VoteAnalyticsCard({ netVoteScore, upvotesCount, downvotesCount }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-6 flex flex-col gap-4 items-center shadow-sm">
      <div className="w-full flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold text-[#191c21]">Vote Analytics</h3>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f2f3fa" strokeWidth="12" />
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#10B981" strokeDasharray="251.2" strokeDashoffset="32" strokeWidth="12" />
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#ba1a1a" strokeDasharray="251.2" strokeDashoffset="219.2" strokeWidth="12" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#10B981]">
            {netVoteScore >= 0 ? `+${netVoteScore}` : netVoteScore}
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138]">Net Score</span>
        </div>
      </div>

      <div className="flex gap-6 mt-2 w-full justify-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="font-['JetBrains_Mono',monospace] text-xs text-[#191c21]">{upvotesCount} Up</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
          <span className="font-['JetBrains_Mono',monospace] text-xs text-[#191c21]">{downvotesCount} Down</span>
        </div>
      </div>
    </div>
  );
}
