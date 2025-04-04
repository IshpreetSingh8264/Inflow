import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUpload, FiFileText, FiArrowRight, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const searchContainerRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    // This would typically check a token in localStorage or context
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token !== null) {
        setIsLoggedIn(!!token);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle mouse movement for gradient effect
  const handleMouseMove = (e) => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please upload a CSV file');
      setFile(null);
      e.target.value = null;
    }
  };

  // Handle file analysis
  const handleAnalysis = () => {
    if (file) {
      // Implement file analysis logic here
      console.log('Analyzing file:', file.name);
      // This would typically send the file to a backend API
    } else {
      alert('Please upload a CSV file first');
    }
  };

  // Stock ticker data (static)
  const stockTickers = [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.72,
      change: 2.34,
      changePercent: 1.32,
      chartData: [150, 152, 148, 155, 160, 158, 165, 170, 168, 175, 178],
      trending: 'up'
    },
    {
      id: 2,
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 338.11,
      change: -1.25,
      changePercent: -0.37,
      chartData: [320, 325, 330, 328, 335, 340, 338, 342, 339, 336, 338],
      trending: 'down'
    },
    {
      id: 3,
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 131.86,
      change: 0.94,
      changePercent: 0.72,
      chartData: [125, 127, 129, 128, 130, 132, 131, 133, 132, 130, 131],
      trending: 'up'
    },
    {
      id: 4,
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 127.74,
      change: 1.56,
      changePercent: 1.24,
      chartData: [120, 122, 121, 123, 125, 124, 126, 128, 127, 126, 127],
      trending: 'up'
    }
  ];

  // News data (static)
  const newsItems = [
    {
      id: 1,
      title: 'Financial Markets Update',
      description: 'Global markets show signs of recovery as inflation rates stabilize.',
      date: 'May 15, 2023',
      source: 'Financial Times'
    },
    {
      id: 2,
      title: 'New Investment Opportunities',
      description: 'Emerging markets present promising investment opportunities for Q3 2023.',
      date: 'May 12, 2023',
      source: 'Bloomberg'
    },
    {
      id: 3,
      title: 'Personal Finance Tips',
      description: 'Expert advice on managing personal finances during economic uncertainty.',
      date: 'May 10, 2023',
      source: 'Forbes'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Mini chart component for stock tickers
  const MiniChart = ({ data, trending }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    return (
      <div className="h-12 w-24 flex items-end">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - minValue) / range) * 100;
          return (
            <div
              key={index}
              className={`w-1 mx-[1px] rounded-t-sm ${trending === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ height: `${height}%` }}
            ></div>
          );
        })}
      </div>
    );
  };

  // For debugging
  console.log("isLoggedIn status:", isLoggedIn);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      {isLoggedIn ? (
        <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20">
          <motion.div
            className="max-w-7xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
          >
            {/* Search Container with Dynamic Gradient */}
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-lg"
              variants={containerVariants}
              onMouseMove={handleMouseMove}
              ref={searchContainerRef}
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 123, 255, 0.2), transparent 60%)`,
                backgroundColor: '#ffffff'
              }}
            >
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#212529]">
                  Search Financial Data
                </h2>
                <div className="max-w-4xl mx-auto relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for transactions, goals, or financial insights..."
                    className="w-full p-4 pl-12 pr-12 rounded-full border border-[#DEE2E6] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all text-[#495057]"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D]" size={20} />
                  <motion.button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#007BFF] hover:text-[#0056B3] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* File Upload Container */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]"
              variants={containerVariants}
            >
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4 text-[#212529]">
                  Upload Financial Data
                </h2>
                <div className="border-2 border-dashed border-[#DEE2E6] rounded-lg p-6 text-center">
                  <motion.div
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiUpload className="text-[#6C757D] mb-3" size={36} />
                    <p className="mb-4 text-[#495057]">
                      {file ? `Selected: ${file.name}` : 'Upload a CSV file to analyze your financial data'}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <label className="px-4 py-2 bg-[#E9ECEF] text-[#495057] rounded-lg hover:bg-[#DEE2E6] transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        Choose File
                      </label>
                      <motion.button
                        className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056B3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        onClick={handleAnalysis}
                        disabled={!file}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <FiFileText className="mr-2" />
                        Analyze
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stock Tickers Container - NEW SECTION */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]"
              variants={containerVariants}
            >
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4 text-[#212529]">
                  Market Tickers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stockTickers.map((stock) => (
                    <motion.div
                      key={stock.id}
                      className="p-4 border border-[#DEE2E6] rounded-lg hover:shadow-md transition-shadow"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-[#212529]">{stock.symbol}</h3>
                          <p className="text-sm text-[#6C757D]">{stock.name}</p>
                        </div>
                        <div className={`flex items-center ${stock.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.trending === 'up' ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div>
                          <p className="text-xl font-semibold text-[#212529]">${stock.price.toFixed(2)}</p>
                          <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                        <MiniChart data={stock.chartData} trending={stock.trending} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* News Container */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]"
              variants={containerVariants}
            >
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4 text-[#212529]">
                  Financial News & Updates
                </h2>
                <motion.div
                  className="space-y-4"
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {newsItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="p-4 border border-[#DEE2E6] rounded-lg hover:shadow-md transition-shadow bg-[#FAFAFA]"
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-medium text-[#212529]">{item.title}</h3>
                      <p className="text-[#6C757D] mt-1">{item.description}</p>
                      <div className="flex justify-between items-center mt-2 text-sm text-[#ADB5BD]">
                        <span>{item.date}</span>
                        <span>Source: {item.source}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20 flex justify-center items-center">
          <motion.div
            className="text-center max-w-lg bg-white p-8 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-[#212529] mb-4">Welcome to Inflow</h2>
            <p className="text-[#6C757D] mb-6">
              Please log in to access your personalized dashboard, track your finances, and manage your goals.
            </p>
            <motion.button
              className="px-6 py-3 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056B3] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Navigate to login page or open login modal
                console.log('Navigate to login');
              }}
            >
              Log In
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

