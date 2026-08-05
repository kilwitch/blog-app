import { useState, useEffect, useCallback } from 'react'
import voteService from '../appwrite/votes'
import { toast } from 'sonner'
import * as Sentry from '@sentry/react'

export function useVotes(postId, userId = null) {
    const [upvotes, setUpvotes] = useState(0)
    const [downvotes, setDownvotes] = useState(0)
    const [userVote, setUserVote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [voting, setVoting] = useState(false)

    const fetchVotes = useCallback(async () => {
        if (!postId) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await voteService.getPostVotes(postId, userId)
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
