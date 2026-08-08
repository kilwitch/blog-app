import { useState, useEffect } from 'react';
import { Query } from 'appwrite';
import service from '../appwrite/config';
import commentService from '../appwrite/comments';
import voteService from '../appwrite/votes';

export default function useDashboardData(userData) {
  const [posts, setPosts] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [upvotesCount, setUpvotesCount] = useState(0);
  const [downvotesCount, setDownvotesCount] = useState(0);
  const [recentComments, setRecentComments] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      if (!userData?.$id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);

        // 1. Fetch user's posts from Appwrite
        const postsRes = await service.getPosts([Query.equal("userid", userData.$id)]);
        const userPosts = postsRes?.documents || [];

        if (!isMounted) return;
        setPosts(userPosts);

        if (userPosts.length === 0) {
          setTopTags(['React', 'Node.js', 'Appwrite', 'WebDev']);
          setLoading(false);
          return;
        }

        // 2. Concurrent Parallel Fetching for Comments & Votes across all user posts
        const postPromises = userPosts.map(async (post) => {
          const [commentsRes, voteData] = await Promise.all([
            commentService.getComments(post.$id),
            voteService.getPostVotes(post.$id),
          ]);

          const comments = commentsRes?.documents
            ? commentsRes.documents.map((c) => ({ ...c, postTitle: post.title }))
            : [];

          return {
            tags: post.tags || [],
            commentCount: comments.length,
            comments,
            upvotes: voteData?.upvotes || 0,
            downvotes: voteData?.downvotes || 0,
          };
        });

        const results = await Promise.all(postPromises);
        if (!isMounted) return;

        let commentSum = 0;
        let upSum = 0;
        let downSum = 0;
        const allCommentsList = [];
        const tagFrequency = {};

        results.forEach(({ tags, commentCount, comments, upvotes, downvotes }) => {
          commentSum += commentCount;
          upSum += upvotes;
          downSum += downvotes;
          allCommentsList.push(...comments);

          if (Array.isArray(tags)) {
            tags.forEach((tag) => {
              if (tag) tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
            });
          }
        });

        setTotalComments(commentSum);
        setUpvotesCount(upSum);
        setDownvotesCount(downSum);
        setRecentComments(allCommentsList.slice(0, 3));

        const sortedTags = Object.keys(tagFrequency).sort(
          (a, b) => tagFrequency[b] - tagFrequency[a]
        );
        setTopTags(sortedTags.length > 0 ? sortedTags : ['React', 'Node.js', 'Appwrite', 'WebDev']);

      } catch (error) {
        console.error("Dashboard data fetching error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [userData]);

  return { posts, totalComments, upvotesCount, downvotesCount, recentComments, topTags, loading };
}
