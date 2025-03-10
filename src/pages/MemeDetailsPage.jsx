import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likeMeme, addComment, deleteComment } from "../store/store"; // Add deleteComment import
import { Heart, MessageCircle, Share2, X, Link as LinkIcon } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const MemeDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);
  const meme = useSelector((state) => state.app.memes.find((m) => m.id === id));
  const interactions = useSelector((state) => state.app.interactions[id] || { likes: 0, comments: [] });

  const [comment, setComment] = useState("");
  const [showShareSheet, setShowShareSheet] = useState(false);

  if (!meme) return <h1 className="text-center text-3xl font-semibold text-blue-600">Meme Not Found 😢</h1>;

  const handleLike = () => dispatch(likeMeme({ memeId: id }));
  const handleComment = () => {
    if (comment.trim()) {
      dispatch(addComment({ memeId: id, comment }));
      setComment("");
    }
  };

  const handleDeleteComment = (commentIndex) => {
    dispatch(deleteComment({ memeId: id, commentIndex }));
    toast.success("Comment deleted! 🗑️");
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
    <div className={`flex flex-col md:flex-row items-start justify-center min-h-screen p-8 gap-10 transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Toaster />

      {/* Left: Meme + Actions */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        <Link to="/explore" className="px-4 py-2 font-semibold rounded-md border border-gray-400   bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white">
          ← Explore Back
        </Link>
        <h1 className="text-4xl font-bold text-blue-600">{meme.title}</h1>

        <img src={meme.url} alt="{meme.title}" className="w-96 h-auto mt-6 rounded-lg shadow-lg border border-gray-300" />

        {/* Actions */}
        <div className="flex gap-8 mt-5 text-lg">
          <span className="flex items-center gap-2 cursor-pointer hover:text-red-500" onClick={handleLike}>
            {interactions.likes > 0 ? <Heart fill="red" size={24} /> : <Heart size={24} />}
            <span>{interactions.likes}</span>
          </span>

          <span className="flex items-center gap-2 cursor-pointer hover:text-blue-500" onClick={handleShare}>
            <Share2 size={24} />
          </span>

          <span className="text-gray-500 flex items-center gap-2">
            <MessageCircle size={24} />
            {interactions.comments.length}
          </span>
        </div>
      </div>

      {/* Right: Comments Section */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Comment Input */}
        <div className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h2 className="text-xl font-semibold text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">Add a Comment</h2>
          <div className="flex mt-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
              className={`flex-1 p-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 outline-none ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"}`}
            />

            <button
              className="px-4 py-2 rounded-md border font-semibold border-gray-400   bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white"
              onClick={handleComment}
            >
              Post
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">Comments</h2>
          {interactions.comments.length > 0 ? (
            <div className="space-y-3 mt-3">
              {interactions.comments.map((c, index) => (
                <div key={index} className={`p-3 flex justify-between items-center rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
                  <p className="flex-1">{c}</p>
                  <button
                  onClick={() => handleDeleteComment(index)}
                  className="px-4 py-2 rounded-md border font-semibold border-gray-400   bg-gradient-to-r from-red-400 to bg-red-600 transition duration-300 hover:bg-red-700 hover:text-white"
                  >
                  🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No comments yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Share Popup */}
      {showShareSheet && (
        <div className="fixed inset-0 flex justify-center items-end bg-black bg-opacity-50">
          <div className={`w-full max-w-md rounded-t-lg p-6 shadow-xl transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Share Meme</h2>
              <X className="cursor-pointer hover:text-red-500" size={24} onClick={closeShareSheet} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              {shareOptions.map((option) => (
                <a key={option.name} href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
                  {option.icon}
                  <span>{option.name}</span>
                </a>
              ))}
            </div>

            <button className="mt-5 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition" onClick={copyLink}>
              <LinkIcon className="mr-2" size={20} />
              Copy Link
            </button>

            <button className="mt-3 w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={closeShareSheet}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeDetailsPage;
