import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layouts/Layout";
import MemeCard from "../components/MemeCard";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion"; // Animations

const Leaderboard = () => {
    const memes = useSelector((state) => state.app.memes);
    const { width, height } = useWindowSize();

    // Get theme from Redux
    const theme = useSelector((state) => state.app.theme);

    // Confetti for the first 5 seconds
    const [showConfetti, setShowConfetti] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Sort memes by likes in descending order
    const sortedMemes = [...memes].sort((a, b) => b.likes - a.likes);

    // Function to return the appropriate emoji for the rank
    const getRankEmoji = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    // Hardcoded top memers data
    const topMemers = [
        { id: 1, username: "MemeKing420", avatar: "https://i.pravatar.cc/150?img=1", likesCount: 5432, memesCount: 78 },
        { id: 2, username: "DankMemer", avatar: "https://i.pravatar.cc/150?img=2", likesCount: 3891, memesCount: 47 },
        { id: 3, username: "LaughMaster", avatar: "https://i.pravatar.cc/150?img=3", likesCount: 2754, memesCount: 36 }
    ];

    // State to track active tab
    const [activeTab, setActiveTab] = useState("memes");

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <Layout>
                {showConfetti && <Confetti width={width} height={height} numberOfPieces={150} />}

                {/* Animated Heading */}
                <motion.h1
                    className="text-5xl mt-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 text-center mb-8"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-yellow-500">🏆</span> Meme Lords Assemble: The Ultimate Leaderboard!
                    <span className="text-red-500">🔥</span>
                </motion.h1>

                {/* Category Tabs */}
                <div className="flex justify-center mb-8">
                <div className={`flex rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} p-1`}>
    <button
        className={`px-6 py-3 font-bold rounded-lg transition-all duration-200 ${
            activeTab === "memes"
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
            : `${theme === "dark" ? "text-white" : "text-gray-800"} hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white`
        }`}
        onClick={() => setActiveTab("memes")}
    >
        🔥 Top Memes
    </button>
    <button
        className={`px-6 py-3 font-bold rounded-lg transition-all duration-200 ${
            activeTab === "memers"
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" 
            : `${theme === "dark" ? "text-white" : "text-gray-800"} hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white`
        }`}
        onClick={() => setActiveTab("memers")}
    >
        👑 Top Memers
    </button>
</div>
                </div>

                {/* Top Memes Section */}
                {activeTab === "memes" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4"
                    >
                        {sortedMemes.length > 0 ? (
                            sortedMemes.map((meme, index) => (
                                <motion.div
                                    key={meme.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    className={`relative p-5 rounded-xl transition-all shadow-lg ${
                                        index === 0
                                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                                            : index === 1
                                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                                            : index === 2
                                            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-black"
                                            : theme === "dark"
                                            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
                                            : "bg-gradient-to-r from-gray-200 to-gray-300 text-black"
                                    }`}
                                >
                                    {/* Rank Number Badge */}
                                    <motion.div
                                        className="absolute -top-4 -left-4 bg-blue-500 text-white font-bold px-4 py-2 rounded-full text-xl shadow-xl"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, delay: index * 0.05 }}
                                    >
                                        {getRankEmoji(index + 1)} {/* Ranking emoji */}
                                    </motion.div>

                                    {/* Meme Card */}
                                    <MemeCard meme={meme} />
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-xl text-gray-500 col-span-full">No memes found... <span className="text-red-500">😢</span></p>
                        )}
                    </motion.div>
                )}

                {/* Top Memers Section */}
                {activeTab === "memers" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto px-4"
                    >
                        {topMemers.map((memer, index) => (
                            <motion.div
                                key={memer.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className={`mb-6 p-6 rounded-xl shadow-lg flex items-center ${
                                    index === 0
                                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                                        : index === 1
                                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-black"
                                        : index === 2
                                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-black"
                                        : theme === "dark"
                                        ? "bg-gray-800 text-white"
                                        : "bg-gray-200 text-black"
                                }`}
                            >
                                {/* Rank Badge */}
                                <div className="mr-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                                    {getRankEmoji(index + 1)}
                                </div>

                                {/* Avatar */}
                                <div className="mr-6">
                                    <img
                                        src={memer.avatar}
                                        alt={memer.username}
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                                    />
                                </div>

                                {/* User Info */}
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold">{memer.username}</h3>
                                    <div className="flex mt-2">
                                        <div className="mr-6">
                                            <span className="font-semibold">❤️ {memer.likesCount.toLocaleString()}</span> likes
                                        </div>
                                        <div>
                                            <span className="font-semibold">🖼️ {memer.memesCount}</span> memes
                                        </div>
                                    </div>
                                </div>

                                {/* Trophy for #1 */}
                                {index === 0 && (
                                    <motion.div
                                        initial={{ rotate: -20, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                        className="text-4xl"
                                    >
                                        🏆
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </Layout>
        </div>
    );
};

export default Leaderboard;