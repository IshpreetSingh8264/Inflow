import axios from 'axios';

const API_BASE_URL = 'http://localhost:8383/api/chat';

// Configure axios with authentication
const api = axios.create();

// Demo mode state
let isOfflineMode = false;

// Add authentication token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Modified error handling to prevent redirect loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Set offline mode if authentication fails
    if (error.response && error.response.status === 401) {
      console.warn('Authentication error - switching to offline mode');
      isOfflineMode = true;
    }
    return Promise.reject(error);
  }
);

// Enhanced fallback responses that simulate a real chat
const FALLBACK_RESPONSES = {
  initialize: {
    message: "👋 Hello! I'm your financial assistant (DEMO MODE). While we're not connected to your actual financial data right now, I can still help with general questions. How can I assist you today?"
  },
  message: (question) => {
    // Simple pattern matching for demo mode
    if (question.toLowerCase().includes('spend') || question.toLowerCase().includes('spending')) {
      return {
        message: "In demo mode, I can't access your actual spending patterns. When connected to your data, I'd analyze your transactions by category, highlight trends, and suggest areas where you might reduce expenses."
      };
    }
    
    if (question.toLowerCase().includes('budget')) {
      return {
        message: "Creating a budget starts with understanding your income and expenses. In the full version, I'd help you categorize your spending, set realistic goals, and track your progress. For now, a good rule of thumb is the 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings."
      };
    }
    
    if (question.toLowerCase().includes('invest') || question.toLowerCase().includes('investment')) {
      return {
        message: "Investment strategies depend on your goals and risk tolerance. While I can't provide personalized recommendations in demo mode, generally, diversification across different asset classes is important. Consider consulting a financial advisor for specific investment advice."
      };
    }

    // Default response
    return {
      message: "I'm currently in demo mode with limited capabilities. In the full version, I'd have access to your financial data to provide personalized insights and recommendations. Feel free to ask about spending patterns, budgeting, or investment basics for general information."
    };
  }
};

export const initializeChat = async () => {
  try {
    // If we already know we're offline, don't attempt API call
    if (isOfflineMode) {
      return FALLBACK_RESPONSES.initialize;
    }

    const response = await api.post(`${API_BASE_URL}/initialize`);
    console.log('Initialize response raw:', response);
    
    // Handle the specific nested response format: data.data.message.content
    if (response.data && 
        response.data.data && 
        response.data.data.message && 
        response.data.data.message.content) {
      
      return { message: response.data.data.message.content };
    }
    // Handle other common formats
    else if (response.data && response.data.message && response.data.message.content) {
      return { message: response.data.message.content };
    } else if (response.data && typeof response.data.message === 'string') {
      return response.data;
    } else {
      console.warn('Unexpected initialize response format:', response.data);
      isOfflineMode = true;
      return FALLBACK_RESPONSES.initialize;
    }
  } catch (error) {
    console.error('Failed to initialize chat:', error);
    // Return fallback response instead of throwing error
    isOfflineMode = true;
    return FALLBACK_RESPONSES.initialize;
  }
};

export const sendMessage = async (message) => {
  try {
    // If we already know we're offline, don't attempt API call
    if (isOfflineMode) {
      console.log('Using offline fallback for message:', message);
      const response = FALLBACK_RESPONSES.message(message);
      console.log('Offline response:', response);
      return response;
    }

    console.log('Sending message to API:', message);
    const response = await api.post(`${API_BASE_URL}/message`, { message });
    console.log('API response raw:', response);
    
    // Handle the specific nested response format: data.data.message.content
    if (response.data && 
        response.data.data && 
        response.data.data.message && 
        response.data.data.message.content) {
      
      const modelResponse = {
        message: response.data.data.message.content
      };
      
      console.log('Extracted API response:', modelResponse);
      return modelResponse;
    } 
    // Try other common formats as fallback
    else if (response.data && 
             response.data.message && 
             response.data.message.content) {
      
      const modelResponse = {
        message: response.data.message.content
      };
      
      console.log('Extracted API response from data:', modelResponse);
      return modelResponse;
    }
    else {
      console.warn('Received unexpected response format:', response.data);
      // If response format is incorrect, use fallback
      isOfflineMode = true;
      const fallback = FALLBACK_RESPONSES.message(message);
      console.log('Using fallback due to format issue:', fallback);
      return fallback;
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    // Return fallback response instead of throwing error
    isOfflineMode = true;
    const fallback = FALLBACK_RESPONSES.message(message);
    console.log('Using fallback due to error:', fallback);
    return fallback;
  }
};

export const getChatHistory = async () => {
  try {
    // If we're offline, return empty history
    if (isOfflineMode) {
      return { messages: [] };
    }

    const response = await api.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Failed to get chat history:', error);
    isOfflineMode = true;
    return { messages: [] };
  }
};

export const clearChatHistory = async () => {
  try {
    // If we're offline, just return the initialize message
    if (isOfflineMode) {
      return FALLBACK_RESPONSES.initialize;
    }

    const response = await api.delete(`${API_BASE_URL}/clear`);
    return response.data;
  } catch (error) {
    console.error('Failed to clear chat history:', error);
    isOfflineMode = true;
    return FALLBACK_RESPONSES.initialize;
  }
};

// Helper function to check if we're in offline mode
export const isInOfflineMode = () => isOfflineMode;