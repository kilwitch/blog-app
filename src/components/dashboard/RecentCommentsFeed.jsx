import React from 'react';

export default function RecentCommentsFeed({ comments }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-4 flex flex-col gap-3 shadow-sm">
      <h3 className="text-lg font-semibold text-[#191c21] border-b border-[#e1e2e9] pb-2">Recent Comments</h3>
      {comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.$id} className="flex items-start gap-3 pb-3 border-b border-[#e1e2e9] last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-[#f2f3fa] border border-[#e1e2e9] flex items-center justify-center text-[#5a4138] font-bold text-xs shrink-0">
              {c.userName ? c.userName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#191c21]">{c.userName || 'User'}</span>
                <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138]">on {c.postTitle}</span>
              </div>
              <p className="text-xs text-[#5a4138]">"{c.content}"</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500 py-2">No recent comments yet.</p>
      )}
    </div>
  );
}
