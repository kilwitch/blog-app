import React, { useState, useEffect } from 'react';
import service from '../appwrite/config';
import { Container } from '../components';
import PostSkeleton from '../components/PostSkeleton';
import { Query } from 'appwrite';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ExploreHeader, ExploreSearchFilter, ExplorePostCard } from '../components/explore';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read search term from URL (e.g. /all-posts?q=react)
  const urlQuery = searchParams.get('q') || '';
  const tagQuery = searchParams.get('tag') || '';
  const [searchTerm, setSearchTerm] = useState(urlQuery);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const POSTS_PER_PAGE = 6;

  // Sync local search term with URL query
  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Reset page to 1 whenever search query or tag changes
  useEffect(() => {
    setPage(1);
  }, [urlQuery, tagQuery]);

  useEffect(() => {
    setLoading(true);

    const queries = [
      Query.equal('status', 'active'),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];

    const minDelay = new Promise((resolve) => setTimeout(resolve, 400));

    Promise.all([service.getPosts(queries), minDelay])
      .then(([postsResponse]) => {
        if (postsResponse && postsResponse.documents) {
          let fetchedPosts = postsResponse.documents;

          // 1. Robust Case-Insensitive Search (matches title, content, or tags)
          if (urlQuery.trim() !== '') {
            const q = urlQuery.trim().toLowerCase().replace(/^#/, '');
            fetchedPosts = fetchedPosts.filter((post) => {
              const titleMatch = post.title && post.title.toLowerCase().includes(q);
              const contentMatch = post.content && post.content.toLowerCase().includes(q);
              const tagMatch =
                post.tags &&
                Array.isArray(post.tags) &&
                post.tags.some((t) => typeof t === 'string' && t.toLowerCase().replace(/^#/, '').includes(q));
              return titleMatch || contentMatch || tagMatch;
            });
          }

          // 2. Tag Filter
          if (tagQuery.trim() !== '') {
            const cleanTagQuery = tagQuery.trim().replace(/^#/, '').toLowerCase();
            fetchedPosts = fetchedPosts.filter(
              (post) =>
                post.tags &&
                Array.isArray(post.tags) &&
                post.tags.some(
                  (t) => typeof t === 'string' && t.toLowerCase().replace(/^#/, '') === cleanTagQuery
                )
            );
          }

          setTotalPosts(fetchedPosts.length);

          // Apply pagination to filtered results
          const startIndex = (page - 1) * POSTS_PER_PAGE;
          const paginatedPosts = fetchedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

          setPosts(paginatedPosts);
        } else {
          setPosts([]);
          setTotalPosts(0);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, urlQuery, tagQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/all-posts?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/all-posts');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    navigate('/all-posts');
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1;

  return (
    <div className="w-full bg-[#f8f9ff] text-[#191c21] min-h-screen py-8 font-['Geist',sans-serif]">
      <Container>
        {/* Explore Redesign Page Header */}
        <ExploreHeader />

        {/* Search & Filter Bar */}
        <ExploreSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          urlQuery={urlQuery}
          tagQuery={tagQuery}
          onClearFilters={handleClearFilters}
        />

        {/* Posts Grid / Loading State */}
        <section className="mb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <PostSkeleton key={n} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ExplorePostCard key={post.$id} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#e1e2e9] rounded-xl shadow-xs">
              <h3 className="text-xl font-bold text-[#191c21] mb-2">No matching posts found</h3>
              <p className="text-sm text-[#5a4138]">Try refining your search terms or clearing active filters.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 bg-[#ea580c] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#c2410c] transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </section>

        {/* Pagination Section */}
        {!loading && totalPosts > 0 && (
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

export default AllPosts;