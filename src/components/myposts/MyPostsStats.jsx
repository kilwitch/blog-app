import React from 'react';
import { StatCard } from '../dashboard';

export default function MyPostsStats({ totalPosts = 0, totalComments = 0, netVoteScore = 0, loading = false }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 font-['Geist',sans-serif]">
      <StatCard label="Total Posts" value={totalPosts} icon="article" loading={loading} />
      <StatCard label="Total Comments" value={totalComments} icon="forum" loading={loading} />
      <StatCard
        label="Net Vote Score"
        value={netVoteScore >= 0 ? `+${netVoteScore}` : netVoteScore}
        icon="thumb_up"
        valueColor="text-[#10B981]"
        loading={loading}
      />
    </section>
  );
}
