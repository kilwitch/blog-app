import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CommentItem({ comment, currentUserId, onDelete }) {
    const initial = comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'
    const isAuthor = currentUserId && comment.userId === currentUserId

    const formattedDate = comment.$createdAt
        ? new Date(comment.$createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          })
        : ''

    return (
        <div className="flex items-start gap-3 w-full py-2">
            
            <Avatar className="h-10 w-10 shrink-0 shadow-sm">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm">
                    {initial}
                </AvatarFallback>
            </Avatar>

            
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-2xl rounded-tl-none p-4 shadow-sm relative group">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {comment.userName || 'User'}
                        </span>
                        {formattedDate && (
                            <span className="text-xs text-gray-400">
                                {formattedDate}
                            </span>
                        )}
                    </div>

                    {isAuthor && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onDelete(comment.$id)}
                            className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete comment"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                </p>
            </div>
        </div>
    )
}
