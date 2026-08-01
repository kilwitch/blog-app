import React from 'react'
import { useRouteError , Link} from 'react-router-dom'
function ErrorPage() {
    const error=useRouteError();
  return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
    <div className="max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">Oops!</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Something went wrong</h2>

        <p className="text-gray-600 mb-6 text-sm bg-gray-50 p-3 rounded border border-gray-200 font-mono">
            {error?.statusText || error?.message || "An unexpected error occured"}
        </p>
       <Link to="/" 
       className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition hover:bg-blue-700 shadow-sm"
       >Return to Home</Link>;

    </div>
   </div>
  )
}

export default ErrorPage