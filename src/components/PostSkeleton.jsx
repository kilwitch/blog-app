import React from 'react'

function PostSkeleton() {
  return (
    <div className="w-full bg-gray-100 rounded-xl p-4 animate-pulse border border-gray-200">
      {/* Image Skeleton */}
      <div className="w-full h-40 bg-gray-300 rounded-xl mb-4"></div>
      {/* Title Skeleton */}
      <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
  )
}

export default PostSkeleton
