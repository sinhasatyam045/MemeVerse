import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layouts/Layout";
import MemeCard from "../components/MemeCard";
import { fetchMemes } from "../store/store"; 
import { debounce } from "lodash"; // For debounced search

const Explore = () => {
    const dispatch = useDispatch();
    const memes = useSelector((state) => state.app.memes);
    const interactions = useSelector((state) => state.app.interactions);
    const theme = useSelector((state) => state.app.theme); // Get theme from Redux

    // State for filters
    const [category, setCategory] = useState("Trending");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("likes");

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            dispatch(fetchMemes(query)); // API call with search term
        }, 500), // 500ms delay
        [dispatch]
    );

    useEffect(() => {
        dispatch(fetchMemes()); // Fetch memes on mount
    }, [dispatch]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value); // Call debounced function
    };

    // Function to get updated like count
    const getLikeCount = (memeId) => {
        return interactions[memeId]?.likes || 0;
    };

    // Sort memes dynamically
    const sortedMemes = [...memes].sort((a, b) => {
        if (sortBy === "likes") return getLikeCount(b.id) - getLikeCount(a.id);
        if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        if (sortBy === "comments") return (b.comments?.length || 0) - (a.comments?.length || 0);
        return 0;
    });

    return (
        <div className={`p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <Layout>
                <h1 className="text-3xl font-bold text-center mb-6">Explore Memes</h1>

                {/* Filter & Search Controls */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search memes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={`px-4 py-2 border rounded-md w-64 ${
                            theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-gray-200 text-black"
                        }`}
                    />
                    {/* Category Filter */}
                    {["Trending", "New", "Classic", "Random"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-md transition-all ${
                                category === cat 
                                    ? theme === "dark" 
                                        ? "bg-blue-500 text-white" 
                                        : "bg-blue-600 text-white"
                                    : theme === "dark" 
                                        ? "bg-gray-700 text-white" 
                                        : "bg-gray-200 text-black"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}

                    {/* Sorting Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-4 py-2 border rounded-md ${
                            theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black"
                        }`}
                    >
                        <option value="likes">Sort by Likes</option>
                        <option value="date">Sort by Date</option>
                        <option value="comments">Sort by Comments</option>
                    </select>
                </div>

                {/* Meme Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedMemes.length > 0 ? (
                        sortedMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)
                    ) : (
                        <p className="text-center text-xl">No memes found... 😢</p>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default Explore;
