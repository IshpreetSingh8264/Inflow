import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiBarChart2, FiDollarSign } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const AiStocksPage = () => {
  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-[#F8F9FA] pt-24 p-6"
      >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#000000] font-inter mb-2">AI Stock Predictions</h1>
          <p className="text-[#495057]">Advanced AI-powered stock market analysis and predictions</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Prediction Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <FiTrendingUp className="text-[#007BFF] text-xl mr-2" />
              <h2 className="text-xl font-semibold text-[#212529]">Top Predictions</h2>
            </div>
            <div className="space-y-4">
              <div className="border-b border-[#DEE2E6] pb-4">
                <div className="flex justify-between">
                  <span className="text-[#495057]">AAPL</span>
                  <span className="font-medium text-[#28A745]">+2.4%</span>
                </div>
                <p className="text-sm text-[#868E96]">Next week forecast</p>
              </div>
              {/* More prediction items would go here */}
            </div>
          </motion.div>

          {/* Market Overview Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <FiBarChart2 className="text-[#007BFF] text-xl mr-2" />
              <h2 className="text-xl font-semibold text-[#212529]">Market Overview</h2>
            </div>
            <div className="space-y-4">
              <div className="border-b border-[#DEE2E6] pb-4">
                <div className="flex justify-between">
                  <span className="text-[#495057]">S&P 500</span>
                  <span className="font-medium text-[#28A745]">+0.8%</span>
                </div>
                <p className="text-sm text-[#868E96]">Today's performance</p>
              </div>
              {/* More market data would go here */}
            </div>
          </motion.div>

          {/* Portfolio Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <FiDollarSign className="text-[#007BFF] text-xl mr-2" />
              <h2 className="text-xl font-semibold text-[#212529]">AI Recommendations</h2>
            </div>
            <div className="space-y-4">
              <div className="border-b border-[#DEE2E6] pb-4">
                <div className="flex justify-between">
                  <span className="text-[#495057]">TSLA</span>
                  <span className="font-medium text-[#28A745]">Strong Buy</span>
                </div>
                <p className="text-sm text-[#868E96]">AI confidence: 87%</p>
              </div>
              {/* More recommendations would go here */}
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#212529] mb-4">AI Prediction Trends</h2>
          <div className="h-64 bg-[#F1F3F5] rounded-lg flex items-center justify-center">
            <p className="text-[#868E96]">Stock prediction chart will appear here</p>
          </div>
        </motion.div>
      </div>
      </motion.div>
    </>
  );
};

export default AiStocksPage;
