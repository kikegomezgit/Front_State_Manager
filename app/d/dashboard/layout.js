
"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {

    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    return user ? <>{children}</> : null;
};

export default Layout;