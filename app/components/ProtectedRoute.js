"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth(); // Access the current user from context
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // If the user is not logged in, redirect to the login page
            router.push("/state_machines/login");
        }
    }, [user, router]);

    // If the user is not yet known, return null (to avoid flash)
    if (!user) {
        return null; // Or return a loading spinner here
    }

    // If the user is logged in, render the children (protected page)
    return children;
};

export default ProtectedRoute;