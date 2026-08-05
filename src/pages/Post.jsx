import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { calculateReadingTime } from "../utils/readTime";
import { usePost } from "../hooks/usePost";

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
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={handleDeleteClick}>
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

                                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                     {/* Reading Time Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
                            ⏱️ {calculateReadingTime(post.content)}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(DOMPurify.sanitize(post.content))}
                </div>

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