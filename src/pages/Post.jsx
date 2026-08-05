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
import { Clock, Pencil, Trash2, Tag as TagIcon } from "lucide-react";

export default function Post() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { post, loading, deletePost } = usePost(slug);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;

    const handleDeleteClick = () => {
        setShowConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        setShowConfirmModal(false);
        await deletePost();
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={service.getFilePreview(post.featuredImage).href}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex gap-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-600 hover:bg-green-700" className="flex items-center gap-1.5 px-3 py-1.5 text-xs">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-600 hover:bg-red-700" onClick={handleDeleteClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        navigate(`/all-posts?tag=${encodeURIComponent(tag)}`)
                                    }}

                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full cursor-pointer hover:bg-blue-200 transition"
                                >
                                    <TagIcon className="h-3 w-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                     {/* Reading Time & Vote Badges */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            {calculateReadingTime(post.content)}
                        </span>

                        <span className="text-gray-300">|</span>

                        <VoteButtons postId={post.$id} />
                    </div>
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css mb-8">
                    {parse(DOMPurify.sanitize(post.content))}
                </div>

                {/* Comments Section */}
                <CommentSection postId={post.$id} />

                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Post?</h2>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to delete this post? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button 
                                    bgColor="bg-gray-300" 
                                    textColor="text-gray-800" 
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    bgColor="bg-red-600" 
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete Permanently
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    ) : null;
}