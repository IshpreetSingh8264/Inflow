import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import GoalPage from './pages/GoalsPage.jsx'
import AboutUs from './pages/AboutUs.jsx'
import ContactUs from './pages/ContactUs.jsx'
import AiChatbot from './pages/AiChatbot.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import AiStocksPage from './pages/AiStocksPage.jsx'


function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/goals" element={<GoalPage />} />
      <Route path="/aichat" element={<AiChatbot />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/aistocks" element={<AiStocksPage />} />
    </Routes>
  )
}

export default Router
