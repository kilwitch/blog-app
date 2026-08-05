import React from 'react'
import service from '../appwrite/config'
import { Link, useNavigate } from 'react-router-dom'
import { useVotes } from '../hooks/useVotes'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

function PostCard({ $id, title, featuredImage, tags = [] }) {
  const navigate = useNavigate()
  const { upvotes, downvotes } = useVotes($id)

  return (
    <Link to={`/post/${$id}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4 h-full flex flex-col justify-between hover:shadow-md transition-shadow'>
        <div>
          <div className='w-full justify-center mb-4'>
            {featuredImage && (
              <img 
                src={service.getFilePreview(featuredImage).href || service.getFilePreview(featuredImage)} 
                alt={title} 
                className='rounded-xl h-44 w-full object-cover'
              />
            )}
          </div>
          <h2 className='text-xl font-bold'>{title}</h2>
        </div>

        {/* Card Footer: Tags (left) + Vote Summary Badge (bottom-right) */}
        <div className='flex items-center justify-between gap-2 mt-4 pt-2 border-t border-gray-200'>
          <div className='flex flex-wrap gap-1'>
            {tags && tags.length > 0 && tags.map((tag, index) => (
              <span key={index} 
                onClick={(e)=> {
                  e.preventDefault();
                  navigate(`/all-posts?tag=${encodeURIComponent(tag)}`)
                }}
                className='text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full hover:bg-gray-300 transition'>
                {tag}
              </span>
            ))}
          </div>

          <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-2xs shrink-0 ml-auto'>
            <span className='inline-flex items-center gap-1 text-emerald-700'>
              <ThumbsUp className='h-3 w-3' />
              {upvotes}
            </span>
            <span className='text-gray-300'>·</span>
            <span className='inline-flex items-center gap-1 text-rose-700'>
              <ThumbsDown className='h-3 w-3' />
              {downvotes}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
