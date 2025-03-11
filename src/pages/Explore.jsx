import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layouts/Layout";
import MemeCard from "../components/MemeCard";
import { fetchMemes } from "../store/store"; // Fetch API memes

const Explore = () => {
    const dispatch = useDispatch();

    // Ensure `memes` and `interactions` are always defined
    const memes = useSelector((state) => state.app.memes) || [];
    const interactions = useSelector((state) => state.app.interactions) || {};
    const theme = useSelector((state) => state.app.theme) || "light";

    const [category, setCategory] = useState("Trending");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("likes");

    useEffect(() => {
        dispatch(fetchMemes()); // Fetch all memes on mount
    }, [dispatch]);

    // Function to get like count
    const getLikeCount = (memeId) => interactions[memeId]?.likes || 0;

    // Function to get comment count
    const getCommentCount = (meme) => {
        if (Array.isArray(meme.comments)) return meme.comments.length;
        if (typeof meme.comments === "number") return meme.comments;
        return interactions[meme.id]?.comments?.length || 0;
    };

    // Function to filter memes based on category
    const filterByCategory = (memes) => {
        if (category === "Trending") {
            return [...memes]
                .sort((a, b) => getLikeCount(b.id) - getLikeCount(a.id))
                .slice(0, 10); // Top 10 liked memes
        }
        if (category === "New") {
            return [...memes].slice(-10); // Last 10 fetched memes (assuming API returns in order)
        }
        if (category === "Classic") {
            return memes.filter((meme) => meme.box_count >= 3); // More text boxes = classic meme format
        }
        if (category === "Random") {
            return [...memes].sort(() => Math.random() - 0.5).slice(0, 10); // Shuffle and take 10 random memes
        }
        return memes;
    };

    // Apply search filter first (ensure meme.name is defined)
    const searchedMemes = memes.filter((meme) =>
        meme.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply category filtering
    const categorizedMemes = filterByCategory(searchedMemes);

    // Sort filtered memes
    const sortedMemes = [...categorizedMemes].sort((a, b) => {
        if (sortBy === "likes") return getLikeCount(b.id) - getLikeCount(a.id);
        if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        if (sortBy === "comments") return getCommentCount(b) - getCommentCount(a);
        return 0;
    });

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <Layout>
                <h1 className="text-4xl mt-6 font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    Explore Memes
                </h1>

                {/* Search and Filters */}
                <div className="flex flex-wrap justify-center gap-6 mb-8 px-4">
                    <input
                        type="text"
                        placeholder="Search memes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`px-6 py-3 rounded-xl shadow-md focus:outline-none w-64 ${
                            theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-gray-200 text-black hover:scale-105 border-gray-300"
                        }`}
                    />
                    {/* Category Buttons */}
                    {["Trending", "New", "Classic", "Random"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`cursor-pointer px-6 py-3 rounded-xl text-lg hover:scale-105 duration-300 hover:bg-gradient-to-r from-blue-500 to-cyan-500 hover:text-white font-medium transition-all ease-in-out ${
                                category === cat
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white opacity-80"
                                    : theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                    {/* Sorting Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`cursor-pointer px-6 py-3 rounded-xl border hover:scale-105 shadow-md focus:outline-none ${
                            theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                        }`}
                    >
                        <option value="likes">Sort by Likes</option>
                        <option value="date">Sort by Date</option>
                        <option value="comments">Sort by Comments</option>
                    </select>
                </div>

                {/* Meme Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-6">
                    {sortedMemes.length > 0 ? (
                        sortedMemes.map((meme, index) => (
                            <MemeCard key={meme.id} meme={meme} ranking={index + 1} />
                        ))
                    ) : (
                        <p className="text-center text-xl text-gray-500">No memes found... 😢</p>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default Explore;
