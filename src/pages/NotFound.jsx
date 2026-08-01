import React from 'react'
import { Link } from 'react-router-dom'
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
        <div  className="max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h1 className="text-6xl font-black text-blue-600 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
            <p className="text-gray-600 mb-6 text-sm">Sorry, the page you are looking for doesn&apos;t exist or has been moved</p>
            <Link
            to= "/"
            className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition hover:bg-blue-700 shadow-sm"
            >Back to Safety</Link>
        </div>
    </div>
  )
}

export default NotFound