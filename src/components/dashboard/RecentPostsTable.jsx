import React from 'react';

export default function RecentPostsTable({ posts, onNavigate }) {
  return (
    <div className="bg-white border border-[#e1e2e9] rounded-lg overflow-hidden flex flex-col shadow-sm">
      <div className="p-4 border-b border-[#e1e2e9] bg-[#f2f3fa] flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#191c21]">My Appwrite Posts ({posts.length})</h3>
        <button
          onClick={() => onNavigate('/my-posts')}
          className="font-['JetBrains_Mono',monospace] text-xs text-[#ea580c] hover:text-[#c2410c] transition-colors cursor-pointer font-medium"
        >
          Manage Posts
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#e1e2e9] bg-[#f2f3fa]">
              <th className="py-2 px-4 font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] font-semibold uppercase tracking-wider">Title</th>
              <th className="py-2 px-4 font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] font-semibold uppercase tracking-wider">Status</th>
              <th className="py-2 px-4 font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] font-semibold uppercase tracking-wider text-right">Created</th>
              <th className="py-2 px-4 font-['JetBrains_Mono',monospace] text-[11px] text-[#5a4138] font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-sm text-gray-500">
                  No posts found.{' '}
                  <button onClick={() => onNavigate('/add-post')} className="text-[#ea580c] underline">
                    Create your first post!
                  </button>
                </td>
              </tr>
            ) : (
              posts.slice(0, 5).map((post) => (
                <tr key={post.$id} className="border-b border-[#e1e2e9] hover:bg-[#f2f3fa] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#191c21] text-sm">{post.title}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                      <span className={`w-2 h-2 rounded-full ${post.status === 'inactive' ? 'bg-gray-400' : 'bg-[#10B981]'}`}></span>
                      {post.status || 'active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-['JetBrains_Mono',monospace] text-xs text-[#5a4138] text-right">
                    {new Date(post.$createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate(`/post/${post.$id}`)}
                        className="text-[#5a4138] hover:text-[#ea580c] transition-colors"
                        title="View Post"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => onNavigate(`/edit-post/${post.$id}`)}
                        className="text-[#5a4138] hover:text-[#ea580c] transition-colors"
                        title="Edit Post"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
