import { useState } from 'react'
import authService from '../appwrite/auth'
import { login as authLogin, logout as authLogout } from '../store/authSlice'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'

export function useAuth() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { status: isAuthenticated, userData } = useSelector((state) => state.auth)

    const login = async (data) => {
        setLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const user = await authService.getCurrentUser()
                if (user) dispatch(authLogin({ userData: user }))
                toast.success("Logged in successfully!")
                return user
            }
        } catch (err) {
            toast.error(err?.message || "Login failed")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const signup = async (data) => {
        setLoading(true)
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) dispatch(authLogin({ userData: currentUser }))
                toast.success("Account created successfully!")
                return currentUser
            }
        } catch (err) {
            toast.error(err?.message || "Signup failed")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try {
            await authService.logout()
            dispatch(authLogout())
            toast.success("Logged out")
        } catch (err) {
            toast.error("Logout failed")
        } finally {
            setLoading(false)
        }
    }

    return { isAuthenticated, userData, loading, login, signup, logout }
}
