import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, setLikedMemes } from "../store/store"; 
import Layout from "../components/Layouts/Layout";
import { FaUserCircle } from "react-icons/fa";
import { Share2, X, Link as LinkIcon } from "lucide-react"; // Import Lucide icons
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa"; // Import social icons
import toast, { Toaster } from "react-hot-toast"; // Import toast for notifications

const Profile = () => {
  const dispatch = useDispatch();
  
  // Get user data from Redux store
  const user = useSelector((state) => state.app.user) || {};
  const likedMemes = useSelector((state) => state.app.likedMemes) || []; 
  const uploadedMemes = useSelector((state) => state.app.uploadedMemes) || [];
  const isLoading = useSelector((state) => state.app.loading);
  
  const [editMode, setEditMode] = useState(false);
  const [showLikedMemes, setShowLikedMemes] = useState(true);
  // Add state for share sheet
  const [showShareSheet, setShowShareSheet] = useState(false);
  
  // Create local form state
  const [formData, setFormData] = useState({
    name: user?.name || "Guest",
    username: user?.username || "guest_user",
    bio: user?.bio || "No bio available",
  });

  // Update local state when Redux state changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "Guest",
        username: user.username || "guest_user",
        bio: user.bio || "No bio available",
      });
    }
  }, [user]);

  // Load liked memes from local storage if needed
  useEffect(() => {
    const storedMemes = JSON.parse(localStorage.getItem("likedMemes")) || [];
    if (storedMemes.length > 0 && (!likedMemes || likedMemes.length === 0)) {
      dispatch(setLikedMemes(storedMemes));
    }
  }, [dispatch, likedMemes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is a data URL that can be used as the src of an image
        const photoData = reader.result;
        
        // Update the profile photo in Redux store
        dispatch(updateUser({ profilePhoto: photoData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Update user info in Redux store
    dispatch(updateUser(formData));
    setEditMode(false);
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.name}'s Profile`,
        text: `Check out ${user.name}'s profile!`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        setShowShareSheet(true);
      });
    } else {
      setShowShareSheet(true);
    }
  };

  const closeShareSheet = () => setShowShareSheet(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard! 📋");
  };

  const shareOptions = [
    { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Check out ${user.name}'s profile! ${window.location.href}`)}`, icon: <FaWhatsapp className="text-green-500" /> },
    { name: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${user.name}'s profile!`)}&url=${encodeURIComponent(window.location.href)}`, icon: <FaTwitter className="text-blue-400" /> },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, icon: <FaFacebook className="text-blue-600" /> },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, icon: <FaLinkedin className="text-blue-500" /> },
  ];

  return (
    <Layout>
      <div className="max-w-4xl m-4 mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl space-y-8">
        <Toaster /> {/* Add Toaster for notifications */}
        
        {/* Profile Header */}
        <div className="flex justify-center">
          <label htmlFor="profilePhotoInput" className="relative cursor-pointer hover:opacity-90 transition">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-white dark:text-gray-400" />
            )}
            <input 
              type="file" 
              id="profilePhotoInput" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfilePhotoChange}
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </label>
        </div>

        {/* Show loading indicator if profile is being updated */}
        {isLoading && (
          <div className="text-center text-blue-500">
            <p>Updating profile...</p>
          </div>
        )}

        {/* Name, Username, Bio */}
        <div className="text-center mt-4">
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring focus:ring-cyan-400"
              />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring focus:ring-cyan-400"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="block w-full p-2 border rounded mt-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring focus:ring-cyan-400"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="opacity-80">@{user.username}</p>
              <p className="opacity-90">{user.bio}</p>
            </>
          )}
        </div>

        
         {/* Stats */}
          <div className="mt-4 flex justify-around text-center">
            <div>
              <p className="text-lg font-bold">{uploadedMemes.length}</p>
              <p className="text-sm opacity-80">Total Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">{likedMemes.length}</p>
              <p className="text-sm opacity-80">Liked Posts</p>
            </div>
            <div>
              <p className="text-lg font-bold">{Object.values(useSelector(state => state.app.interactions)).reduce((sum, interaction) => sum + (interaction.comments?.length || 0), 0)}</p>
              <p className="text-sm opacity-80">Comments</p>
            </div>
          </div>

        {/* Edit & Share Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          {editMode ? (
            <button
              onClick={handleSave}
              className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-lg dark:bg-gray-800 dark:text-cyan-400 hover:bg-cyan-100 transition"
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className=" cursor-pointer px-4 py-2 rounded-md border font-semibold hover:scale-105 border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white"
            >
              Edit Profile
            </button>
          )}
          <button 
            onClick={handleShare}
            className=" cursor-pointer px-4 py-2 rounded-md border font-semibold hover:scale-105 border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500 transition duration-300 hover:bg-blue-600 hover:text-white flex items-center gap-2"
          >
            <Share2 size={18} />
            Share Profile
          </button>
        </div>

        {/* Dashboard Toggle Buttons */}
        <div className="mt-6 bg-gray-100 dark:bg-gray-700/30 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
            Dashboard
          </h2>

          {/* Toggle Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setShowLikedMemes(true)}
              className={` cursor-pointer px-4 py-2 rounded-md hover:scale-105 font-semibold ${
                showLikedMemes 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                  : "border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500"
              } transition duration-300 hover:bg-blue-600 hover:text-white`}
            >
              Liked Meme
            </button>
            <button
              onClick={() => setShowLikedMemes(false)}
              className={` cursor-pointer px-4 py-2 rounded-md hover:scale-105 font-semibold ${
                !showLikedMemes 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                  : "border border-gray-400 bg-gradient-to-r from-blue-500 to-cyan-500"
              } transition duration-300 hover:bg-blue-600 hover:text-white`}
            >
              Uploaded Memes
            </button>
          </div>

          {/* Conditional Rendering of Memes */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {showLikedMemes ? "Liked Memes" : "Uploaded Memes"}
            </h3>

            <div className="flex overflow-x-auto space-x-4 mt-3 p-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
              {showLikedMemes ? (
                likedMemes.length > 0 ? (
                  likedMemes.map((meme, index) => (
                    <img
                      key={index}
                      src={meme.url}
                      alt={`Meme ${index + 1}`}
                      className="w-24 h-24 rounded-lg shadow-md hover:scale-105 transition-all"
                    />
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    No liked memes yet
                  </p>
                )
              ) : uploadedMemes.length > 0 ? (
                uploadedMemes.map((meme, index) => (
                  <img
                    key={index}
                    src={meme.url}
                    alt={meme.caption}
                    className="w-24 h-24 rounded-lg shadow-md hover:scale-105 transition-all"
                  />
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 italic">
                  No uploaded memes yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Share Profile Modal - Similar to MemeDetailsPage share sheet */}
        {showShareSheet && (
          <div className="fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md rounded-t-lg p-6 shadow-xl transition-all bg-white dark:bg-gray-800 dark:text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Share Profile</h2>
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

              <button className="mt-5 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition flex items-center justify-center" onClick={copyLink}>
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
    </Layout>
  );
};

export default Profile;