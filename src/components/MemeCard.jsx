import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { likeMeme, addComment } from "../store/store";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";

const MemeCard = ({ meme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);
  
  // Get likes and comments for the meme
  const interactions = useSelector((state) => state.app.interactions[meme.id]) || { likes: 0, comments: [] };
  console.log(interactions);

  // Handle Like
  const handleLike = (event) => {
    event.stopPropagation(); // Prevent navigating when clicking the Like button
    console.log("Meme ID:", meme.id);
    dispatch(likeMeme({ memeId: meme.id }));
  };

  // Handle Comment
  const handleComment = (event) => {
    event.stopPropagation();
    const commentText = prompt("Add a comment:");
    if (commentText) {
      dispatch(addComment({ memeId: meme.id, comment: commentText }));
    }
  };

  return (
    <div onClick={() => navigate(`/meme/${meme.id}`)}>
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: Math.random() > 0.5 ? 3 : -3,
          y: [-5, 5, -3],
          boxShadow: theme === "dark"
            ? "0px 0px 20px rgba(0, 255, 255, 0.8)"
            : "0px 4px 15px rgba(0, 0, 0, 0.2)",
          borderColor: theme === "light" ? ["#FF6B6B", "#6BFF95", "#6BAAFF"] : "transparent",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`relative shadow-lg rounded-lg overflow-hidden p-4 border-2 transition-all duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white border-transparent" : "bg-white text-black"
        }`}
      >
        {/* Meme Image */}
        <motion.img
          src={meme.url}
          alt={meme.name}
          className="w-full h-60 object-cover rounded-md"
          whileHover={{
            scale: 1.05,
            rotateY: 15,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Meme Title */}
        <h2 className="text-lg font-bold mt-2 text-center">{meme.name}</h2>

        {/* Like & Comment Buttons */}
        <div className="flex justify-between items-center mt-3">
          <button onClick={handleLike} className="flex items-center space-x-2 text-red-500 hover:text-red-700">
            {interactions.likes > 0 ? <FaHeart /> : <FaRegHeart />}
            <span>{interactions.likes}</span>
          </button>

          <button onClick={handleComment} className="flex items-center space-x-2 text-blue-500 hover:text-blue-700">
            <FaComment />
            <span>{interactions.comments.length}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MemeCard;
