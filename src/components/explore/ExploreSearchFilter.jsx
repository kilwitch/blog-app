import React from 'react';

export default function ExploreSearchFilter({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  urlQuery, 
  tagQuery, 
  onClearFilters 
}) {
  return (
    <section className="mb-12 max-w-4xl mx-auto font-['Geist',sans-serif]">
      {/* Search Input Bar */}
      <form onSubmit={onSearchSubmit} className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5a4138] text-[22px]">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search posts by title or tag..."
          className="w-full bg-[#f2f3fa] border border-[#e1e2e9] rounded-full py-3.5 pl-12 pr-4 font-['Geist',sans-serif] text-sm text-[#191c21] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 transition-all shadow-xs"
        />
      </form>

      {/* Active Filter Badges */}
      {(urlQuery || tagQuery) && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {urlQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e1e2e9] text-[#191c21] rounded-full text-xs font-['JetBrains_Mono',monospace]">
              Query: <strong>"{urlQuery}"</strong>
            </span>
          )}
          {tagQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(234,88,12,0.1)] border border-[rgba(234,88,12,0.3)] text-[#ea580c] rounded-full text-xs font-['JetBrains_Mono',monospace] font-medium">
              Tag: {typeof tagQuery === 'string' ? tagQuery.replace(/^#/, '') : tagQuery}
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="text-xs text-[#ea580c] hover:underline font-['JetBrains_Mono',monospace] cursor-pointer ml-1"
          >
            Clear Filters ×
          </button>
        </div>
      )}
    </section>
  );
}
