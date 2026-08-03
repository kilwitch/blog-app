import React, {useState, useEffect} from 'react'
import service from '../appwrite/config'
import { PostCard,Container } from '../components'
import PostSkeleton from '../components/PostSkeleton'
import { Query } from 'appwrite'


function AllPosts() {
    const [posts, setPosts]= useState([])
    const[loading, setLoading]= useState(true);

    //pagination
    const[page, setPage]= useState(1);
    const [totalPosts, setTotalPosts]= useState(0);
    const POSTS_PER_PAGE=8;

    useEffect(() => {
        setLoading(true);

        const offset= (page-1)*POSTS_PER_PAGE
        const limit= POSTS_PER_PAGE

        const queries= [
            Query.equal("status", "active"),
            Query.limit(POSTS_PER_PAGE),
            Query.offset(offset),
        ]
    const minDelay= new Promise(resolve => setTimeout(resolve, 600));

    Promise.all([service.getPosts(queries), minDelay]).then(([postsResponse]) => {
        if (postsResponse && postsResponse.documents) {
            setPosts(postsResponse.documents);
            setTotalPosts(postsResponse.total);

        } else {
            setPosts([]);
            setTotalPosts(0);
        }
    }).finally(() => {
        setLoading(false);
    })
}, [page]) // refetch whenever page cahnages
    
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

    const totalPages= Math.ceil(totalPosts/ POSTS_PER_PAGE) ||1;
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
            {/*Pagination*/ }

                {!loading && totalPosts >0 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-medium border ${
                    page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm"
                }`}
            >
                Previous
            </button>
            <span className="text-gray-600 text-sm font-medium">
                Page <span className="font-bold text-gray-800">{page}</span> of{" "}
                <span className="font-bold text-gray-800">{totalPages}</span>
            </span>
            <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-medium border ${
                    page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm"
                }`}
            >
                Next
            </button>
        </div>
                )}
        </Container>
    </div>
  )
}

export default AllPosts