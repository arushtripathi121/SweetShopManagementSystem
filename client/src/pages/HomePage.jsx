import React, { useEffect, Suspense, lazy, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { api } from "../hooks/api";
import { motion } from "framer-motion";

import Header from "../components/Header";

// Lazy-loaded sections to reduce initial bundle size
const UserAuth = lazy(() => import("../components/UserAuth"));
const About = lazy(() => import("../components/About"));
const Sweets = lazy(() => import("../components/Sweets"));
const BuySweets = lazy(() => import("../components/BuySweets"));
const Footer = lazy(() => import("../components/Footer"));
const AdminDashboard = lazy(() => import("../components/AdminDashboard"));

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};

const HomePage = () => {
    const { setUser, setIsAdmin } = useAuth();
    const { adminDashboardOpen } = useAdmin();

    // Fetch logged-in user on initial load
    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
            setIsAdmin(data.user?.role === "admin");
        } catch {
            // Not logged in — ignore silently
        }
    }, [setUser, setIsAdmin]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div>
            <Header />

            {/* Modals that may open on demand */}
            <Suspense fallback={null}>
                <UserAuth />
                <BuySweets />
            </Suspense>

            {/* Main content */}
            <Suspense
                fallback={<div className="w-full h-32 animate-pulse bg-gray-100" />}
            >
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                    {adminDashboardOpen ? (
                        <AdminDashboard />
                    ) : (
                        <>
                            <About />
                            <Sweets />
                            <Footer />
                        </>
                    )}
                </motion.div>
            </Suspense>
        </div>
    );
};

export default HomePage;
