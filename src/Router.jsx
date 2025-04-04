import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import GoalPage from './pages/GoalsPage.jsx'


function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/goals" element={<GoalPage />} />
    </Routes>
  )
}

export default Router
