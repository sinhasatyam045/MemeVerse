// In your App.jsx, update to apply theme class to the entire document body
import React, { useEffect } from 'react';
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
  
  // Apply theme class to entire document body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.add('bg-gray-900');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.remove('bg-gray-900');
      document.body.classList.remove('text-white');
    }
  }, [theme]);

  return (
    <div className="min-h-screen">
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