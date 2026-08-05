import React from 'react'
import { useSelector } from 'react-redux'
import { useComments } from '@/hooks/useComments'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function CommentSection({ postId }) {
    const { comments, loading, submitting, addComment, deleteComment } = useComments(postId)
    const userData = useSelector((state) => state.auth.userData)

    return (
        <Card className="w-full mt-10 border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Comments ({comments.length})
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <CommentForm onSubmit={addComment} submitting={submitting} />

                <div className="space-y-4 pt-2">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2].map((n) => (
                                <div key={n} className="flex items-start gap-3 animate-pulse">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0" />
                                    <div className="flex-1 bg-gray-100 h-16 rounded-2xl rounded-tl-none" />
                                </div>
                            ))}
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No comments yet. Be the first to start the conversation!
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.$id}
                                comment={comment}
                                currentUserId={userData?.$id}
                                onDelete={deleteComment}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
