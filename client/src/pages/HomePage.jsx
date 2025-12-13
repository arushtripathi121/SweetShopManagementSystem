import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../hooks/api";
import Header from "../components/Header";
import UserAuth from "../components/UserAuth";
import About from "../components/About";
import Sweets from "../components/Sweets";
import BuySweets from "../components/BuySweets";
import Footer from "../components/Footer";

const HomePage = () => {
    const { user, setUser, setIsAdmin } = useUser();

    const fetchUser = async () => {
        try {
            const response = await api.get("/auth/me");
            setUser(response.data.user);
            setIsAdmin(response.data.user.role === "admin");
        } catch {
            console.log("User not logged in");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <Header />
            <UserAuth />
            <BuySweets />
            <About />
            <Sweets />
            <Footer />
        </div>
    );
};

export default HomePage;
