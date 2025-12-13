import React, { useEffect, Suspense, lazy, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../hooks/api";
import { motion } from "framer-motion";

import Header from "../components/Header";

// Lazy load heavy components
const UserAuth = lazy(() => import("../components/UserAuth"));
const About = lazy(() => import("../components/About"));
const Sweets = lazy(() => import("../components/Sweets"));
const BuySweets = lazy(() => import("../components/BuySweets"));
const Footer = lazy(() => import("../components/Footer"));
const AdminDashboard = lazy(() => import("../components/AdminDashboard"));

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35 } }
};

const HomePage = () => {
    const { setUser, setIsAdmin, adminDashboardOpen } = useUser();

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get("/auth/me");
            setUser(response.data.user);
            setIsAdmin(response.data.user.role === "admin");
        } catch { }
    }, [setUser, setIsAdmin]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div>
            <Header />

            {/* Lazy modals (open instantly, no animation needed) */}
            <Suspense fallback={<></>}>
                <UserAuth />
                <BuySweets />
            </Suspense>

            {/* MAIN CONTENT with smooth fade animation */}
            <Suspense
                fallback={
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-[200px]"
                    />
                }
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    {adminDashboardOpen ? (
                        <AdminDashboard />
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="w-full">
                                <About />
                                <Sweets />
                                <Footer />
                            </div>
                        </div>
                    )}
                </motion.div>
            </Suspense>
        </div>
    );
};

export default HomePage;
