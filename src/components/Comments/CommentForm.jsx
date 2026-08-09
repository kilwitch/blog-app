import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

export function CommentForm({ onSubmit, submitting }) {
    const [content, setContent] = useState('')
    const { status: authStatus, userData } = useSelector((state) => state.auth)

    const userInitial = userData?.name
        ? userData.name.charAt(0).toUpperCase()
        : 'U'

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        const success = await onSubmit({
            userId: userData.$id,
            userName: userData.name || userData.email || 'Anonymous',
            content: content.trim()
        })

        if (success) {
            setContent('')
        }
    }

    if (!authStatus) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Want to leave a comment?
                </p>
                <Link to="/login">
                    <Button variant="outline" size="sm">
                        Log in to Comment
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-2 sm:gap-3 w-full mb-6">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 mt-0.5 shadow-sm">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs sm:text-sm">
                    {userInitial}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 min-w-0">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full resize-none rounded-xl border-gray-200 dark:border-gray-700 focus:border-blue-500 text-xs sm:text-sm p-2.5 sm:p-3"
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={submitting || !content.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-2 text-xs font-semibold px-4 py-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send className="h-3.5 w-3.5" />
                                Submit
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
