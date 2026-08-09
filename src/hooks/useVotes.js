import { useState, useEffect, useCallback } from 'react'
import voteService from '../appwrite/votes'
import { toast } from 'sonner'
import * as Sentry from '@sentry/react'

const voteCache = new Map();
const CACHE_TTL = 60000; // 60 seconds

export function useVotes(postId, userId = null) {
    const cacheKey = `${postId}_${userId || 'guest'}`;
    const cached = voteCache.get(cacheKey);

    const [upvotes, setUpvotes] = useState(cached ? cached.data.upvotes : 0)
    const [downvotes, setDownvotes] = useState(cached ? cached.data.downvotes : 0)
    const [userVote, setUserVote] = useState(cached ? cached.data.userVote : null)
    const [loading, setLoading] = useState(!cached)
    const [voting, setVoting] = useState(false)

    const fetchVotes = useCallback(async (forceRefresh = false) => {
        if (!postId) {
            setLoading(false)
            return
        }

        const key = `${postId}_${userId || 'guest'}`;
        const existing = voteCache.get(key);

        if (!forceRefresh && existing && (Date.now() - existing.timestamp < CACHE_TTL)) {
            setUpvotes(existing.data.upvotes)
            setDownvotes(existing.data.downvotes)
            setUserVote(existing.data.userVote)
            setLoading(false)
            return;
        }

        if (!existing) setLoading(true)
        try {
            const data = await voteService.getPostVotes(postId, userId)
            voteCache.set(key, { data, timestamp: Date.now() })
            setUpvotes(data.upvotes)
            setDownvotes(data.downvotes)
            setUserVote(data.userVote)
        } catch (err) {
            Sentry.withScope((scope) => {
                scope.setTag("hook", "useVotes")
                scope.setTag("action", "fetchVotes")
                scope.setExtra("postId", postId)
                Sentry.captureException(err)
            })
        } finally {
            setLoading(false)
        }
    }, [postId, userId])

    useEffect(() => {
        fetchVotes()
    }, [fetchVotes])

    const toggleVote = async (type) => {
        if (!userId) {
            toast.error("Please log in to vote on posts.")
            return false
        }

        if (voting) return false

        const prevUp = upvotes
        const prevDown = downvotes
        const prevVote = userVote

        // Optimistic UI update
        if (userVote === type) {
            // Un-vote
            setUserVote(null)
            if (type === 'up') setUpvotes((v) => Math.max(0, v - 1))
            if (type === 'down') setDownvotes((v) => Math.max(0, v - 1))
        } else {
            // Switching or casting new vote
            if (userVote === 'up') setUpvotes((v) => Math.max(0, v - 1))
            if (userVote === 'down') setDownvotes((v) => Math.max(0, v - 1))

            if (type === 'up') setUpvotes((v) => v + 1)
            if (type === 'down') setDownvotes((v) => v + 1)

            setUserVote(type)
        }

        setVoting(true)
        try {
            const updated = await voteService.castVote({ postId, userId, voteType: type })
            const key = `${postId}_${userId || 'guest'}`;
            voteCache.set(key, { data: updated, timestamp: Date.now() })
            setUpvotes(updated.upvotes)
            setDownvotes(updated.downvotes)
            setUserVote(updated.userVote)

            if (updated.userVote === type) {
                toast.success(type === 'up' ? "Upvoted post!" : "Downvoted post.")
            } else {
                toast.info("Vote removed.")
            }
            return true
        } catch (err) {
            // Revert optimistic update on failure
            setUpvotes(prevUp)
            setDownvotes(prevDown)
            setUserVote(prevVote)

            Sentry.withScope((scope) => {
                scope.setTag("hook", "useVotes")
                scope.setTag("action", "toggleVote")
                scope.setExtra("postId", postId)
                scope.setExtra("voteType", type)
                Sentry.captureException(err)
            })

            toast.error("Failed to update vote. Please try again.")
            return false
        } finally {
            setVoting(false)
        }
    }

    return {
        upvotes,
        downvotes,
        userVote,
        loading,
        voting,
        toggleVote,
        refetch: fetchVotes
    }
}
