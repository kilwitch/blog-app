// src/components/PostCard.jsx

import React from 'react'
import service from '../appwrite/config'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, tags = [] }) {
  const navigate= useNavigate();

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

        {/* Display Tags at the Bottom of Post Card */}
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-4 pt-2 border-t border-gray-200'>
            {tags.map((tag, index) => (
              <span key={index} 
              onClick={(e)=> {
                e.preventDefault();
                navigate(`/all-posts?tag=${encodeURIComponent(tag)}`)
              }}
              
              className='text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full'>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default PostCard
