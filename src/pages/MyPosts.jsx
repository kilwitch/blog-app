import React, { useMemo } from 'react';
import { Container, PostCard } from '../components';
import PostSkeleton from '../components/PostSkeleton';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

function MyPosts() {
    const userData = useSelector((state) => state.auth.userData);

    const userQueries = useMemo(() => {
        if (!userData?.$id) return []
        return [
            Query.equal("userid", userData.$id),
            Query.orderDesc("$createdAt")
        ]
    }, [userData?.$id])

    const { posts, loading } = usePosts(userQueries)

    if (loading) {
        return (
            <div className="w-full py-8">
                <Container>
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">My Dashboard</h1>
                    <div className="flex flex-wrap">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="p-2 w-1/4">
                                <PostSkeleton />
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Posts</h1>
                        <p className="text-sm text-gray-500">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'} published by you
                        </p>
                    </div>
                    <Link
                        to="/add-post"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow transition"
                    >
                        + Create New Post
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l5 5v11a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">No posts published yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Start sharing your thoughts with the world.</p>
                        <Link
                            to="/add-post"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Write First Post
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default MyPosts;
