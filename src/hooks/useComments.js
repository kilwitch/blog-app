import { useState, useEffect, useCallback } from 'react'
import commentService from '../appwrite/comments'
import { toast } from 'sonner'
import * as Sentry from '@sentry/react'

import { saveAuthorName } from '../utils/authorCache'

export function useComments(postId) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const fetchComments = useCallback(async () => {
        if (!postId) {
            setLoading(false)
            return
        }
        setLoading(true)
        setError(null)
        try {
            const res = await commentService.getComments(postId)
            if (res && res.documents) {
                res.documents.forEach((c) => {
                    if (c.userId && c.userName) {
                        saveAuthorName(c.userId, c.userName);
                    }
                });
                setComments(res.documents)
            } else {
                setComments([])
            }
        } catch (err) {
            Sentry.withScope((scope) => {
                scope.setTag("hook", "useComments");
                scope.setTag("action", "fetchComments");
                scope.setExtra("postId", postId);
                Sentry.captureException(err);
            });
            setError(err?.message || "Failed to load comments")
            setComments([])
        } finally {
            setLoading(false)
        }
    }, [postId])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const addComment = async ({ userId, userName, content }) => {
        if (!content || !content.trim()) return false
        setSubmitting(true)
        try {
            const newDoc = await commentService.createComment({
                postId,
                userId,
                userName: userName || "Anonymous",
                content: content.trim()
            })
            if (newDoc) {
                setComments((prev) => [newDoc, ...prev])
                toast.success("Comment added!")
                return true
            }
        } catch (err) {
            Sentry.withScope((scope) => {
                scope.setTag("hook", "useComments");
                scope.setTag("action", "addComment");
                scope.setExtra("postId", postId);
                scope.setExtra("userId", userId);
                Sentry.captureException(err);
            });
            toast.error(err?.message || "Failed to post comment")
            return false
        } finally {
            setSubmitting(false)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const success = await commentService.deleteComment(commentId)
            if (success) {
                setComments((prev) => prev.filter((c) => c.$id !== commentId))
                toast.success("Comment deleted.")
                return true
            }
        } catch (err) {
            Sentry.withScope((scope) => {
                scope.setTag("hook", "useComments");
                scope.setTag("action", "deleteComment");
                scope.setExtra("commentId", commentId);
                Sentry.captureException(err);
            });
            toast.error("Failed to delete comment.")
            return false
        }
    }

    return {
        comments,
        loading,
        submitting,
        error,
        addComment,
        deleteComment,
        refetch: fetchComments
    }
}
