import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../../appwrite/config';
import { useVotes } from '../../hooks/useVotes';
import { getAuthorName } from '../../utils/authorCache';

export default function ExplorePostCard({
  $id,
  title,
  content,
  featuredImage,
  tags,
  $createdAt,
  userid,
  userId,
  authorName,
}) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const { upvotes, downvotes, userVote, voting, toggleVote } = useVotes(
    $id,
    userData?.$id
  );

  const formattedDate = $createdAt
    ? new Date($createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Oct 22';

  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)
    : null;

  // Extract clean text from HTML content
  const cleanContent = typeof content === 'string'
    ? content.replace(/<[^>]+>/g, '').slice(0, 110) + '...'
    : 'Read the full story on Inkflow...';

  // Resolve author display name and avatar initial reliably
  const postAuthorId = userid || userId;
  const displayName = getAuthorName(postAuthorId, userData, authorName);
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : 'A';

  return (
    <article
      onClick={() => navigate(`/post/${$id}`)}
      className="flex flex-col bg-white border border-[#e1e2e9] rounded-xl overflow-hidden hover:border-[#ea580c] transition-all duration-300 cursor-pointer h-full group shadow-xs hover:shadow-md font-['Geist',sans-serif]"
    >
      {/* Featured Image or Icon Container */}
      <div className="aspect-video w-full overflow-hidden relative bg-[#f2f3fa] flex items-center justify-center border-b border-[#e1e2e9]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-[#5a4138] group-hover:scale-110 transition-transform duration-500">
            article
          </span>
        )}
      </div>

      {/* Card Body Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Header Author Info & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-['JetBrains_Mono',monospace] text-[10px] font-bold">
              {displayInitial}
            </div>
            <span className="font-semibold text-xs text-[#191c21] truncate max-w-[120px]">
              {displayName}
            </span>
          </div>
          <span className="font-['JetBrains_Mono',monospace] text-xs text-[#5a4138]">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#191c21] mb-2 line-clamp-2 leading-snug group-hover:text-[#ea580c] transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-[#5a4138] line-clamp-2 flex-grow mb-4 leading-relaxed">
          {cleanContent}
        </p>

        {/* Upvotes, Downvotes, & Comments Bar */}
        <div className="flex items-center justify-between py-2.5 border-y border-[#e1e2e9] my-3 text-[#5a4138]">
          <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono',monospace]">
            {/* Upvote Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVote('up');
              }}
              disabled={voting}
              className={`flex items-center gap-1 hover:text-[#ea580c] transition-colors cursor-pointer ${
                userVote === 'up' ? 'text-[#ea580c] font-bold' : ''
              }`}
              title={userData ? "Upvote this post" : "Log in to upvote"}
            >
              <span className={`material-symbols-outlined text-[16px] ${userVote === 'up' ? 'text-[#10B981]' : ''}`}>
                thumb_up
              </span>
              <span>{upvotes}</span>
            </button>

            {/* Downvote Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVote('down');
              }}
              disabled={voting}
              className={`flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer ${
                userVote === 'down' ? 'text-rose-600 font-bold' : ''
              }`}
              title={userData ? "Downvote this post" : "Log in to downvote"}
            >
              <span className="material-symbols-outlined text-[16px]">thumb_down</span>
              <span>{downvotes}</span>
            </button>

            {/* Comments Icon */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${$id}#comments`);
              }}
              className="flex items-center gap-1 ml-2 hover:text-[#ea580c] transition-colors cursor-pointer"
              title="Discuss story"
            >
              <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
              <span>Discuss</span>
            </div>
          </div>
        </div>

        {/* Footer Tags & Read Time */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-wrap gap-1.5">
            {Array.isArray(tags) && tags.length > 0 && (
              tags.slice(0, 3).map((tag) => {
                const cleanTag = typeof tag === 'string' ? tag.replace(/^#/, '') : tag;
                if (!cleanTag) return null;
                return (
                  <span
                    key={cleanTag}
                    className="bg-[#f2f3fa] px-2 py-0.5 rounded-full font-['JetBrains_Mono',monospace] text-[10px] text-[#5a4138] border border-[#e1e2e9]"
                  >
                    {cleanTag}
                  </span>
                );
              })
            )}
          </div>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] whitespace-nowrap">
            5 min read
          </span>
        </div>
      </div>
    </article>
  );
}
