import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/store';

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  return (
    <header className={`p-4 flex justify-between items-center transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
       
      <Link to='/' className='text-2xl font-bold'>MemeVerse</Link>

      <nav className="flex gap-6 text-lg">
        <Link to="/explore" className="hover:via-blue-700">Explore</Link>
        <Link to="/leaderboard" className="hover:via-blue-700">Leaderboard</Link>
        <Link to="/upload" className="hover:via-blue-700">Upload</Link>
      </nav>

      
      <div className="flex gap-4">
        <button 
          onClick={() => dispatch(toggleTheme())} 
          className="px-4 py-2 rounded-md border transition duration-300 hover:bg-gray-700 hover:text-white"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        <button className="px-4 py-2 rounded-md border transition duration-300 hover:bg-gray-700 hover:text-white">
          <Link to='/profile' className='hover:via-blue-700'>Profile</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;
