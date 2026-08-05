import React, { useMemo } from 'react'
import { Container, PostCard } from '../components'
import PostSkeleton from '../components/PostSkeleton'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'
import { usePosts } from '../hooks/usePosts'

function Home() {
    const authStatus = useSelector(state => state.auth.status)

    const homeQueries = useMemo(() => [
        Query.equal("status", "active"),
        Query.orderDesc("$createdAt"),
        Query.limit(4),
    ], [])

    const { posts, loading } = usePosts(homeQueries)

    if(loading){
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className='flex flex-wrap'>
                        {[1,2,3,4].map((n)=>(
                            <div key={n} className='p-2 w-1/4'>
                                <PostSkeleton/>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    // not logged in
    if(!authStatus){
        return (
            <div className='w-full py-16 text-center'>
                <Container>
                    <h1 className='text-3xl font-bold text-gray-800'>
                        Login to read posts
                    </h1>
                    <p className='text-gray-500 mt-2'>
                        Sign in to your account to view recent blog posts.
                    </p>
                </Container>
            </div>
        )
    }

    // logged in but no posts exists
  if(posts.length === 0){
    return (
         <div className="w-full py-16 text-center">
                <Container>
                    <h1 className="text-2xl font-bold text-gray-700">
                        No posts found
                    </h1>
                    <p className="text-gray-500 mt-2">Be the first to publish a post!</p>
                </Container>
            </div>
    )
  }


  return (
    <div className='w-full py-8'>
         <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
           
    </div>
  )
}

export default Home