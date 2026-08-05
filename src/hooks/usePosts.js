import { useState, useEffect, useCallback } from 'react'
import service from '../appwrite/config'

export function usePosts(queries = []) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await service.getPosts(queries)
            if (response && response.documents) {
                setPosts(response.documents)
            } else {
                setPosts([])
            }
        } catch (err) {
            setError(err?.message || "Failed to fetch posts")
            setPosts([])
        } finally {
            setLoading(false)
        }
    }, [JSON.stringify(queries)])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    return { posts, loading, error, refetch: fetchPosts }
}
