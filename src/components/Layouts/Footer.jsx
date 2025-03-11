import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaCode } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
  const theme = useSelector((state) => state.app.theme);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} mt-auto`}>
      <div className="container mx-auto px-4">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About column */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-500'}`}>
              About MemeVerse
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              A platform for meme enthusiasts to share, discover, and interact with the best memes on the internet.
              Created with ❤️ by Satyam.
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <FaCode className="inline mr-2" />
              Frontend Developer & Meme Enthusiast
            </p>
          </div>
          
          {/* Quick links column */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-500'}`}>
              Quick Links
            </h3>
            <ul className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:underline">Explore</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:underline">Upload</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:underline">Profile</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-500'}`}>
              Get In Touch
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Have feedback or suggestions? Reach out!
            </p>
            <a 
              href="mailto:satyam@example.com" 
              className={`flex items-center mb-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
            >
              <FaEnvelope className="mr-2" />
              sinha.satyam045@gmail.com
            </a>
            
            <div className="flex items-center space-x-4 mt-4">
              <a 
                href="https://github.com/sinhasatyam045" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/satyam-sinha-51b748226/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/7yummm?igsh=bnRpZjFmajg4aXE0" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://leetcode.com/u/user3049kN/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
                aria-label="LeetCode"
              >
                <SiLeetcode size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider line */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} my-6`}></div>
        
        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className={`text-center md:text-left ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-500'}`}>
              © {currentYear} MemeVerse by Satyam. All rights reserved.
            </p>
          </div>
          
          <div className={`text-sm ${theme === 'dark' ? 'text-cyan-500' : 'text-cyan-500'}`}>
            <span>Privacy Policy</span>
            <span className="mx-2">•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;