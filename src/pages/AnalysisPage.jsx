import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const AnalysisPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortBy, setSortBy] = useState("all");

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  const [pieChartFilter, setPieChartFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Apply date range filter first
      if (dateRange.start && dateRange.end) {
        const transactionDate = new Date(transaction.date);
        if (transactionDate < new Date(dateRange.start) || 
            transactionDate > new Date(dateRange.end)) {
          return false;
        }
      }
      // Then pie chart filter
      if (pieChartFilter) return transaction.type === pieChartFilter;
      // Finally dropdown filter
      if (activeFilter === "all") return true;
      return transaction.type === activeFilter;
    });
  }, [transactions, pieChartFilter, activeFilter, dateRange]);

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handlePieClick = (data, index) => {
    const clickedType = chartData.typeData[index].type;
    if (pieChartFilter === clickedType) {
      // Clicking same segment again removes filter
      setPieChartFilter(null);
      setActiveFilter('all');
    } else {
      // Apply new filter
      setPieChartFilter(clickedType);
      setActiveFilter(clickedType);
    }
  };

  const handleDropdownChange = (e) => {
    setActiveFilter(e.target.value);
    setPieChartFilter(null); // Clear pie chart filter when using dropdown
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    // Filter transactions by date range first
    const dateFilteredTransactions = dateRange.start && dateRange.end
      ? transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= new Date(dateRange.start) && 
                 transactionDate <= new Date(dateRange.end);
        })
      : transactions;

    // Pie chart data - all categories
    const typeData = [
      { name: 'Income', value: dateFilteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
        type: 'income' },
      { name: 'Expenses', value: Math.abs(dateFilteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)),
        type: 'expense' },
      { name: 'Upcoming', value: Math.abs(dateFilteredTransactions
        .filter(t => t.type === 'upcoming expense')
        .reduce((sum, t) => sum + t.amount, 0)),
        type: 'upcoming expense' }
    ];

    // Line chart data - monthly summary
    const monthlyData = dateFilteredTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      
      if (existing) {
        if (transaction.type === 'income') {
          existing.income += transaction.amount;
        } else {
          existing.expenses += Math.abs(transaction.amount);
        }
      } else {
        acc.push({
          month,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expenses: transaction.type === 'expense' ? Math.abs(transaction.amount) : 0,
          upcoming: transaction.type === 'upcoming expense' ? Math.abs(transaction.amount) : 0
        });
      }
      return acc;
    }, []).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    return { typeData, monthlyData };
  }, [transactions]);

  const COLORS = ['#28A745', '#DC3545', '#FFC107'];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20">
        <motion.div 
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">Financial Analysis</h1>
          
          {/* Main Analysis Section */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Transactions List (Left) */}
            <motion.div 
              className="lg:w-1/2 bg-[#FFFFFF] shadow-md rounded-lg p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#212529]">Transactions</h2>
                <select
                  value={activeFilter}
                  onChange={handleDropdownChange}
                  className="p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] text-[#495057]"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="upcoming expense">Upcoming</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="p-3 border-b border-[#DEE2E6] hover:bg-[#F8F9FA] transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-[#212529]">{transaction.description}</p>
                          <p className="text-sm text-[#6C757D]">{transaction.date}</p>
                        </div>
                        <p className={`font-medium ${
                          transaction.type === "income" 
                            ? "text-[#28A745]" 
                            : "text-[#DC3545]"
                        }`}>
                          ${transaction.amount}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-[#6C757D] py-4">No transactions found</p>
                )}
              </div>
            </motion.div>

            {/* Charts Section (Right) */}
            <motion.div 
              className="lg:w-1/2 bg-[#FFFFFF] shadow-md rounded-lg p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-[#212529] mb-2">Financial Overview</h2>
              <div className="flex gap-2 mb-2">
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">From</label>
                  <input
                    type="date"
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] text-[#495057]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6C757D] mb-1">To</label>
                  <input
                    type="date"
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] text-[#495057]"
                  />
                </div>
                {dateRange.start && dateRange.end && (
                  <button
                    onClick={() => setDateRange({ start: null, end: null })}
                    className="self-end mb-1 px-3 py-1 text-sm bg-[#DC3545] text-white rounded hover:bg-[#C82333]"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      onClick={handlePieClick}
                      activeIndex={pieChartFilter ? 
                        chartData.typeData.findIndex(d => d.type === pieChartFilter) : null}
                      activeShape={{
                        outerRadius: 90,
                        fill: COLORS[chartData.typeData.findIndex(d => d.type === pieChartFilter)]
                      }}
                    >
                      {chartData.typeData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DEE2E6',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                    <XAxis dataKey="month" stroke="#495057" />
                    <YAxis stroke="#495057" />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DEE2E6',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#28A745"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#DC3545"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="upcoming"
                      stroke="#FFC107"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* AI Budget Section */}
          <motion.div 
            className="bg-[#FFFFFF] shadow-md rounded-lg p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-[#212529] mb-4">AI Budget Insights</h2>
            <div className="p-8 bg-[#F1F3F5] rounded text-center text-[#6C757D]">
              [AI Budget Analysis Coming Soon]
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisPage;
