import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";

import Navbar from "../components/Navbar";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  const saveToLocalStorage = (updatedTransactions) => {
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const handleAddOrEdit = (transaction) => {
    let updatedTransactions;
    if (transaction.id) {
      updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    } else {
      updatedTransactions = [...transactions, { ...transaction, id: Date.now() }];
    }
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions);
    setCurrentTransaction(null);
  };

  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions);
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
              onClick={() => setCurrentTransaction({ date: "", description: "", type: "income", amount: "" })}
            >
              <FiPlus className="mr-1" /> Add Transaction
            </motion.button>
          </div>
          
          <div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#DEE2E6] text-left bg-[#F1F3F5]">
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
                        <td className="p-3">{transaction.date}</td>
                        <td className="p-3">{transaction.description}</td>
                        <td
                          className={`p-3 font-medium ${
                            transaction.type === "income"
                              ? "text-[#28A745]"
                              : transaction.type === "expense"
                                ? "text-[#DC3545]"
                                : "text-[#FFC107]"
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
                      <td colSpan="5" className="p-4 text-center text-[#6C757D]">
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
        onClick={() => setCurrentTransaction({ date: "", description: "", type: "income", amount: "" })}
      >
        <FiPlus size={24} />
      </motion.button>

      {/* Modal */}
      {currentTransaction && (
        <TransactionModal
          transaction={currentTransaction}
          onSave={handleAddOrEdit}
          onClose={() => setCurrentTransaction(null)}
        />
      )}
    </div>
  );
};

const TransactionModal = ({ transaction, onSave, onClose }) => {
  const [form, setForm] = useState(transaction);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50 px-4">
      <motion.div
        className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-[#212529]">
          {transaction.id ? "Edit" : "Add"} Transaction
        </h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
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
              className="w-full p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="upcoming expense">Upcoming Expense</option>
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
              className="w-full p-2 border border-[#DEE2E6] rounded bg-[#F1F3F5] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <motion.button 
            className="px-4 py-2 bg-[#6C757D] text-white rounded-md hover:bg-[#5a6268]" 
            onClick={onClose}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#0056B3]"
            onClick={() => {
              onSave(form);
              onClose();
            }}
            whileTap={{ scale: 0.95 }}
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsPage;
