import React, { useState, useEffect, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'

import { saveAuthorName } from './utils/authorCache'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        if (userData.$id && userData.name) {
          saveAuthorName(userData.$id, userData.name);
        }
        dispatch(login({ userData }))
      } else {
        dispatch(logout())
      }
    })
    .catch(() => {
      dispatch(logout())
    })
    .finally(() => setLoading(false))
  }, [dispatch])
  
  return !loading ? (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9ff] text-[#191c21] font-['Geist',sans-serif]">
      <Toaster position="top-right" richColors closeButton />
      <div className="w-full flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="py-16 text-center">
              <div className="text-xl font-semibold text-[#5a4138]">Loading page...</div>
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