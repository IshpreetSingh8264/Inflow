import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash, FiPlus, FiX } from "react-icons/fi";
import axios from "axios"; // Import axios for API calls
import { format } from "date-fns"; // Import date-fns for formatting

import Navbar from "../components/Navbar";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);

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
        
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleAddOrEdit = async (transaction) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      let updatedTransactions;
      if (transaction.id) {
        // Update transaction
        const { data } = await axios.put(`${baseUrl}/${transaction.id}`, {
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), // Capitalize type
          created_at: transaction.date, // Pass selected date as created_at
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });
        updatedTransactions = transactions.map((t) => (t.id === transaction.id ? data.data : t));
      } else {
        // Create new transaction (id is not passed)
        const { data } = await axios.post(baseUrl, {
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), // Capitalize type
          created_at: transaction.date, // Pass selected date as created_at
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });
        updatedTransactions = [...transactions, data.data];
      }
      setTransactions(updatedTransactions);
      setCurrentTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      await axios.delete(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token
        },
      });
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      {/* Main content with proper spacing for navbar */}
      <div className="pt-24 px-4 md:px-6 lg:px-8 pb-20 flex justify-center">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#000000]">Transactions</h1>
            <motion.button
              className="hidden sm:flex items-center px-4 py-2 bg-[#007BFF] text-white rounded-full shadow-md hover:bg-[#0056B3] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTransaction({ title: "", date: "", description: "", type: "income", amount: "" })}
            >
              <FiPlus className="mr-1" /> Add Transaction
            </motion.button>
          </div>
          
          <div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#DEE2E6] text-left bg-[#F1F3F5]">
                    <th className="p-3 text-[#495057] font-semibold">Title</th>
                    <th className="p-3 text-[#495057] font-semibold">Date</th>
                    <th className="p-3 text-[#495057] font-semibold">Description</th>
                    <th className="p-3 text-[#495057] font-semibold">Type</th>
                    <th className="p-3 text-[#495057] font-semibold">Amount</th>
                    <th className="p-3 text-[#495057] text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr 
                        key={transaction.id} 
                        className="border-b border-[#DEE2E6] hover:bg-[#F8F9FA] transition-colors"
                      >
                        <td className="p-3">{transaction.title}</td>
                        <td className="p-3">
                          {format(new Date(transaction.created_at), "yyyy-MM-dd HH:mm:ss")} {/* Format created_at */}
                        </td>
                        <td className="p-3 max-w-[200px] truncate" title={transaction.description}>
                          {transaction.description} {/* Truncate long descriptions */}
                        </td>
                        <td
                          className={`p-3 font-medium ${
                            transaction.type === "Income"
                              ? "text-[#28A745]" // Green for income
                              : "text-[#DC3545]" // Red for expenses
                          }`}
                        >
                          {transaction.type}
                        </td>
                        <td className="p-3">${transaction.amount}</td>
                        <td className="p-3 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-[#007BFF] p-2"
                            onClick={() => setCurrentTransaction(transaction)}
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-[#DC3545] p-2"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <FiTrash />
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-[#6C757D]">
                        No transactions found. Add one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Add Button (visible only on mobile) */}
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-[#007BFF] text-white rounded-full shadow-lg hover:bg-[#0056B3] sm:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCurrentTransaction({ title: "", date: "", description: "", type: "income", amount: "" })}
      >
        <FiPlus size={24} />
      </motion.button>

      {/* Modal with AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {currentTransaction && (
          <TransactionModal
            transaction={currentTransaction}
            onSave={handleAddOrEdit}
            onClose={() => setCurrentTransaction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TransactionModal = ({ transaction, onSave, onClose }) => {
  const [form, setForm] = useState({
    ...transaction,
    date: transaction.created_at ? new Date(transaction.created_at).toISOString().split("T")[0] : "", // Pre-fill date
  });
  
  // Create a ref for the modal content
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // Handle click outside to close modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with immediate blur effect */}
      <div className="absolute inset-0 bg-transparent backdrop-blur-md" />
      
      {/* Modal content */}
      <motion.div
        ref={modalRef}
        className=" rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#212529]">
            {transaction.id ? "Edit" : "Add"} Transaction
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-[#6C757D] hover:text-[#343A40] p-1 rounded-full hover:bg-[#F8F9FA]"
            onClick={onClose}
          >
            <FiX size={20} />
          </motion.button>
        </div>
        
        {/* Form content */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || "" })}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-[#F8F9FA]">
          <motion.button 
            className="px-4 py-2 bg-[#E9ECEF] text-[#495057] rounded-lg hover:bg-[#DEE2E6] transition-colors" 
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0069D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              onSave(form);
              onClose();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!form.title || !form.date || !form.description || !form.amount}
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionsPage;
