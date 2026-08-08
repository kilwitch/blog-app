import React from 'react';

export default function MostUsedTagsCard({ tags }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-4 flex flex-col gap-3 shadow-sm">
      <h3 className="text-lg font-semibold text-[#191c21] border-b border-[#e1e2e9] pb-2">Most Used Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const cleanTag = typeof tag === 'string' ? tag.replace(/^#/, '') : tag;
          return (
            <span
              key={cleanTag}
              className="font-['JetBrains_Mono',monospace] text-[11px] px-3 py-1 border border-[#e1e2e9] rounded-full text-[#191c21] hover:bg-[rgba(234,88,12,0.1)] hover:border-[#ea580c] hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              {cleanTag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
