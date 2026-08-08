import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useDashboardData from '../hooks/useDashboardData';
import { Container } from '../components';
import PostSkeleton from '../components/PostSkeleton';
import { MyPostsHeader, MyPostsStats } from '../components/myposts';
import { ExplorePostCard } from '../components/explore';

function MyPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  const { posts, totalComments, upvotesCount, downvotesCount, loading } = useDashboardData(userData);

  const netVoteScore = upvotesCount - downvotesCount;

  // Filter posts based on active tab selection
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    if (activeTab === 'published') {
      return posts.filter((post) => post.status === 'active');
    }
    if (activeTab === 'drafts') {
      return posts.filter((post) => post.status === 'inactive');
    }
    return posts;
  }, [posts, activeTab]);

  // Reset page to 1 whenever activeTab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const totalFilteredPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalFilteredPosts / POSTS_PER_PAGE) || 1;

  // Apply pagination to filtered posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, page]);

  return (
    <div className="w-full bg-[#f8f9ff] text-[#191c21] min-h-screen py-8 font-['Geist',sans-serif]">
      <Container>
        <MyPostsHeader />

        <MyPostsStats
          totalPosts={posts.length}
          totalComments={totalComments}
          netVoteScore={netVoteScore}
          loading={loading}
        />

        {/* Filters & Sorting Navigation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-[#e1e2e9] pb-3">
          <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`font-semibold text-sm pb-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'all'
                  ? 'text-[#ea580c] border-b-2 border-[#ea580c] -mb-[13px]'
                  : 'text-[#5a4138] hover:text-[#191c21]'
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`font-semibold text-sm pb-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'published'
                  ? 'text-[#ea580c] border-b-2 border-[#ea580c] -mb-[13px]'
                  : 'text-[#5a4138] hover:text-[#191c21]'
              }`}
            >
              Published ({posts.filter((p) => p.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`font-semibold text-sm pb-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'drafts'
                  ? 'text-[#ea580c] border-b-2 border-[#ea580c] -mb-[13px]'
                  : 'text-[#5a4138] hover:text-[#191c21]'
              }`}
            >
              Drafts ({posts.filter((p) => p.status === 'inactive').length})
            </button>
          </div>

          <div className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] flex items-center gap-2 border border-[#e1e2e9] rounded-lg px-3 py-1.5 bg-white shadow-xs">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            <span>Sort: Newest</span>
          </div>
        </div>

        {/* Post Grid Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PostSkeleton key={n} />
            ))}
          </div>
        ) : paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedPosts.map((post) => (
              <ExplorePostCard key={post.$id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[#e1e2e9] rounded-2xl shadow-xs mb-12">
            <div className="w-12 h-12 rounded-full bg-[rgba(234,88,12,0.1)] text-[#ea580c] mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>
            <h3 className="text-xl font-bold text-[#191c21] mb-1">
              {activeTab === 'all'
                ? 'No posts written yet'
                : activeTab === 'published'
                ? 'No published posts'
                : 'No draft posts'}
            </h3>
            <p className="text-sm text-[#5a4138] mb-6">
              Start sharing your engineering ideas with the Inkflow community.
            </p>
            <button
              onClick={() => navigate('/add-post')}
              className="bg-[#ea580c] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#c2410c] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create First Post
            </button>
          </div>
        )}

        {/* Pagination Section matching Explore page */}
        {!loading && totalFilteredPosts > 0 && (
          <div className="flex justify-center items-center gap-3 mt-12 mb-8 font-['JetBrains_Mono',monospace]">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-[#191c21] border-[#e1e2e9] hover:bg-[#f2f3fa]'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1.5 text-xs text-[#191c21]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                    page === pageNum
                      ? 'bg-[#ea580c] text-white'
                      : 'bg-white border border-[#e1e2e9] text-[#191c21] hover:bg-[#f2f3fa]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-[#191c21] border-[#e1e2e9] hover:bg-[#f2f3fa]'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default MyPosts;
