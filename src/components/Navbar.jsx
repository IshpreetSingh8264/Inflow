import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiRepeat, FiTarget, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(null); // "signin" or "signup"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3"
      >
        <motion.div 
          className={`flex items-center justify-between w-full max-w-6xl px-6 py-2 rounded-full transition-all duration-300 ${
            scrolled 
              ? 'bg-white bg-opacity-90 backdrop-blur-sm' 
              : 'bg-white'
          }`}
          initial={{ scale: 0.97 }}
          animate={{ 
            scale: 1,
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)'  // Uniform shadow all around
          }}
        //   animate={{ scale: 1 }}
        >
          <Link to="/" className="text-xl font-bold text-[#000000] font-inter">Inflow</Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<FiHome className="mr-1" />} text="Home" />
            <NavLink to="/transactions" icon={<FiRepeat className="mr-1" />} text="Transactions" />
            <NavLink to="/goals" icon={<FiTarget className="mr-1" />} text="Goals" />
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <motion.button 
              className="px-4 py-2 text-[#6C757D] font-medium text-sm rounded-full transition-colors hover:bg-[#F1F3F5]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen('signin')}
            >
              Sign In
            </motion.button>
            <motion.button 
              className="px-4 py-2 bg-[#007BFF] text-white font-medium text-sm rounded-full transition-colors hover:bg-[#0056B3]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen('signup')}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />}
      </AnimatePresence>
    </>
  );
};

const AuthModal = ({ type, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-transparent z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 ,}}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-96 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold text-[#000000] mb-4">{type === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-3 border border-[#DEE2E6] rounded-md bg-[#F1F3F5] text-[#495057]" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-3 border border-[#DEE2E6] rounded-md bg-[#F1F3F5] text-[#495057]" />
        <motion.button 
          className="w-full py-2 bg-[#007BFF] text-white font-medium rounded-md hover:bg-[#0056B3]"
          whileTap={{ scale: 0.95 }}
        >
          {type === 'signin' ? 'Login' : 'Register'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const NavLink = ({ to, icon, text }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} className="flex items-center px-3 py-2 text-[#495057] font-medium text-sm rounded-full transition-colors hover:bg-[#F1F3F5] hover:text-[#007BFF]">
      {icon}
      {text}
    </Link>
  </motion.div>
);

export default Navbar;
