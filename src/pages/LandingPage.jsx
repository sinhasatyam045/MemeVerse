import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import MemeCard from '../components/MemeCard';
import { fetchMemes } from '../store/store'; // Import fetchMemes action

const LandingPage = () => {
    const dispatch = useDispatch();
    const memes = useSelector((state) => state.app.memes);
    const theme = useSelector((state) => state.app.theme); // Get the theme value

    useEffect(() => {
        dispatch(fetchMemes()); // Fetch memes on mount
    }, [dispatch]);

    return (
        <div>
            <Layout>
                <div className="text-center p-8">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                        <span className="text-orange-700">⚡</span> Where Memes Are Born, <span className="text-yellow-500">🎭</span> Legends Are Made! <span className="text-orange-500">🔥</span>
                    </h1>
                    <h2 className="text-2xl mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                        Scroll <span className='text-yellow-500'>📜</span>, Laugh <span className='text-yellow-500'>😂</span>, Repeat <span className='text-blue-500'>🔁</span>.
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {memes.length > 0 ? (
                        memes.map((meme) => (
                            <MemeCard key={meme.id} meme={meme} />
                        ))
                    ) : (
                        <p className={`text-center text-xl ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                            Loading memes... ⏳
                        </p>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default LandingPage;
