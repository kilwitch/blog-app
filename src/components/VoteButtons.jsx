import React from 'react'
import { useSelector } from 'react-redux'
import { useVotes } from '../hooks/useVotes'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

export function VoteButtons({ postId }) {
    const userData = useSelector((state) => state.auth.userData)
    const { upvotes, downvotes, userVote, loading, voting, toggleVote } = useVotes(
        postId,
        userData?.$id
    )

    if (loading) {
        return (
            <div className="inline-flex items-center gap-2 text-xs text-gray-400 animate-pulse px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading votes...
            </div>
        )
    }

    return (
        <div className="inline-flex items-center gap-1.5">
            {/* Upvote Button */}
            <button
                onClick={() => toggleVote('up')}
                disabled={voting}
                title={userData ? "Upvote this post" : "Log in to upvote"}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    userVote === 'up'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-emerald-950/30'
                }`}
            >
                <ThumbsUp className={`h-3.5 w-3.5 ${userVote === 'up' ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                <span>{upvotes}</span>
            </button>

            {/* Downvote Button */}
            <button
                onClick={() => toggleVote('down')}
                disabled={voting}
                title={userData ? "Downvote this post" : "Log in to downvote"}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    userVote === 'down'
                        ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-rose-950/30'
                }`}
            >
                <ThumbsDown className={`h-3.5 w-3.5 ${userVote === 'down' ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{downvotes}</span>
            </button>
        </div>
    )
}
