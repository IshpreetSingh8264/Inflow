import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#F8F9FA] text-[#212529] min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12 pb-12"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#000000] mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Inflow
          </motion.h1>
          <motion.p 
            className="text-[#495057] text-lg sm:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI-powered financial assistant making money management smarter, seamless, and effortless.
          </motion.p>
        </div>
      </motion.section>

      {/* Problem Section */}
      <motion.section 
        className="py-12 px-4 sm:px-6 md:px-8 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-[#007BFF]/10 p-4 rounded-xl inline-block mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#000000]">
                  🚀 The Problem
                </h2>
              </div>
              <p className="text-[#495057] mt-4 text-base sm:text-lg leading-relaxed">
                Managing personal finances is overwhelming. Traditional expense trackers only record transactions but fail to provide meaningful insights.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "🔹 Scattered financial data (bank accounts, UPI, wallets)",
                  "🔹 Lack of intelligent financial guidance",
                  "🔹 Inefficient money management leading to poor financial decisions"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start text-[#007BFF]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                  >
                    <span className="mr-2 mt-1">•</span>
                    <span className="text-[#495057]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              className="mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img 
                src="/images/2.png" 
                alt="Problem Illustration" 
                className="w-full max-w-md lg:max-w-lg rounded-xl shadow-md"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <motion.section 
        className="py-12 px-4 sm:px-6 md:px-8 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="order-last lg:order-first"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img 
                src="/images/application.png" 
                alt="Solution Illustration" 
                className="w-full max-w-md lg:max-w-lg rounded-xl shadow-md"
                loading="lazy"
              />
            </motion.div>
            <div>
              <div className="bg-[#28A745]/10 p-4 rounded-xl inline-block mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#000000]">
                  💡 The Solution - Inflow
                </h2>
              </div>
              <p className="text-[#495057] mt-4 text-base sm:text-lg leading-relaxed">
                Inflow is an AI-powered smart finance assistant that not only tracks expenses but analyzes spending habits and provides actionable insights.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "✅ Seamless Bank Integration - Auto-fetches bank transactions",
                  "✅ AI-Driven Expense Categorization - No manual tagging needed",
                  "✅ Personalized Financial Insights - Smart budgeting & investments"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start text-[#28A745]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                  >
                    <span className="mr-2 mt-1">•</span>
                    <span className="text-[#495057]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 px-4 sm:px-6 md:px-8 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#000000] mb-6">
            🚀 Join Us in Transforming Finance!
          </h2>
          <p className="text-[#495057] text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Interested in investing or partnering? Let's talk!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#007BFF] hover:bg-[#0056B3] text-white py-3 px-8 sm:py-4 sm:px-10 rounded-xl text-lg sm:text-xl font-medium transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
