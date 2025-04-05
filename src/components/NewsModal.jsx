import React from 'react';
import { motion } from 'framer-motion';

const NewsModal = ({ isOpen, onClose, news }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target.classList.contains('backdrop')) onClose();
      }}
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 backdrop-blur-md backdrop"
        style={{ willChange: 'filter' }}
      />
    

      {/* Modal content */}
      <motion.div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative z-10"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">{news.title}</h2>
        <p className="text-sm text-gray-500 mb-2">Source: {news.source}</p>
        <p className="text-sm text-gray-500 mb-4">Date: {news.date}</p>
        <p className="text-gray-700 mb-6">{news.description}</p>
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Read More
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewsModal;
