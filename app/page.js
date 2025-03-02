"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

const Page = () => {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else {
            router.push("/d");
        }
    }, [user, router]);

    return null
};

export default Page;