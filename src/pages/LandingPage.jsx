import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layouts/Layout';
import MemeCard from '../components/MemeCard';
import { fetchMemes } from '../store/store'; // Import fetchMemes action

const LandingPage = () => {
    const dispatch = useDispatch();
    const memes = useSelector((state) => state.app.memes);

    useEffect(() => {
        dispatch(fetchMemes()); // Fetch memes on mount
    }, [dispatch]);

    return (
        <div>
            <Layout>
                <div className='text-center'>
                    <h1 className='text-5xl font-bold text-blue-600'>⚡ Where Memes Are Born, 🎭 Legends Are Made! 🔥</h1>
                    <h2 className='text-2xl'>Scroll 📜, Laugh 😂, Repeat 🔁.</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {memes.length > 0 ? (
                        memes.map((meme) => (
                            <MemeCard key={meme.id} meme={meme} />
                        ))
                    ) : (
                        <p className="text-center text-xl">Loading memes... ⏳</p>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default LandingPage;
