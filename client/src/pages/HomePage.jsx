import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { api } from "../hooks/api";
import Header from "../components/Header";
import UserAuth from "../components/UserAuth";
import About from "../components/About";

const HomePage = () => {
    const { user, setUser, isAdmin, setIsAdmin } = useUser();
    console.log("Loaded Base URL:", import.meta.env.VITE_BASE_URL);

    const fetchUser = async () => {
        try {
            const response = await api.get("/auth/me");

            setUser(response.data.user);
            setIsAdmin(response.data.user.role === "admin");
        } catch (err) {
            console.log("User not logged in");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        console.log("User:", user);
        console.log("isAdmin:", user?.role === "admin");
        console.log(isAdmin);

    }, [user]);

    return (
        <div>
            <Header />
            <UserAuth />
            <About />
        </div>
    )
};

export default HomePage;
