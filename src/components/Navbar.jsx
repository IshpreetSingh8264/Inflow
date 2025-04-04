import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiRepeat, FiTarget, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(null); // "signin" or "signup"

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
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
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-[#000000] font-inter">Inflow</span>
            </Link>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <NavLink to="/" icon={<FiHome className="mr-1" />} text="Home" />
            <NavLink to="/transactions" icon={<FiRepeat className="mr-1" />} text="Transactions" />
            <NavLink to="/goals" icon={<FiTarget className="mr-1" />} text="Goals" />
          </div>

          {/* Auth Buttons - Desktop */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-[#F1F3F5]"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 md:hidden"
            >
              <div className="flex flex-col space-y-3">
                <MobileNavLink to="/" icon={<FiHome className="mr-2" />} text="Home" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/transactions" icon={<FiRepeat className="mr-2" />} text="Transactions" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/goals" icon={<FiTarget className="mr-2" />} text="Goals" onClick={() => setMobileMenuOpen(false)} />
                
                <div className="pt-3 border-t border-[#DEE2E6] flex flex-col space-y-3">
                  <motion.button 
                    className="w-full py-2 text-[#6C757D] font-medium text-sm rounded-full transition-colors hover:bg-[#F1F3F5] flex justify-center"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen('signin');
                    }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button 
                    className="w-full py-2 bg-[#007BFF] text-white font-medium text-sm rounded-full transition-colors hover:bg-[#0056B3] flex justify-center"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen('signup');
                    }}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Authentication Modals */}
      <AnimatePresence>
        {modalOpen && <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} />}
      </AnimatePresence>
    </>
  );
};

// Authentication Modal Component
const AuthModal = ({ type, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.2)] w-full max-w-md mx-4 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold text-[#000000] mb-4">{type === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-2 border border-[#DEE2E6] rounded-md bg-[#F1F3F5] text-[#495057] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="w-full p-2 border border-[#DEE2E6] rounded-md bg-[#F1F3F5] text-[#495057] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent" 
            />
          </div>
          
          {type === 'signup' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#495057]">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                className="w-full p-2 border border-[#DEE2E6] rounded-md bg-[#F1F3F5] text-[#495057] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent" 
              />
            </div>
          )}
          
          <motion.button 
            className="w-full py-3 bg-[#007BFF] text-white font-medium rounded-md hover:bg-[#0056B3] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type === 'signin' ? 'Sign In' : 'Create Account'}
          </motion.button>
          
          {type === 'signin' ? (
            <p className="text-sm text-center text-[#6C757D]">
              Don't have an account? <button onClick={() => {
                onClose();
                setTimeout(() => setModalOpen('signup'), 100);
              }} className="text-[#007BFF] hover:underline">Sign Up</button>
            </p>
          ) : (
            <p className="text-sm text-center text-[#6C757D]">
              Already have an account? <button onClick={() => {
                onClose();
                setTimeout(() => setModalOpen('signin'), 100);
              }} className="text-[#007BFF] hover:underline">Sign In</button>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// NavLink component for desktop navigation
const NavLink = ({ to, icon, text }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        to={to} 
        className="flex items-center px-3 py-2 text-[#495057] font-medium text-sm rounded-full transition-colors hover:bg-[#F1F3F5] hover:text-[#007BFF]"
      >
        {icon}
        {text}
      </Link>
    </motion.div>
  );
};

// NavLink component for mobile navigation
const MobileNavLink = ({ to, icon, text, onClick }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        to={to} 
        className="flex items-center px-3 py-3 text-[#495057] font-medium text-sm rounded-full transition-colors hover:bg-[#F1F3F5] hover:text-[#007BFF]"
        onClick={onClick}
      >
        {icon}
        {text}
      </Link>
    </motion.div>
  );
};

export default Navbar;
