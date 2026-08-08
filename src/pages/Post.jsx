import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { calculateReadingTime } from "../utils/readTime";
import { usePost } from "../hooks/usePost";
import { CommentSection } from "../components/Comments";
import { VoteButtons } from "../components/VoteButtons";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { getAuthorName } from "../utils/authorCache";

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { post, loading, deletePost } = usePost(slug);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? (post.userid === userData.$id || post.userId === userData.$id) : false;

    const handleDeleteClick = () => {
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        setShowConfirmModal(false);
        await deletePost();
    };

    const formattedDate = post?.$createdAt
        ? new Date(post.$createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "Aug 5, 2026";

    const postAuthorId = post?.userid || post?.userId;
    const authorName = getAuthorName(postAuthorId, userData, post?.authorName);
    const authorInitial = authorName ? authorName.charAt(0).toUpperCase() : "A";

    if (loading) {
        return (
            <div className="w-full bg-[#f8f9ff] min-h-screen py-16 flex items-center justify-center font-['Geist',sans-serif]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ea580c]"></div>
            </div>
        );
    }

    return post ? (
        <div className="w-full bg-[#f8f9ff] text-[#191c21] min-h-screen py-8 font-['Geist',sans-serif]">
            <Container>
                <main className="max-w-[800px] mx-auto w-full px-4 pt-4 pb-16">
                    {/* Header Section */}
                    <header className="text-center mb-10">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                {post.tags.map((tag, index) => {
                                    const cleanTag = typeof tag === 'string' ? tag.replace(/^#/, '') : tag;
                                    return (
                                        <span
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/all-posts?tag=${encodeURIComponent(cleanTag)}`);
                                            }}
                                            className="px-3 py-1 bg-[#f2f3fa] text-[#5a4138] border border-[#e1e2e9] rounded-full font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider cursor-pointer hover:border-[#ea580c] hover:text-[#ea580c] transition-colors"
                                        >
                                            {cleanTag}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-[#191c21] mb-6 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        {/* Author & Meta Info */}
                        <div className="flex flex-wrap items-center justify-center gap-3 text-[#5a4138] font-['JetBrains_Mono',monospace] text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                                    {authorInitial}
                                </div>
                                <span className="font-semibold text-[#191c21]">By {authorName}</span>
                            </div>
                            <span>·</span>
                            <span>{formattedDate}</span>
                            <span>·</span>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-[#5a4138]" />
                                <span>{calculateReadingTime(post.content)}</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <figure className="w-full rounded-2xl overflow-hidden border border-[#e1e2e9] bg-[#ecedf5] shadow-xs aspect-video relative mb-8">
                            <img
                                src={service.getFilePreview(post.featuredImage)?.href || service.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                    )}

                    {/* Author Edit/Delete Actions */}
                    {isAuthor && (
                        <div className="flex items-center justify-end gap-2 mb-8 pb-4 border-b border-[#e1e2e9]">
                            <Link to={`/edit-post/${post.$id}`}>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#5a4138] hover:text-[#ea580c] hover:bg-[#f2f3fa] rounded-lg transition-colors text-xs font-semibold font-['JetBrains_Mono',monospace] border border-[#e1e2e9] cursor-pointer">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </button>
                            </Link>
                            <button
                                onClick={handleDeleteClick}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold font-['JetBrains_Mono',monospace] border border-rose-200 cursor-pointer"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Post Content */}
                    <article className="prose prose-lg max-w-none text-[#191c21] mb-12 font-['Geist',sans-serif] leading-relaxed text-base md:text-lg">
                        {parse(DOMPurify.sanitize(post.content))}
                    </article>

                    {/* Engagement & Votes Section */}
                    <div className="py-6 border-t border-b border-[#e1e2e9] mb-12 flex items-center justify-between">
                        <VoteButtons postId={post.$id} />
                    </div>

                    {/* Comments Section */}
                    <CommentSection postId={post.$id} />

                    {/* Confirm Delete Modal */}
                    {showConfirmModal && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 font-['Geist',sans-serif]">
                            <div className="bg-white border border-[#e1e2e9] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center">
                                {/* Alert Trash Badge Header */}
                                <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-xs">
                                    <span className="material-symbols-outlined text-2xl">delete_forever</span>
                                </div>

                                <h2 className="text-xl font-bold text-[#191c21] tracking-tight mb-2">Delete Article?</h2>
                                <p className="text-[#5a4138] text-sm leading-relaxed mb-6">
                                    Are you sure you want to delete this post? This action cannot be undone and will permanently erase all associated comments.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 rounded-lg border border-[#e1e2e9] text-[#191c21] bg-[#f2f3fa] hover:bg-[#e1e2e9] font-semibold text-sm transition-colors cursor-pointer"
                                        onClick={() => setShowConfirmModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 rounded-lg bg-[#ba1a1a] hover:bg-[#93000a] text-white font-semibold text-sm transition-colors shadow-xs hover:shadow-md cursor-pointer"
                                        onClick={handleDeleteConfirm}
                                    >
                                        Delete Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </Container>
        </div>
    ) : null;
}