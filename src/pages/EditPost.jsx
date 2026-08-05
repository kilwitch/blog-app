import React from 'react'
import { Container, PostForm } from '../components'
import { useParams } from 'react-router-dom'
import { usePost } from '../hooks/usePost'

function EditPost() {
    const { slug } = useParams()
    const { post, loading } = usePost(slug)

    if (loading) return null

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost