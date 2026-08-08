import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';
import { toast } from 'sonner';
import Logo from '../Logo';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        dispatch(logout());
        toast.success("Logged out successfully.");
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to log out. Please try again.");
      });
  };

  const userInitial = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : (userData?.email ? userData.email.charAt(0).toUpperCase() : 'U');

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Explore', slug: '/all-posts', active: true },
    { name: 'My Posts', slug: '/my-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 font-['Geist',sans-serif]">
      {/* Inkflow Floating Pill Navbar */}
      <nav className="mx-auto max-w-5xl w-full flex items-center justify-between gap-4 bg-white/85 backdrop-blur-md rounded-full px-6 py-2.5 border border-[#e1e2e9] shadow-md transition-all">
        {/* Left Branding Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/">
            <Logo width="140px" />
          </Link>
        </div>

        {/* Center Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            if (!item.active) return null;
            const isCurrent = location.pathname === item.slug;
            return (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    isCurrent
                      ? 'text-[#ea580c] font-semibold border-b-2 border-[#ea580c] pb-0.5'
                      : 'text-[#5a4138] hover:text-[#ea580c]'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Action Area */}
        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          {!authStatus ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-[#191c21] hover:text-[#ea580c] transition-colors cursor-pointer px-3 py-1.5"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Get Started
              </button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none cursor-pointer rounded-full p-0.5 border border-[#e1e2e9] hover:border-[#ea580c] transition-colors bg-white shadow-xs">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userData?.prefs?.avatar || ''} alt={userData?.name || 'User'} />
                    <AvatarFallback className="bg-[#ea580c] text-white font-bold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl rounded-xl p-2 border border-[#e1e2e9] z-50">
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-[#191c21] leading-none">{userData?.name || 'User'}</p>
                    <p className="text-xs text-[#5a4138] leading-none truncate mt-1">{userData?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 border-t border-[#e1e2e9]" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer flex items-center px-2 py-2 text-sm text-[#191c21] hover:bg-[rgba(234,88,12,0.08)] hover:text-[#ea580c] rounded-md font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2.5 text-[#5a4138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Inkflow Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/my-posts')}
                    className="cursor-pointer flex items-center px-2 py-2 text-sm text-[#191c21] hover:bg-[rgba(234,88,12,0.08)] hover:text-[#ea580c] rounded-md font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2.5 text-[#5a4138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    My Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/add-post')}
                    className="cursor-pointer flex items-center px-2 py-2 text-sm text-[#191c21] hover:bg-[rgba(234,88,12,0.08)] hover:text-[#ea580c] rounded-md font-medium transition"
                  >
                    <svg className="w-4 h-4 mr-2.5 text-[#5a4138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Post
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 border-t border-[#e1e2e9]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition"
                >
                  <svg className="w-4 h-4 mr-2.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;