import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../hooks/api";
import { useAuth } from "../context/AuthContext";

const UserAuth = () => {
    const { authOpen, setAuthOpen, user, setUser, setIsAdmin } = useAuth();

    const [tab, setTab] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

    const fetchUser = async () => {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwdRegex = /^(?=.*\d).{6,}$/;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!emailRegex.test(form.email)) return setError("Invalid email.");
        if (!pwdRegex.test(form.password)) return setError("Weak password.");

        try {
            setLoading(true);
            await api.post("/auth/login", { email: form.email, password: form.password });
            await fetchUser();
            setAuthOpen(false);
        } catch {
            setError("Incorrect email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) return setError("Name is required.");
        if (!emailRegex.test(form.email)) return setError("Invalid email.");
        if (!pwdRegex.test(form.password)) return setError("Weak password.");
        if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

        try {
            setLoading(true);
            await api.post("/auth/signup", {
                name: form.name,
                email: form.email,
                password: form.password,
            });
            await fetchUser();
            setAuthOpen(false);
        } catch {
            setError("Email is already registered.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.get("/auth/logout");
            setUser(null);
            setIsAdmin(false);
        } catch { }
    };

    return (
        <AnimatePresence>
            {authOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-[100]"
                    onClick={() => setAuthOpen(false)}
                >
                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.35 }}
                        className="bg-white rounded-3xl w-[95%] max-w-lg shadow-2xl p-8 relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setAuthOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 text-3xl hover:text-black"
                        >
                            <IoClose />
                        </button>

                        {/* -------- LOGGED IN VIEW -------- */}
                        {user ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center py-10"
                            >
                                {/* Circular Avatar */}
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold text-black">
                                    {user.name[0]}
                                </div>

                                <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>

                                <span className="mt-3 px-4 py-1 rounded-full bg-black text-white text-sm">
                                    {user.role.toUpperCase()}
                                </span>

                                {/* Logout */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="mt-8 bg-black text-white px-8 py-3 rounded-xl text-lg hover:bg-gray-900 transition"
                                >
                                    Logout
                                </motion.button>
                            </motion.div>
                        ) : (
                            <>
                                {/* HEADING */}
                                <h2 className="text-3xl font-bold text-center mb-6 mt-2">
                                    {tab === "login" ? "Welcome Back" : "Create an Account"}
                                </h2>

                                {/* TABS */}
                                <div className="flex mb-8 bg-gray-100 rounded-xl overflow-hidden">
                                    <button
                                        className={`w-1/2 py-3 text-lg font-medium transition ${tab === "login"
                                                ? "bg-black text-white"
                                                : "text-gray-600"
                                            }`}
                                        onClick={() => setTab("login")}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`w-1/2 py-3 text-lg font-medium transition ${tab === "signup"
                                                ? "bg-black text-white"
                                                : "text-gray-600"
                                            }`}
                                        onClick={() => setTab("signup")}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <p className="text-red-500 text-sm text-center mb-4">
                                        {error}
                                    </p>
                                )}

                                {/* -------- LOGIN FORM -------- */}
                                {tab === "login" && (
                                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.password}
                                            onChange={(e) => update("password", e.target.value)}
                                        />

                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-black text-white py-3 rounded-xl mt-2 text-lg hover:bg-gray-900 transition"
                                            disabled={loading}
                                        >
                                            {loading ? "Processing..." : "Login"}
                                        </motion.button>
                                    </form>
                                )}

                                {/* -------- SIGNUP FORM -------- */}
                                {tab === "signup" && (
                                    <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.name}
                                            onChange={(e) => update("name", e.target.value)}
                                        />

                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.password}
                                            onChange={(e) => update("password", e.target.value)}
                                        />

                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black"
                                            value={form.confirmPassword}
                                            onChange={(e) => update("confirmPassword", e.target.value)}
                                        />

                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-black text-white py-3 rounded-xl mt-2 text-lg hover:bg-gray-900 transition"
                                            disabled={loading}
                                        >
                                            {loading ? "Processing..." : "Sign Up"}
                                        </motion.button>
                                    </form>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UserAuth;
