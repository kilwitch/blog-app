import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import service from '../appwrite/config'
import { toast } from 'sonner'

export function usePost(slug) {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!slug) {
            setLoading(false)
            return
        }

        setLoading(true)
        service.getPost(slug)
            .then((data) => {
                if (data) setPost(data)
                else setError("Post not found")
            })
            .catch((err) => setError(err?.message || "Failed to fetch post"))
            .finally(() => setLoading(false))
    }, [slug])

    const deletePost = async () => {
        if (!post) return false
        try {
            const status = await service.deletePost(post.$id)
            if (status) {
                await service.deleteFile(post.featuredImage)
                toast.success("Post deleted successfully.")
                navigate("/")
                return true
            } else {
                toast.error("Failed to delete post.")
                return false
            }
        } catch (err) {
            toast.error(err?.message || "Error deleting post")
            return false
        }
    }

    return { post, loading, error, deletePost }
}
