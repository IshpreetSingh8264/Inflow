import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary
import axios from "axios"; // Import axios for API calls
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const AnalysisPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 5; // Number of transactions per page

  const baseUrl = `${import.meta.env.VITE_BASE_URL}/transactions`;

  useEffect(() => {
    // Fetch transactions from the backend
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const { data } = await axios.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });
        setTransactions(data.data);
        console.log("Fetched transactions:", data.data);
        
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
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
        const transactionDate = new Date(transaction.created_at);
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

  const handleClearFilters = () => {
    setPieChartFilter(null);
    setActiveFilter('all');
    setDateRange({ start: null, end: null });
  };

  const handlePieClick = (data, index) => {
    const clickedType = chartData.typeData[index].type;
    if (pieChartFilter === clickedType) {
      setPieChartFilter(null);
      setActiveFilter('all');
    } else {
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
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalAmount = totalIncome + totalExpenses;

    const typeData = totalAmount > 0
      ? [
          { name: 'Income', value: totalIncome, type: 'Income' },
          { name: 'Expenses', value: totalExpenses, type: 'Expense' }
        ]
      : []; // Return an empty array if no data is present

    const monthlyData = transactions.length > 0
      ? transactions.reduce((acc, transaction) => {
          const month = new Date(transaction.created_at).toLocaleString('default', { month: 'short' });
          const existing = acc.find(item => item.month === month);

          if (existing) {
            if (transaction.type === 'Income') {
              existing.income += parseFloat(transaction.amount);
            } else {
              existing.expenses += Math.abs(parseFloat(transaction.amount));
            }
          } else {
            acc.push({
              month,
              income: transaction.type === 'Income' ? parseFloat(transaction.amount) : 0,
              expenses: transaction.type === 'Expense' ? Math.abs(parseFloat(transaction.amount)) : 0
            });
          }
          return acc;
        }, []).sort((a, b) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        })
      : []; // Return an empty array if no data is present

    return { typeData, monthlyData, totalAmount };
  }, [transactions]);

  const COLORS = ['#28A745', '#DC3545'];

  // Pagination logic
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const [categories, setCategories] = useState([]); // State for categorized data
  const [summary, setSummary] = useState(null); // State for summary data

  const fetchCategorizedData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/llm/categorise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(data.data.categories);
      console.log("Fetched categorized data:", data.data.categories);
      
    } catch (error) {
      console.error("Error fetching categorized data:", error);
    }
  }, []);

  const fetchSummaryData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/llm/summarise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(data.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategorizedData();
    // fetchSummaryData();
  }, [fetchCategorizedData, fetchSummaryData]);

  return (
    <ErrorBoundary>
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
            
            {/* Summary Section */}
            {summary && (
              <div className="mb-8 p-4 bg-[#FFFFFF] shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-[#212529] mb-4">Summary</h2>
                <p className="text-[#495057] mb-2">{summary.summary}</p>
                <ul className="list-disc pl-5 text-[#495057] mb-4">
                  {summary.insights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold text-[#212529] mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 text-[#495057]">
                  {summary.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
                <p className="mt-4 text-[#495057]">
                  <strong>Financial Health:</strong> {summary.financialHealth}
                </p>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 mb-8">
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
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        className="p-3 border-b border-[#DEE2E6] hover:bg-[#F8F9FA] transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-[#212529]">{transaction.title}</p>
                            <p className="text-sm text-[#6C757D]">{new Date(transaction.created_at).toLocaleDateString()}</p>
                          </div>
                          <p className={`font-medium ${
                            transaction.type === "Income" 
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

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-3 py-1 bg-[#E9ECEF] text-[#495057] rounded hover:bg-[#DEE2E6]"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-[#495057]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 bg-[#E9ECEF] text-[#495057] rounded hover:bg-[#DEE2E6]"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </motion.div>

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
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-[#DC3545] text-white rounded hover:bg-[#C82333] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
                <div className="h-64">
                  {chartData.typeData.length > 0 ? (
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
                          label={({ name, value }) => `${name}: ${(value / chartData.totalAmount * 100).toFixed(0)}%`}
                          onClick={handlePieClick}
                          activeIndex={pieChartFilter ? 
                            chartData.typeData.findIndex(d => d.type === pieChartFilter) : null}
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
                  ) : (
                    <p className="text-center text-[#6C757D] py-4">No financial data available to display.</p>
                  )}
                </div>
                <div className="mt-4 h-64">
                  {chartData.monthlyData.length > 0 ? (
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
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-[#6C757D] py-4">No financial data available to display.</p>
                  )}
                </div>
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-[#212529] mb-4">Categorized Transactions</h2>
                  {categories.length > 0 ? (
                    <ul className="space-y-2">
                      {categories.map((category) => {
                        const amount = category.amount; // Ensure amount is a valid number
                        const percentage = parseFloat(category.percentage) || 0; // Ensure percentage is a valid number
                        const formattedName = category.name.replace(/_/g, " "); // Replace underscores with spaces
                        return (
                          <li key={category.name} className="flex justify-between p-2 bg-[#F8F9FA] rounded shadow">
                            <span className="font-medium text-[#212529]">{formattedName}</span>
                            <span className="text-[#495057]">
                              {amount}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-[#6C757D]">No categorized data available.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnalysisPage;
