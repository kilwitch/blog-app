import React, { useMemo } from 'react';

export default function PostingActivityChart({ posts = [] }) {
  const chartPaths = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const counts = new Array(8).fill(0);

    // Calculate post counts per month from Appwrite post $createdAt timestamps
    if (Array.isArray(posts) && posts.length > 0) {
      posts.forEach((post) => {
        if (post.$createdAt) {
          const date = new Date(post.$createdAt);
          const monthIdx = date.getMonth();
          if (monthIdx >= 0 && monthIdx < 8) {
            counts[monthIdx] += 1;
          }
        }
      });
    }

    const maxCount = Math.max(...counts, 4);

    const points = counts.map((count, idx) => {
      const x = (idx / (counts.length - 1)) * 100;
      const y = 85 - (count / maxCount) * 65;
      return { x, y, label: months[idx] };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPath = `${linePath} L100,100 L0,100 Z`;

    return { points, linePath, areaPath };
  }, [posts]);

  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg p-4 sm:p-6 h-80 flex flex-col gap-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#191c21]">Posting Activity</h3>
        <span className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] bg-[#f2f3fa] px-2.5 py-1 rounded border border-[#e1e2e9]">
          2026 (Jan-Aug)
        </span>
      </div>

      <div className="flex-1 relative w-full h-full border-b border-l border-[#e1e2e9] mt-2">
        {/* Horizontal Dashed Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-2 pointer-events-none">
          <div className="w-full border-t border-dashed border-[#e1e2e9]"></div>
          <div className="w-full border-t border-dashed border-[#e1e2e9]"></div>
          <div className="w-full border-t border-dashed border-[#e1e2e9]"></div>
          <div className="w-full border-t border-dashed border-[#e1e2e9]"></div>
        </div>

        {/* SVG Activity Line & Area Fill based on Appwrite $createdAt Timestamps */}
        <div className="absolute inset-0 flex items-end">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradClean" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gradient Area Fill */}
            <path d={chartPaths.areaPath} fill="url(#chartGradClean)" />

            {/* Activity Line */}
            <path
              d={chartPaths.linePath}
              fill="none"
              stroke="#EA580C"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Month Labels along X-Axis */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] px-1">
          {chartPaths.points.map((p) => (
            <span key={p.label} className="text-center w-6">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
