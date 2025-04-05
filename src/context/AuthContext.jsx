import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data.user); // Update user state with profile data
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("isLoggedIn", "true");
                } catch (error) {
                    console.error('Error fetching user profile:', error.response?.data || error.message);
                    logout(); // Clear session if token is invalid
                }
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, []);

    const register = async (username, email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
                username,
                email,
                password,
            });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");
            setUser(user); // Save user and update state
            return user;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                email,
                password,
            });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");
            setUser(user); // Update user state
            window.location.reload(); // Reload the page to reflect changes
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setUser(null); // Clear user state
    };

    if (loading) return <div className="text-center text-white">Loading...</div>; // Lightweight loader

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
