import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMeme } from '../store/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../components/Layouts/Layout';

const Upload = () => {
  const dispatch = useDispatch();
  const [caption, setCaption] = useState('');
  const [position, setPosition] = useState('bottom');
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [imageUrl, setImageUrl] = useState('');
  const [aiCaptions, setAiCaptions] = useState([]);
  const theme = useSelector((state) => state.app.theme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary) return;
  
    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: 'da3vnlion',
        uploadPreset: 'meme_upload',
        sources: ['local', 'url'],
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          // Only set the URL, but don't dispatch addMeme here
          setImageUrl(result.info.secure_url);
        }
      }
    );
  }, [dispatch]);

  const handleUpload = () => {
    if (!widgetRef.current) {
      console.error('Cloudinary widget not initialized');
      return;
    }
    widgetRef.current.open();
  };

  const fetchAICaptions = async () => {
    try {
      const { data } = await axios.get('https://api.memegen.link/templates');
      const captions = data.slice(0, 5).map(item => item.name);
      setAiCaptions(captions);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching AI captions:', error);
    }
  };

  const handleMemeUpload = () => {
    if (!imageUrl) {
      alert("⚠️ Please upload an image first!");
      return;
    }
  
    // Create a more comprehensive meme object
    const memeData = {
      url: imageUrl,
      name: caption || "No caption",
      caption: caption || "No caption",
      position: position,
      fontSize: fontSize,
      fontColor: fontColor,
      // The user info will be added in the reducer
    };
    
    dispatch(addMeme(memeData));
    
    // After successful upload
    alert("✅ Meme Uploaded Successfully!");
    
    // Reset the form
    handleCancel();
  };

  const handleCancel = () => {
    setImageUrl('');
    setCaption('');
    setAiCaptions([]);
    setIsDropdownOpen(false);
    setPosition('bottom');
    setFontSize(32);
    setFontColor('#ffffff');
  };

  const POSITIONS = [
    { id: 'top', icon: '⬆️' },
    { id: 'bottom', icon: '⬇️' },
    { id: 'left', icon: '⬅️' },
    { id: 'right', icon: '➡️' },
  ];

  return (
    <Layout>
      <div className="min-h-screen transition-all m-4"  >
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl space-y-8">
          
          <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
            <span className='text-yellow-500'>🎨</span> Meme Masterpiece Studio
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Controls Panel */}
            <div className="space-y-8">
              <button
                onClick={handleUpload}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white font-semibold text-xl shadow-lg hover:scale-105 transition-all"
              >
                <span className='text-white'>☁️</span> Upload Image/GIF
              </button>

              {/* Caption Input */}
              <div className={`p-8 rounded-xl ${theme === "dark" ? "bg-white/10" : "bg-gray-100"} shadow-md`}>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter your hilarious caption..."
                  className={`w-full p-4 rounded-lg border-2 border-dashed border-purple-300 focus:ring-4 focus:ring-purple-200 placeholder-cyan-600
                    ${theme === "dark" ? "bg-white/20 text-white" : "bg-white text-black border-gray-300"}`}
                  rows="3"
                />

                {/* AI Caption Dropdown */}
                <div className="relative mt-6">
                  <button
                    onClick={fetchAICaptions}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white hover:scale-105 transition-all"
                  >
                    🤖 Get AI Captions
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 w-full mt-2 bg-gray-100 dark:bg-gray-700 shadow-xl rounded-lg p-2 max-h-40 overflow-auto border dark:border-gray-600">
                      {aiCaptions.map((text, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCaption(text);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full p-2 text-left hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Design Controls */}
              <div className="bg-gray-200/30 dark:bg-gray-700/30 p-8 rounded-xl space-y-6 shadow-md">
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-2">Position</label>
                  <div className="grid grid-cols-4 gap-3">
                    {POSITIONS.map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setPosition(pos.id)}
                        className={`p-4 rounded-lg text-2xl ${position === pos.id ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-300 dark:bg-gray-600'} transition-all`}
                      >
                        {pos.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-gray-900 dark:text-gray-100">Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="16"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-gray-900 dark:text-gray-100">Text Color</label>
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Meme Preview Section */}
            <div className={`p-8 rounded-xl h-[600px] flex items-center justify-center ${theme === "dark" ? "bg-black/20" : "bg-gray-200"}`}>
              {imageUrl ? (
                <div className="relative w-full h-full">
                  <img src={imageUrl} alt="Meme preview" className="object-contain w-full h-full rounded-xl" />
                  {caption && (
                    <div
                      className={`absolute p-4 text-center font-bold break-words
                        ${position === 'top' ? 'top-4 inset-x-4' :
                          position === 'bottom' ? 'bottom-4 inset-x-4' :
                          position === 'left' ? 'left-4 top-1/2 -translate-y-1/2 w-1/3' :
                          'right-4 top-1/2 -translate-y-1/2 w-1/3'}
                      `}
                      style={{ fontSize: `${fontSize}px`, color: fontColor, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      {caption}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400 text-2xl">🖼️ Upload an image to start creating!</div>
              )}
            </div>
          </div>

          {/* Upload & Cancel Buttons */}
          <div className="mt-12 flex gap-8">
            <button onClick={handleMemeUpload} className="w-1/2 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:scale-105 transition-all">🚀 Upload Meme</button>
            <button onClick={handleCancel} className="w-1/2 py-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-lg hover:scale-105 transition-all"> ❌  Cancel</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
