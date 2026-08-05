import React from 'react'
import { useAuth } from '../../hooks/useAuth'

function LogoutBtn() {
    const { logout, loading } = useAuth()

    return (
        <button
            onClick={logout}
            disabled={loading}
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    )
}

export default LogoutBtn
