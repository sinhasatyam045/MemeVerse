import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './pages/LandingPage';
import Upload from './pages/Upload';
import Explore from './pages/Explore';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import MemeDetailsPage from './pages/MemeDetailsPage';

const App = () => {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div className={theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/meme/:id' element={<MemeDetailsPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
