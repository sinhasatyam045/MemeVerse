import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeMeme, addComment } from "../store/store";
import { Heart, MessageCircle, Share2, X, Link } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const MemeDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme); // Get theme from Redux store

  const meme = useSelector((state) => state.app.memes.find((m) => m.id === id));
  const interactions = useSelector((state) => state.app.interactions[id] || { likes: 0, comments: [] });

  const [comment, setComment] = useState("");
  const [showShareSheet, setShowShareSheet] = useState(false);

  if (!meme) return <h1 className="text-center text-2xl">Meme Not Found 😢</h1>;

  const handleLike = () => dispatch(likeMeme({ memeId: id }));
  const handleComment = () => {
    if (comment.trim()) {
      dispatch(addComment({ memeId: id, comment }));
      setComment("");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: meme.title, url: window.location.href });
    } else {
      setShowShareSheet(true);
    }
  };

  const closeShareSheet = () => setShowShareSheet(false);
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard! 📋");
  };

  const shareOptions = [
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`, icon: <FaWhatsapp className="text-green-500" /> },
    { name: "Twitter", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, icon: <FaTwitter className="text-blue-400" /> },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, icon: <FaFacebook className="text-blue-600" /> },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, icon: <FaLinkedin className="text-blue-500" /> },
  ];

  return (
    <div className={`flex flex-col md:flex-row items-start justify-center min-h-screen p-6 gap-8 transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Toaster />

      {/* Left: Meme + Actions */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">{meme.title}</h1>

        <img src={meme.url} alt="{meme.title}" className="w-96 h-auto mt-4 rounded-lg shadow-md" />

        <div className="flex gap-6 mt-4 text-lg">
          <span className="flex items-center gap-2 cursor-pointer" onClick={handleLike}>
            {interactions.likes > 0 ? <Heart fill="red" size={24} /> : <Heart size={24} />}
            <span>{interactions.likes}</span>
          </span>

          <span className="flex items-center gap-2 cursor-pointer" onClick={handleShare}>
            <Share2 size={24} />
          </span>

          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <MessageCircle size={24} />
            {interactions.comments.length}
          </span>
        </div>
      </div>

      {/* Right: Comments Section */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className={`p-4 shadow-lg rounded-lg transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
          <h2 className="text-xl font-semibold text-center">Add a Comment</h2>
          <div className="flex mt-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className={`flex-1 p-2 border rounded-md transition-all ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white border-gray-300"}`}
            />
            <button className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md" onClick={handleComment}>
              Post
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Comments</h2>
          {interactions.comments.length > 0 ? (
            interactions.comments.map((c, index) => (
              <p key={index} className={`p-2 border-b transition-all ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
                {c}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Share Popup */}
      {showShareSheet && (
        <div className="fixed inset-0 flex justify-center items-end bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-t-lg p-4 shadow-lg transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Share Meme</h2>
              <X className="cursor-pointer" size={24} onClick={closeShareSheet} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {shareOptions.map((option) => (
                <a key={option.name} href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  {option.icon}
                  <span>{option.name}</span>
                </a>
              ))}
            </div>

            <button className="mt-4 flex items-center justify-center w-full py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition" onClick={copyLink}>
              <Link className="mr-2" size={20} />
              Copy Link
            </button>

            <button type='Submit'className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg" onClick={closeShareSheet}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeDetails;
