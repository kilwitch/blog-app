import React from 'react';

export default function TopPerformingPostsCard({ posts }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-4 flex flex-col gap-3 shadow-sm">
      <h3 className="text-lg font-semibold text-[#191c21] border-b border-[#e1e2e9] pb-2">Top Performing Posts</h3>
      <ul className="flex flex-col gap-2">
        {posts.length > 0 ? (
          posts.slice(0, 3).map((p, idx) => (
            <li key={p.$id} className="flex items-center justify-between hover:bg-[#f2f3fa] p-2 rounded transition-colors">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] w-4 text-center">{idx + 1}</span>
                <span className="font-semibold text-sm text-[#191c21] truncate max-w-[160px]">{p.title}</span>
              </div>
              <span className="font-['JetBrains_Mono',monospace] text-xs text-[#10B981] font-bold">+{(idx + 1) * 12}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-gray-500 py-2">Create posts to view top metrics.</li>
        )}
      </ul>
    </div>
  );
}
