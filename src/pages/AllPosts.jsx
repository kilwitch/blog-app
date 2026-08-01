import React, {useState, useEffect} from 'react'
import service from '../appwrite/config'
import { PostCard,Container } from '../components'
import PostSkeleton from '../components/PostSkeleton'

function AllPosts() {
    const [posts, setPosts]= useState([])
    const[loading, setLoading]= useState(true);
    useEffect(() => {
    const minDelay= new Promise(resolve => setTimeout(resolve, 600));

    Promise.all([service.getPosts([]), minDelay]).then(([postsResponse]) => {
        if (postsResponse && postsResponse.documents) {
            setPosts(postsResponse.documents);
        } else {
            setPosts([]);
        }
    }).finally(() => {
        setLoading(false);
    })
}, [])
    
    if (loading) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className='flex flex-wrap'>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className='p-2 w-1/4'>
                                <PostSkeleton />
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post)=>(
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts