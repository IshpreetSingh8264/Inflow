import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiTrendingUp, FiTrendingDown, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import NewsModal from '../components/NewsModal';
import { useAuth } from '../context/AuthContext';
import { debounce } from 'lodash'; // Import lodash for debouncing
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import for drag-and-drop

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

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 10;
  const searchContainerRef = useRef(null);
  const [stockTickers, setStockTickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Add loading state
  const [isEditingTickers, setIsEditingTickers] = useState(false);
  const [newTicker, setNewTicker] = useState('');

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Handle mouse movement for gradient effect
  const handleMouseMove = (e) => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  // Fetch financial news from Finnhub API
  useEffect(() => {
    const fetchFinancialNews = async () => {
      const apiKey = 'cvo9pdpr01qppf5bp7egcvo9pdpr01qppf5bp7f0'; // Replace with your Finnhub API key
      const category = 'general';
      const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const formattedNews = data.map((item, index) => ({
          id: index + 1,
          title: item.headline,
          description: item.summary,
          date: new Date(item.datetime * 1000).toLocaleDateString(),
          source: item.source,
          url: item.url,
        }));
        setNewsItems(formattedNews);
      } catch (error) {
        console.error('Error fetching financial news:', error);
      }
    };

    fetchFinancialNews();
  }, []);

  // Fetch market tickers from Finnhub API
  useEffect(() => {
    const fetchMarketTickers = async () => {
      const apiKey = 'cvo9pdpr01qppf5bp7egcvo9pdpr01qppf5bp7f0'; // Replace with your Finnhub API key
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']; // Add more symbols as needed
      const requests = symbols.map(symbol =>
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
          .then(response => response.json())
          .then(data => ({
            symbol,
            price: data.c,
            change: data.d,
            changePercent: data.dp,
            trending: data.d >= 0 ? 'up' : 'down',
            chartData: [] // Placeholder for chart data
          }))
      );

      try {
        const results = await Promise.all(requests);
        setStockTickers(results);
      } catch (error) {
        console.error('Error fetching market tickers:', error);
      }
    };

    fetchMarketTickers();
  }, []);

  // Debounced search handler
  const debouncedSearch = useRef(
    debounce(async (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const apiKey = 'cvo9pdpr01qppf5bp7egcvo9pdpr01qppf5bp7f0'; // Replace with your Finnhub API key
      const category = 'general';
      const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const filteredResults = data
          .filter((item) =>
            item.headline.toLowerCase().includes(term.toLowerCase())
          )
          .slice(0, 5) // Limit to 5 results
          .map((item, index) => ({
            id: index + 1,
            title: item.headline,
            description: item.summary,
            date: new Date(item.datetime * 1000).toLocaleDateString(),
            source: item.source,
            url: item.url,
          }));
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500) // Debounce delay of 500ms
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup debounce on unmount
    };
  }, []);

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsSearching(true);
    debouncedSearch(term);
  };

  const handleAddTicker = async () => {
    if (!newTicker.trim()) {
      alert('Please enter a valid ticker symbol.');
      return;
    }

    const apiKey = 'cvo9pdpr01qppf5bp7egcvo9pdpr01qppf5bp7f0'; // Replace with your Finnhub API key
    const url = `https://finnhub.io/api/v1/quote?symbol=${newTicker}&token=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.c) {
        const newStock = {
          symbol: newTicker.toUpperCase(),
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          trending: data.d >= 0 ? 'up' : 'down',
          chartData: [], // Placeholder for chart data
        };
        setStockTickers((prev) => [...prev, newStock]);
        setNewTicker('');
      } else {
        alert('Invalid ticker symbol. Please try again.');
      }
    } catch (error) {
      console.error('Error adding ticker:', error);
      alert('Failed to add ticker. Please try again later.');
    }
  };

  const handleDeleteTicker = (index) => {
    setStockTickers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTickers = Array.from(stockTickers);
    const [movedTicker] = reorderedTickers.splice(result.source.index, 1);
    reorderedTickers.splice(result.destination.index, 0, movedTicker);

    setStockTickers(reorderedTickers);
  };

  // Pagination logic
  const paginatedNews = newsItems.slice(
    (currentPage - 1) * newsPerPage,
    currentPage * newsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * newsPerPage < newsItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (news) => {
    setSelectedNews(news);
  };

  const closeModal = () => {
    setSelectedNews(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      {isLoggedIn ? (
        <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20">
          <motion.div
            className="max-w-7xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
          >
            {/* Search Container */}
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-lg"
              onMouseMove={handleMouseMove}
              ref={searchContainerRef}
              style={{
                backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 123, 255, 0.2), transparent 60%)`,
                backgroundColor: '#ffffff',
              }}
            >
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#212529]">
                  Search Financial Data
                </h2>
                <div className="max-w-4xl mx-auto relative">
                  <input
                    type="text"
                    placeholder="Search for financial news..."
                    value={searchTerm}
                    onChange={handleSearchInputChange} // Use the new handler
                    className="w-full p-4 pl-12 pr-12 rounded-full border border-[#DEE2E6] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all text-[#495057]"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D]" size={20} />
                  <motion.button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#007BFF] hover:text-[#0056B3] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => debouncedSearch(searchTerm)}
                  >
                    <FiArrowRight size={20} />
                  </motion.button>
                </div>
                {isSearching && (
                  <p className="text-center text-[#6C757D] mt-4">Searching...</p> // Show loading indicator
                )}
                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 border border-[#DEE2E6] rounded-lg hover:shadow-md transition-shadow bg-[#FAFAFA] cursor-pointer"
                        onClick={() => window.open(result.url, '_blank')}
                      >
                        <h3 className="font-medium text-[#212529]">{result.title}</h3>
                        <p className="text-[#6C757D] mt-1">{result.description}</p>
                        <div className="flex justify-between items-center mt-2 text-sm text-[#ADB5BD]">
                          <span>{result.date}</span>
                          <span>Source: {result.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            {/* Market Tickers Container */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#212529]">Market Tickers</h2>
                  <button
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isEditingTickers
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-[#007BFF] text-white hover:bg-[#0056B3]'
                    }`}
                    onClick={() => setIsEditingTickers((prev) => !prev)}
                  >
                    
                    {isEditingTickers ? 'Done' : <FiEdit className="mr-2" />}
                  </button>
                </div>
                {isEditingTickers && (
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      placeholder="Add new ticker (e.g., TSLA)"
                      value={newTicker}
                      onChange={(e) => setNewTicker(e.target.value)}
                      className="flex-grow p-2 border border-[#DEE2E6] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                    />
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors"
                      onClick={handleAddTicker}
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tickers">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        {stockTickers.map((stock, index) => (
                          <Draggable key={stock.symbol} draggableId={stock.symbol} index={index}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={`p-4 border border-[#DEE2E6] rounded-lg transition-shadow bg-white ${
                                  snapshot.isDragging ? 'shadow-lg bg-gray-100' : 'hover:shadow-md'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg text-[#212529]">{stock.symbol || 'N/A'}</h3>
                                    <p className="text-sm text-[#6C757D]">{stock.name || 'Unknown'}</p>
                                  </div>
                                  <div className={`flex items-center ${stock.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                    {stock.trending === 'up' ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                                  </div>
                                </div>
                                <div className="flex justify-between items-end mt-3">
                                  <div>
                                    <p className="text-xl font-semibold text-[#212529]">
                                      ${stock.price !== undefined ? stock.price.toFixed(2) : '0.00'}
                                    </p>
                                    <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {stock.change !== undefined ? (stock.change >= 0 ? '+' : '') + stock.change.toFixed(2) : '0.00'}
                                      ({stock.changePercent !== undefined ? (stock.changePercent >= 0 ? '+' : '') + stock.changePercent.toFixed(2) : '0.00'}%)
                                    </p>
                                  </div>
                                  <MiniChart data={stock.chartData || []} trending={stock.trending} />
                                </div>
                                {isEditingTickers && (
                                  <button
                                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full"
                                    onClick={() => handleDeleteTicker(index)}
                                  >
                                    <FiTrash />
                                  </button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </motion.div>
            {/* News Container */}
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4 text-[#212529]">
                  Financial News & Updates
                </h2>
                <motion.div className="space-y-4">
                  {paginatedNews.map((item) => (
                    <motion.div
                      key={item.id}
                      className="p-4 border border-[#DEE2E6] rounded-lg hover:shadow-md transition-shadow bg-[#FAFAFA] cursor-pointer"
                      onClick={() => window.open(item.url, '_blank')}
                     
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
                <div className="flex justify-between items-center mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {Math.ceil(newsItems.length / newsPerPage)}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={handleNextPage}
                    disabled={currentPage * newsPerPage >= newsItems.length}
                  >
                    Next
                  </button>
                </div>
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
                console.log('Navigate to login');
              }}
            >
              Log In
            </motion.button>
          </motion.div>
        </div>
      )}
      <NewsModal isOpen={!!selectedNews} onClose={closeModal} news={selectedNews} />
    </div>
  );
};

export default Dashboard;
