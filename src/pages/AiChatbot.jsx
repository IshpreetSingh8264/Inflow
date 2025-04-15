import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiMessageSquare, FiCpu, FiRefreshCw } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import { initializeChat, sendMessage, getChatHistory, clearChatHistory } from '../services/chatService';

const AiChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  // Modify the scrollToBottom function to be called only when explicitly needed
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsTyping(true);
        setError(null);
        const response = await initializeChat();

        // Add detailed console log of the response
        console.log('Initialize Chat Response:', response);

        if (response && response.message) {
          setMessages([{
            id: 1,
            text: response.message,
            sender: 'ai',
            timestamp: new Date()
          }]);
        }
        setSessionInitialized(true);
      } catch (err) {
        setError('Failed to initialize chat. Please try again.');
        console.error('Initialize Chat Error:', err);
      } finally {
        setIsTyping(false);
      }
    };

    initSession();

    // Set up session refresh to prevent timeout
    sessionTimeoutRef.current = setInterval(() => {
      // Silently refresh session every 25 minutes
      initializeChat().catch(console.error);
    }, 25 * 60 * 1000);

    return () => {
      if (sessionTimeoutRef.current) {
        clearInterval(sessionTimeoutRef.current);
      }
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');

    // Signal that AI is responding
    setIsTyping(true);
    setError(null);

    try {
      // Send message to API
      const response = await sendMessage(currentInput);


      // More robust checking
      if (response && typeof response.message === 'string') {
        const aiMessage = {
          id: messages.length + 2,
          text: response.message,
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Send Message Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle resetting the conversation
  const handleResetChat = async () => {
    try {
      setIsTyping(true);
      setError(null);
      await clearChatHistory();

      const response = await initializeChat();

      if (response && response.message) {
        setMessages([{
          id: 1,
          text: response.message,
          sender: 'ai',
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setError('Failed to reset chat. Please try again.');
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Chat Container */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0] flex flex-col h-[70vh]">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E0E0E0] bg-gradient-to-r from-[#F8F9FA] to-[#E9ECEF] flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#007BFF] flex items-center justify-center text-white">
                  <FiCpu size={20} />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-[#212529]">Financial Assistant</h2>
                  <p className="text-sm text-[#6C757D]">AI-powered chat support</p>
                </div>
              </div>

              {/* Reset button */}
              <motion.button
                onClick={handleResetChat}
                className="p-2 rounded-full hover:bg-[#E9ECEF] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTyping}
                title="Reset conversation"
              >
                <FiRefreshCw size={18} cursor={isTyping ? 'not-allowed' : 'pointer'} className="text-[#6C757D]" />
              </motion.button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Error message if any */}
              {error && (
                <motion.div
                  className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Loading indicator when initializing session */}
              {!sessionInitialized && !error && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF]"></div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                          ? 'bg-[#007BFF] text-white rounded-tr-none'
                          : 'bg-[#E9ECEF] text-[#212529] rounded-tl-none'
                        }`}
                    >
                      <div className="flex items-start">
                        {message.sender === 'ai' && (
                          <div className="w-6 h-6 rounded-full bg-[#007BFF] flex items-center justify-center text-white mr-2 mt-1 flex-shrink-0">
                            <FiCpu size={12} />
                          </div>
                        )}
                        <div>
                          {message.sender === 'ai' ? (
                            <div className="text-sm md:text-base prose max-w-none">
                              <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm md:text-base">{message.text}</p>
                          )}
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-[#6C757D]'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-6 h-6 rounded-full bg-[#6C757D] flex items-center justify-center text-white ml-2 mt-1 flex-shrink-0">
                            <FiUser size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* AI Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#E9ECEF] text-[#212529] rounded-lg rounded-tl-none p-3 max-w-[80%]">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-[#6C757D] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[#6C757D] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[#6C757D] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#E0E0E0] bg-[#F8F9FA]">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 p-3 rounded-l-lg border border-[#DEE2E6] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all text-[#495057]"
                  disabled={isTyping || !sessionInitialized}
                />
                <motion.button
                  type="submit"
                  className="p-3 bg-[#007BFF] text-white rounded-r-lg hover:bg-[#0056B3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!inputMessage.trim() || isTyping || !sessionInitialized}
                >
                  <FiSend size={20} />
                </motion.button>
              </form>
            </div>
          </div>

          {/* Chat Info */}
          <motion.div
            className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-[#E0E0E0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-lg font-medium text-[#212529] mb-2">How can I help you?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                className="p-3 bg-[#F8F9FA] rounded-lg border border-[#DEE2E6] hover:border-[#007BFF] transition-colors cursor-pointer"
                onClick={() => {
                  if (!isTyping && sessionInitialized) {
                    setInputMessage("Analyze my spending patterns");
                  }
                }}
              >
                <FiMessageSquare className="text-[#007BFF] mb-2" size={20} />
                <p className="text-sm text-[#495057]">Analyze my spending patterns</p>
              </div>
              <div
                className="p-3 bg-[#F8F9FA] rounded-lg border border-[#DEE2E6] hover:border-[#007BFF] transition-colors cursor-pointer"
                onClick={() => {
                  if (!isTyping && sessionInitialized) {
                    setInputMessage("Help me create a budget");
                  }
                }}
              >
                <FiMessageSquare className="text-[#007BFF] mb-2" size={20} />
                <p className="text-sm text-[#495057]">Help me create a budget</p>
              </div>
              <div
                className="p-3 bg-[#F8F9FA] rounded-lg border border-[#DEE2E6] hover:border-[#007BFF] transition-colors cursor-pointer"
                onClick={() => {
                  if (!isTyping && sessionInitialized) {
                    setInputMessage("Investment recommendations");
                  }
                }}
              >
                <FiMessageSquare className="text-[#007BFF] mb-2" size={20} />
                <p className="text-sm text-[#495057]">Investment recommendations</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AiChatbot;
