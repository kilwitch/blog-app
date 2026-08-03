import React, { useState, useEffect } from 'react'
import { Container, Logo } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { toast } from 'sonner'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        dispatch(logout())
        toast.success("Logged out successfully.")
        navigate('/login')
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to log out. Please try again.")
      })
  }

  const userInitial = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : (userData?.email ? userData.email.charAt(0).toUpperCase() : 'U')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
  }, [location.search]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const currentUrlQuery = searchParams.get('q') || '';
      
      if (searchTerm.trim() !== currentUrlQuery) {
        if (searchTerm.trim()) {
          navigate(`/all-posts?q=${encodeURIComponent(searchTerm.trim())}`);
        } else if (window.location.pathname === '/all-posts') {
          navigate('/all-posts');
        }
      }
    }, 400);
    return () => clearTimeout(timer); 
  }, [searchTerm, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/all-posts?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate('/all-posts')
    }
  }

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "My Posts",
      slug: "/my-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
    <header className='py-3 shadow bg-gray-500 relative z-40'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Search Bar next to Logo */}
          {authStatus && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs ml-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 pl-9 text-sm text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          )}

          <ul className='flex ml-auto items-center gap-2'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-4 py-2 text-white hover:bg-white/20 duration-200 rounded-full text-sm font-medium'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* Extreme Right: Shadcn Avatar with Dropdown Menu */}
            {authStatus && (
              <li className="ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none cursor-pointer rounded-full p-0 border-0 bg-transparent">
                      <Avatar>
                        <AvatarImage src={userData?.prefs?.avatar || ""} alt={userData?.name || "User"} />
                        <AvatarFallback>
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl rounded-xl p-2 border border-gray-200 z-50">
                    <DropdownMenuLabel className="font-normal px-2 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{userData?.name || "User"}</p>
                        <p className="text-xs text-gray-500 leading-none truncate mt-1">{userData?.email || ""}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/my-posts")}
                        className="cursor-pointer flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium transition"
                      >
                        <svg className="w-4 h-4 mr-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Dashboard (My Posts)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/add-post")}
                        className="cursor-pointer flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium transition"
                      >
                        <svg className="w-4 h-4 mr-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Post
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1 border-t border-gray-100" />
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
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header