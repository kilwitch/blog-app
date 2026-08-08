import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function LandingFooter() {
  return (
    <footer className="bg-[#f2f3fa] rounded-2xl mx-4 mb-4 border border-[#e1e2e9] mt-16 font-['Geist',sans-serif]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <Link to="/">
            <Logo width="150px" />
          </Link>
          <p className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] max-w-[200px] mt-1">
            Built for people with something to say.
          </p>
        </div>

        {/* Links Column */}
        <div className="md:col-span-2 grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-sm text-[#191c21] mb-1">Product</h4>
            <Link to="/all-posts" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Explore Posts
            </Link>
            <Link to="/add-post" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Create Post
            </Link>
            <Link to="/dashboard" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Analytics
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-sm text-[#191c21] mb-1">Account</h4>
            <Link to="/login" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Sign Up
            </Link>
            <Link to="/dashboard" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-sm text-[#191c21] mb-1">Connect</h4>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-xs text-[#5a4138] hover:text-[#ea580c] transition-colors">
              Twitter
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="md:col-span-1 flex items-end md:justify-end">
          <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138]">
            © {new Date().getFullYear()} Inkflow. Engineering technical precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
