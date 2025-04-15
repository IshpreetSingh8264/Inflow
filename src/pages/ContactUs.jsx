import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import Navbar from "../components/Navbar";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Invalid email address";
        if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });

        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <div className="z-999 bg-[#F8F9FA] min-h-screen text-[#212529] font-inter">
            <Navbar />
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center pt-24 px-4 md:px-6 lg:px-8 pb-20">
                {/* Page Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-4xl font-bold text-[#000000] mb-6 text-center"
                >
                    Contact Us
                </motion.h2>

                {/* Contact Details Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-4xl bg-[#FFFFFF] p-8 rounded-lg shadow-lg mb-6"
                >
                    <h3 className="text-2xl font-semibold text-[#212529] mb-4">Our Contact Information</h3>
                    <p className="text-[#495057] mb-4">
                        Have any questions? Feel free to reach out through the following channels.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4">
                            <FiMail className="text-[#007BFF] text-2xl" />
                            <a href="mailto:borndeveloper@gmail.com" className="text-[#212529]">borndeveloper@gmail.com</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <FiPhone className="text-[#007BFF] text-2xl" />
                            <a href="tel:09855801283" className="text-[#212529]">+91 98558-01283</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <FiMapPin className="text-[#007BFF] text-2xl" />
                            <p className="text-[#212529]">Guru Nanak Dev Polytechnic College, Gill Road Ludhiana</p>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex space-x-6 mt-4">
                        <FiFacebook className="text-[#007BFF] text-2xl cursor-pointer hover:text-[#0056B3] transition" />
                        <FiInstagram className="text-[#007BFF] text-2xl cursor-pointer hover:text-[#0056B3] transition" />
                        <FiTwitter className="text-[#007BFF] text-2xl cursor-pointer hover:text-[#0056B3] transition" />
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    className="w-full max-w-4xl bg-[#FFFFFF] p-8 rounded-lg shadow-lg"
                >
                    {success && <p className="text-[#28A745] text-center mb-4">✅ Message sent successfully!</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-[#495057] mb-2 font-medium">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#F1F3F5] text-[#212529] px-4 py-3 rounded-lg border border-[#DEE2E6] focus:outline-none focus:border-[#007BFF]"
                                placeholder="Enter your name"
                            />
                            {errors.name && <p className="text-[#DC3545] text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[#495057] mb-2 font-medium">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#F1F3F5] text-[#212529] px-4 py-3 rounded-lg border border-[#DEE2E6] focus:outline-none focus:border-[#007BFF]"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-[#DC3545] text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[#495057] mb-2 font-medium">Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-[#F1F3F5] text-[#212529] px-4 py-3 rounded-lg border border-[#DEE2E6] focus:outline-none focus:border-[#007BFF] h-32 resize-none"
                                placeholder="Enter your message"
                            ></textarea>
                            {errors.message && <p className="text-[#DC3545] text-sm mt-1">{errors.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#007BFF] hover:bg-[#0056B3] text-white font-medium py-3 rounded-lg transition duration-200"
                        >
                            Send Message
                        </motion.button>
                    </form>
                </motion.div>
            </div>

        </div>
    );
};

export default ContactUs;
