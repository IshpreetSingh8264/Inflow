# Inflow - AI-Powered Financial Assistant

Inflow is an AI-powered financial assistant designed to make money management smarter, seamless, and effortless. It provides users with tools to track expenses, analyze spending habits, and gain actionable insights for better financial decisions.

## Features

- **Dashboard**: Personalized dashboard with financial news, market tickers, and stock trends.
- **AI Chatbot**: AI-powered assistant for financial queries, budgeting, and investment recommendations.
- **Financial Analysis**: Visualize income, expenses, and trends with charts and filters.
- **AI Stock Predictions**: Advanced AI-powered stock market analysis and predictions.
- **Goal Management**: Set and track financial goals.
- **Categorized Transactions**: Automatic categorization of transactions using AI.
- **Contact Us**: Reach out for support or inquiries.
- **Authentication**: Secure login and signup functionality.

## Tech Stack

- **Frontend**: React, React Router, Framer Motion, Recharts
- **Backend**: Node.js (API integration assumed)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **APIs**: Finnhub API, Custom Backend APIs
- **Deployment**: (Specify if applicable)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/inflow.git
   cd inflow/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Frontend` directory and add the following:
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser at `http://localhost:5173`.

## Project Structure

```
Frontend/
├── src/
│   ├── components/       # Reusable components (Navbar, NewsModal, etc.)
│   ├── context/          # Context API for authentication
│   ├── pages/            # Page components (Dashboard, AnalysisPage, etc.)
│   ├── services/         # API service functions
│   ├── App.jsx           # Main app component
│   ├── Router.jsx        # Application routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build.

## Key Pages

1. **Dashboard**: Displays financial news, market tickers, and stock trends.
2. **AI Chatbot**: Interactive chatbot for financial assistance.
3. **Analysis Page**: Visualize financial data with charts and filters.
4. **AI Stocks Page**: Predict stock trends using AI.
5. **Contact Us**: Contact form and company details.
6. **About Us**: Overview of the project and its purpose.

## API Integration

- **Finnhub API**: Used for fetching financial news and stock data.
- **Custom Backend APIs**:
  - `/transactions`: Fetch user transactions.
  - `/llm/categorise`: Categorize transactions using AI.
  - `/llm/summarise`: Generate financial summaries.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License. See the [LICENSE](LICENSE) file for details.

For more information about the license, visit [http://creativecommons.org/licenses/by-sa/4.0/](http://creativecommons.org/licenses/by-sa/4.0/).

## Contact

For inquiries or support, contact us at:
- **Email**: borndeveloper@gmail.com
- **Phone**: +91 98558-01283
- **Address**: 2832/2 Indra Nagar, Ludhiana.

---

**Inflow** - Empowering smarter financial decisions with AI.