import React ,{useState, useEffect}from 'react'
import service from '../appwrite/config'
import {Container, PostCard} from '../components'
import PostSkeleton from '../components/PostSkeleton'
import { useSelector } from 'react-redux'
import { Query } from 'appwrite'

function Home() {
    const [posts, setPosts]= useState([])
    const [loading, setLoading]= useState(true);
    const authStatus= useSelector(state=> state.auth.status); // get auth sapce

    useEffect(()=>{
        setLoading(true);

        const minDelay= new Promise(resolve => setTimeout(resolve, 600));

        const queries= [
            Query.equal("status", "active"),
            Query.orderDesc("$createdAt"),
            Query.limit(4),
        ]
        Promise.all([service.getPosts(queries), minDelay]).then(([postsResponse]) => {
            if (postsResponse && postsResponse.documents) {
                setPosts(postsResponse.documents);
            } else {
                setPosts([]);
            }
        }).finally(() => {
            setLoading(false); // false when loading complete
        })
    },[])

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