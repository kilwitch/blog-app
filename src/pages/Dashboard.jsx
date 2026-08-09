import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useDashboardData from '../hooks/useDashboardData';
import authService from '../appwrite/auth';
import { logout } from '../store/authSlice';
import { toast } from 'sonner';

import {
  StatCard,
  DashboardSidebar,
  PostingActivityChart,
  RecentPostsTable,
  VoteAnalyticsCard,
  TopPerformingPostsCard,
  MostUsedTagsCard,
  RecentCommentsFeed,
  ProfileSummaryCard,
} from '../components/dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    posts,
    totalComments,
    upvotesCount,
    downvotesCount,
    recentComments,
    topTags,
    loading,
  } = useDashboardData(userData);

  const handleLogout = useCallback(() => {
    authService.logout()
      .then(() => {
        dispatch(logout());
        toast.success("Logged out successfully.");
        navigate('/login');
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to log out.");
      });
  }, [dispatch, navigate]);

  const userInitial = useMemo(() => {
    if (userData?.name) return userData.name.charAt(0).toUpperCase();
    if (userData?.email) return userData.email.charAt(0).toUpperCase();
    return 'U';
  }, [userData]);

  const formattedJoinDate = useMemo(() => {
    return userData?.$createdAt
      ? new Date(userData.$createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      : "Mar '24";
  }, [userData]);

  const netVoteScore = upvotesCount - downvotesCount;
  const reputationScore = posts.length * 15 + upvotesCount * 5;

  return (
    <div className="bg-[#f8f9ff] text-[#191c21] min-h-screen flex font-['Geist',sans-serif] w-full">
      {/* Resizable / Collapsible Sidebar */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={handleLogout}
        onNavigate={navigate}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 ml-0 transition-all duration-300 flex flex-col min-h-screen w-full ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Dashboard Canvas */}
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto flex flex-col gap-4 sm:gap-6 pt-16 md:pt-6">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Posts" value={posts.length} icon="article" loading={loading} />
            <StatCard label="Total Comments" value={totalComments} icon="forum" loading={loading} />
            <StatCard
              label="Total Votes"
              value={netVoteScore >= 0 ? `+${netVoteScore}` : netVoteScore}
              icon="thumb_up"
              valueColor="text-[#10B981]"
              loading={loading}
            />
            <StatCard
              label="Total Views"
              value={posts.length * 12 + 45}
              icon="visibility"
              valueColor="text-[#ea580c]"
              loading={loading}
            />
          </div>

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Column (Wide) */}
            <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
              <PostingActivityChart posts={posts} />
              <RecentPostsTable posts={posts} onNavigate={navigate} />
            </div>

            {/* Right Column (Narrow) */}
            <div className="xl:col-span-4 flex flex-col gap-4 sm:gap-6">
              <VoteAnalyticsCard
                netVoteScore={netVoteScore}
                upvotesCount={upvotesCount}
                downvotesCount={downvotesCount}
              />
              <TopPerformingPostsCard posts={posts} />
              <MostUsedTagsCard tags={topTags} />
            </div>
          </div>

          {/* Bottom Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <RecentCommentsFeed comments={recentComments} />
            <ProfileSummaryCard
              userName={userData?.name || 'Developer'}
              userInitial={userInitial}
              joinDate={formattedJoinDate}
              repScore={reputationScore}
              onManage={() => navigate('/my-posts')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
