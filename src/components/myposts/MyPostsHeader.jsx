import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPostsHeader() {
  const navigate = useNavigate();

  return (
    <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 font-['Geist',sans-serif]">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#191c21] mb-2 tracking-tight">
          My Posts
        </h1>
        <p className="text-base text-[#5a4138]">
          Your writing, all in one place.
        </p>
      </div>

      <button
        onClick={() => navigate('/add-post')}
        className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 flex-shrink-0 cursor-pointer self-start sm:self-auto"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create New Post
      </button>
    </header>
  );
}
