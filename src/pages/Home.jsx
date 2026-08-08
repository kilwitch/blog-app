import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components';
import PostSkeleton from '../components/PostSkeleton';
import { HeroSection, BentoGrid, CTASection } from '../components/landing';

function Home() {
  const authStatus = useSelector((state) => state.auth.status);

  const homeQueries = useMemo(
    () => [
      Query.equal('status', 'active'),
      Query.orderDesc('$createdAt'),
      Query.limit(4),
    ],
    []
  );

  const { posts, loading } = usePosts(homeQueries);

  return (
    <div className="w-full bg-[#f8f9ff] text-[#191c21] min-h-screen flex flex-col font-['Geist',sans-serif]">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Inkflow Hero Section */}
        <HeroSection />

        {/* Dynamic Appwrite Posts Grid */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#191c21]">Featured Stories</h2>
            <span className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138]">
              {loading ? 'Loading...' : `${posts.length} Posts`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <PostSkeleton key={n} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <PostCard key={post.$id} {...post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white border border-[#e1e2e9] rounded-xl shadow-xs">
              <p className="text-sm text-[#5a4138]">No published posts found yet.</p>
            </div>
          )}
        </section>

        {/* Bento Grid Feature Cards */}
        <BentoGrid />

        {/* Call to Action Banner */}
        <CTASection />
      </main>
    </div>
  );
}

export default Home;