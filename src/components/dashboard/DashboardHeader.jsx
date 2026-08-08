import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function DashboardHeader({ userInitial, userName, userEmail }) {
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-[#f8f9ff] border-b border-[#e1e2e9] sticky top-0 w-full z-30">
      <div className="flex items-center gap-3">
        <Link to="/" className="md:hidden">
          <Logo width="100px" />
        </Link>
        <span className="hidden md:inline-block text-sm font-semibold text-[#5a4138]">Appwrite Live Analytics</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#5a4138] hover:text-[#ea580c] transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-[#5a4138] hover:text-[#ea580c] transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-[#e1e2e9]">
          <div className="w-8 h-8 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {userInitial}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-[#191c21]">{userName}</span>
            <span className="text-[11px] text-[#5a4138] truncate max-w-[120px]">{userEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
