# Inflow - AI-Powered Financial Assistant

## Documentation

### Overview

Inflow is an AI-powered financial assistant designed to make money management smarter, seamless, and effortless. It provides users with tools to track expenses, analyze spending habits, and gain actionable insights for better financial decisions. The application uses artificial intelligence to categorize transactions, provide personalized recommendations, and help users achieve their financial goals.

### Table of Contents

1. [Features](#features)
2. [Technical Architecture](#technical-architecture)
3. [Setup Guide](#setup-guide)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
4. [System Components](#system-components)
   - [Frontend Components](#frontend-components)
   - [Backend Services](#backend-services)
5. [API Documentation](#api-documentation)
6. [AI Integration](#ai-integration)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)
10. [License](#license)
11. [Support](#support)

### Features

Inflow offers a comprehensive set of features designed to transform financial management:

- **Smart Dashboard**: Personalized dashboard displaying financial news, market tickers, and stock trends in real-time.
- **AI-Powered Chatbot**: Interactive assistant providing financial advice, budgeting support, and investment recommendations.
- **Financial Analysis Tools**: Advanced visualization of income, expenses, and trends with interactive charts and filters.
- **AI Stock Predictions**: Predictive analytics for stock market trends using machine learning models.
- **Goal Management System**: Tools to set, track, and achieve financial goals with progress visualization.
- **Transaction Management**: Create, edit, and manage financial transactions with automatic categorization.
- **AI Categorization**: Automatic transaction categorization using natural language processing.
- **Financial Health Summary**: AI-generated insights and recommendations based on spending patterns.

### Technical Architecture

Inflow follows a modern web application architecture with separate frontend and backend components:

#### Frontend Architecture
- **Framework**: React.js with Vite build tool
- **State Management**: React Context API
- **Routing**: React Router
- **UI Components**: Custom components with Framer Motion animations
- **Data Visualization**: Recharts library
- **Styling**: Tailwind CSS for responsive design

#### Backend Architecture
- **Server**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **AI Integration**: 
  - LLM-based services for chat, transaction categorization, and financial summaries
  - XGBoost model for stock predictions
- **Third-Party Integration**: Finnhub API for financial news and stock data
- **Workflow Automation**: n8n for integrations and automated workflows

### Setup Guide

#### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/inflow.git
   cd inflow/Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create a `.env` file in the `Frontend` directory with:
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

#### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd inflow/InflowBackend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create a `.env` file in the `InflowBackend` directory with the following:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/inflow_db
   JWT_SECRET=your_jwt_secret
   FINNHUB_API_KEY=your_finnhub_api_key
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

5. **Verify the backend is running**:
   The server should be available at `http://localhost:5000`

### System Components

#### Frontend Components

1. **Pages**:
   - `Dashboard.jsx`: Main landing page with financial news, market tickers, and stock trends
   - `AiChatbot.jsx`: Interactive chatbot interface for financial assistance
   - `AnalysisPage.jsx`: Financial data visualization with charts and filters
   - `TransactionsPage.jsx`: Transaction management interface
   - `GoalsPage.jsx`: Financial goal setting and tracking
   - `AiStocksPage.jsx`: AI-powered stock predictions and analysis
   - `AboutUs.jsx`: Project information page
   - `ContactUs.jsx`: Contact form and company details

2. **Core Components**:
   - `Navbar.jsx`: Navigation component
   - `NewsModal.jsx`: Financial news display
   - `ErrorBoundary.jsx`: Error handling wrapper

3. **Services**:
   - `chatService.js`: API service for AI chatbot functionality

4. **Context**:
   - `AuthContext.jsx`: Authentication state management

#### Backend Services

1. **API Controllers**:
   - `authController.js`: User authentication and account management
   - `transactionController.js`: Transaction CRUD operations
   - `goalController.js`: Financial goal management
   - `n8nController.js`: Integration with n8n workflow automation

2. **AI Services**:
   - `chat.js`: AI chatbot service
   - `categoriseTransaction.js`: Transaction categorization using LLM
   - `summaryTransactions.js`: Financial insight generation
   - `predict.py`: Python-based stock prediction service

3. **Database**:
   - PostgreSQL for persistent data storage
   - `db.js`: Database connection and query interface

4. **Middleware**:
   - `auth.js`: JWT authentication middleware

### API Documentation

#### Authentication Endpoints
- `POST /auth/register`: Register a new user
- `POST /auth/login`: User login
- `GET /auth/profile`: Get user profile information

#### Transaction Endpoints
- `GET /transactions`: Fetch user transactions
- `POST /transactions`: Create a new transaction
- `PUT /transactions/:id`: Update an existing transaction
- `DELETE /transactions/:id`: Delete a transaction

#### Goals Endpoints
- `GET /goals`: Fetch user goals
- `POST /goals`: Create a new goal
- `PUT /goals/:id`: Update goal information
- `DELETE /goals/:id`: Delete a goal

#### AI Endpoints
- `POST /api/chat/initialize`: Initialize a chat session
- `POST /api/chat/message`: Send message to AI assistant
- `GET /api/chat/history`: Retrieve chat history
- `DELETE /api/chat/clear`: Clear chat history
- `GET /llm/categorise`: AI-based transaction categorization
- `GET /llm/summarise`: Generate financial insights and summaries
- `POST /api/predict`: AI stock prediction

### AI Integration

Inflow leverages AI capabilities across several features:

1. **Transaction Categorization**:
   - Automatically categorizes transactions using natural language processing
   - Identifies spending patterns and groups similar transactions

2. **Financial Assistant Chatbot**:
   - Uses LLM to provide financial advice
   - Answers questions about budget planning, investment strategies, and financial health
   - Offers personalized suggestions based on the user's financial data

3. **Financial Insights**:
   - Analyzes transaction history to generate actionable insights
   - Provides financial health scores and recommendations
   - Identifies areas for potential savings

4. **Stock Predictions**:
   - Uses XGBoost model to predict stock trends
   - Analyses historical data to make informed forecasts
   - Provides confidence levels for predictions

### Deployment Guide

#### Frontend Deployment
1. Build the production version:
   ```bash
   cd Frontend
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web hosting service.

#### Backend Deployment
1. Set up a PostgreSQL database on your hosting platform
2. Configure environment variables on your hosting platform
3. Deploy the Node.js application with:
   ```bash
   cd InflowBackend
   npm install --production
   node src/server.js
   ```

### Troubleshooting

**Common Issues and Solutions**:

1. **Authentication Issues**:
   - Ensure JWT token is being properly stored and sent with requests
   - Check token expiration settings

2. **API Connection Problems**:
   - Verify CORS settings in backend configuration
   - Check that environment variables are correctly set

3. **Data Visualization Issues**:
   - Ensure transaction data is properly formatted for charts
   - Check browser console for any JavaScript errors

4. **AI Service Unavailability**:
   - Verify that LLM services are operational
   - Check network connectivity to AI endpoints

### Contributing

We welcome contributions to improve Inflow:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m "Add feature-name"`
5. Push to your fork: `git push origin feature-name`
6. Create a pull request

Please follow the existing code style and add appropriate tests for new features.

### License

This project is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.

For more information about the license, visit [http://creativecommons.org/licenses/by-sa/4.0/](http://creativecommons.org/licenses/by-sa/4.0/).

### Support

For inquiries, support, or feedback, please contact:

- **Email**: borndeveloper@gmail.com
- **Phone**: +91 98558-01283
- **Address**: 2832/2 Indra Nagar, Ludhiana

---

**Inflow** - Empowering smarter financial decisions with AI.
