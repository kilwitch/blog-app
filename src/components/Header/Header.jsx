import React, { useState, useEffect } from 'react'
import {Container,Logo,LogoutBtn} from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(()=>{
    const searchParams= new URLSearchParams(location.search);
    const q= searchParams.get('q')|| '';
    setSearchTerm(q);

  },[location.search]);

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
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
    <header className='py-3 shadow bg-gray-500'>
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

          <ul className='flex ml-auto items-center'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header