import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash, FiPlus, FiCheck, FiX } from "react-icons/fi";

import Navbar from "../components/Navbar";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState(null);

  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
    setGoals(storedGoals);
  }, []);

  const saveToLocalStorage = (updatedGoals) => {
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
  };

  const handleAddOrEdit = (goal) => {
    let updatedGoals;
    if (goal.id) {
      updatedGoals = goals.map((g) => (g.id === goal.id ? goal : g));
    } else {
      updatedGoals = [...goals, { ...goal, id: Date.now(), completed: false }];
    }
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
    setCurrentGoal(null);
  };

  const handleDelete = (id) => {
    const updatedGoals = goals.filter((g) => g.id !== id);
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
  };

  const toggleCompletion = (id) => {
    const updatedGoals = goals.map((goal) => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
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
            <h1 className="text-2xl md:text-3xl font-bold text-[#000000]">Goals</h1>
            <motion.button
              className="hidden sm:flex items-center px-4 py-2 bg-[#007BFF] text-white rounded-full shadow-md hover:bg-[#0056B3] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentGoal({ 
                title: "", 
                description: "", 
                amount: "", 
                deadline: "30",
                createdAt: new Date().toISOString().split('T')[0],
                completed: false 
              })}
            >
              <FiPlus className="mr-1" /> Add Goal
            </motion.button>
          </div>
          
          <div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#DEE2E6] text-left bg-[#F1F3F5]">
                    <th className="p-3 text-[#495057] font-semibold">Status</th>
                    <th className="p-3 text-[#495057] font-semibold">Title</th>
                    <th className="p-3 text-[#495057] font-semibold">Target Amount</th>
                    <th className="p-3 text-[#495057] font-semibold">Deadline</th>
                    <th className="p-3 text-[#495057] text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.length > 0 ? (
                    goals.map((goal) => (
                      <tr 
                        key={goal.id} 
                        className={`border-b border-[#DEE2E6] hover:bg-[#F8F9FA] transition-colors ${
                          goal.completed ? "bg-[#F0FFF4]" : ""
                        }`}
                      >
                        <td className="p-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-full ${
                              goal.completed 
                                ? "bg-[#28A745] text-white" 
                                : "bg-[#E9ECEF] text-[#6C757D]"
                            }`}
                            onClick={() => toggleCompletion(goal.id)}
                          >
                            <FiCheck size={16} />
                          </motion.button>
                        </td>
                        <td className="p-3 font-medium">{goal.title}</td>
                        <td className="p-3">${goal.amount}</td>
                        <td className="p-3">
                          {goal.deadline} days
                          {goal.createdAt && (
                            <div className="text-xs text-[#6C757D]">
                              from {new Date(goal.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-[#007BFF] p-2"
                            onClick={() => setCurrentGoal(goal)}
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-[#DC3545] p-2"
                            onClick={() => handleDelete(goal.id)}
                          >
                            <FiTrash />
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-[#6C757D]">
                        No goals found. Add one to get started!
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
        onClick={() => setCurrentGoal({ 
          title: "", 
          description: "", 
          amount: "", 
          deadline: "30",
          createdAt: new Date().toISOString().split('T')[0],
          completed: false 
        })}
      >
        <FiPlus size={24} />
      </motion.button>

      {/* Modal with AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {currentGoal && (
          <GoalModal
            goal={currentGoal}
            onSave={handleAddOrEdit}
            onClose={() => setCurrentGoal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const GoalModal = ({ goal, onSave, onClose }) => {
  const [form, setForm] = useState({
    ...goal,
    createdAt: goal.createdAt || new Date().toISOString().split('T')[0]
  });
  
  // Create a ref for the modal content
  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
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
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0  backdrop-blur-sm" />
      
      {/* Modal content */}
      <motion.div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#212529]">
            {goal.id ? "Edit" : "Add"} Goal
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
              placeholder="Goal title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Description</label>
            <textarea
              name="description"
              placeholder="Detailed description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Target Amount ($)</label>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) || "" })}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Deadline (days)</label>
            <input
              type="number"
              name="deadline"
              placeholder="Days to complete"
              value={form.deadline}
              onChange={handleChange}
              min="1"
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#495057]">Start Date</label>
            <input
              type="date"
              name="createdAt"
              value={form.createdAt}
              onChange={handleChange}
              className="w-full p-3 border border-[#DEE2E6] rounded-lg bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
              className="h-4 w-4 text-[#007BFF] focus:ring-[#007BFF] border-[#DEE2E6] rounded"
            />
            <label htmlFor="completed" className="text-sm font-medium text-[#495057]">
              Mark as completed
            </label>
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
              disabled={!form.title || !form.amount || !form.deadline}
            >
              Save
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  export default GoalsPage;
  