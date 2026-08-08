import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BentoGrid() {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto py-12 font-['Geist',sans-serif]">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#191c21] tracking-tight">
        Engineered for expression.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Feature 1: Create & Publish (Wide Card) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-[#e1e2e9] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#ea580c] transition-all duration-300 shadow-sm hover:shadow-md min-h-[340px]">
          <div className="relative z-10 max-w-md">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#ea580c] mb-2 block uppercase tracking-wider">
              01 // Create & Publish
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#191c21] leading-tight">
              Turn your thoughts into stories.
            </h3>
          </div>

          <div className="mt-8 bg-[#f8f9ff] border-t border-l border-[#e1e2e9] rounded-tl-2xl shadow-sm p-4 flex flex-col gap-3 group-hover:translate-y-[-4px] transition-transform duration-300">
            <div className="h-9 border-b border-[#e1e2e9] flex items-center px-2 gap-3 text-[#5a4138]">
              <span className="material-symbols-outlined text-[18px]">format_bold</span>
              <span className="material-symbols-outlined text-[18px]">format_italic</span>
              <div className="w-px h-4 bg-[#e1e2e9]"></div>
              <span className="material-symbols-outlined text-[18px]">link</span>
              <span className="material-symbols-outlined text-[18px]">code</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-[#191c21]">The architecture of a great idea...</h4>
              <div className="h-2.5 bg-[#e6e8ef] rounded-full w-full"></div>
              <div className="h-2.5 bg-[#e6e8ef] rounded-full w-4/5"></div>
            </div>
          </div>
        </div>

        {/* Feature 2: Discover (Narrow Card) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#e1e2e9] p-8 flex flex-col justify-between relative overflow-hidden hover:border-[#ea580c] transition-all duration-300 shadow-sm hover:shadow-md min-h-[340px]">
          <div>
            <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#ea580c] mb-2 block uppercase tracking-wider">
              02 // Discover
            </span>
            <h3 className="text-2xl font-bold text-[#191c21] leading-tight">
              Find ideas worth reading.
            </h3>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div 
              onClick={() => navigate('/all-posts')}
              className="bg-[#f2f3fa] rounded-lg p-3 border border-[#e1e2e9] flex items-center gap-3 cursor-pointer hover:border-[#ea580c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ea580c] text-[20px]">search</span>
              <span className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138]">System Architecture...</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-[#f2f3fa] text-xs font-['JetBrains_Mono',monospace] border border-[#e1e2e9] text-[#191c21]">
                engineering
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f2f3fa] text-xs font-['JetBrains_Mono',monospace] border border-[#e1e2e9] text-[#191c21]">
                design
              </span>
              <span className="px-3 py-1 rounded-full bg-[rgba(234,88,12,0.1)] text-[#ea580c] text-xs font-['JetBrains_Mono',monospace] border border-[rgba(234,88,12,0.2)]">
                philosophy
              </span>
            </div>
          </div>
        </div>

        {/* Feature 3: Engage (Full Width Card) */}
        <div className="md:col-span-12 bg-white rounded-2xl border border-[#e1e2e9] p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden hover:border-[#ea580c] transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="max-w-lg mb-6 md:mb-0">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#ea580c] mb-2 block uppercase tracking-wider">
              03 // Engage
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#191c21] leading-tight mb-2">
              Join the conversation.
            </h3>
            <p className="text-sm text-[#5a4138]">
              Connect with fellow developers and authors through votes, comments, and discussion threads.
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-[#f8f9ff] border border-[#e1e2e9] rounded-xl p-4 shadow-sm w-full max-w-md ml-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#191c21]">Sarah Dev</span>
                    <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138]">2h ago</span>
                  </div>
                  <p className="text-xs text-[#5a4138] mb-3">
                    Fascinating approach to modern state management! Have you considered...
                  </p>
                  <div className="flex items-center gap-4 text-[#5a4138]">
                    <div className="flex items-center gap-1 hover:text-[#ea580c] cursor-pointer transition-colors text-xs font-['JetBrains_Mono',monospace]">
                      <span className="material-symbols-outlined text-[16px] text-[#10B981]">thumb_up</span>
                      <span>24 Upvotes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
