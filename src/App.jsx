import React, { useState, useEffect, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>

          <Suspense fallback={
            <div className='py-16 text-center'>
              <div className='text-xl font-semibold text-gray-700'>Loading page...</div>
            </div>
          }>
          <Outlet />
        </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App