"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State to store user data
    const [loading, setLoading] = useState(true); // State to track if auth check is still loading
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simulate user login function
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
        setLoading(false);
    };

    const redirectToLoginOnNoSession = _ => {
        if (!user) redirect("/login")
    };

    // Simulate user logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user"); // Clear user data from localStorage
        setLoading(false);
    };



    // Load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));

        }
        setLoading(false); // Stop loading once we know the user's status
    }, []);

    // Show loading screen or nothing if the auth status is still being determined
    if (loading) {
        return <div>....Loading...</div>; // Or you can return null for no flash
        // return null// Or you can return null for no flash
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, redirectToLoginOnNoSession, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);