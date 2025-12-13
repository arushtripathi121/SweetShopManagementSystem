import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../hooks/api";

const UserAuth = () => {
    const { authOpen, setAuthOpen, user, setUser, setIsAdmin } = useUser();
    const [tab, setTab] = useState("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const updateField = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d).{6,}$/;

    const fetchUser = async () => {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!emailRegex.test(form.email)) return setError("Invalid email format.");
        if (!passwordRegex.test(form.password))
            return setError("Password must be 6+ chars & include a number");

        try {
            setLoading(true);
            await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

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
        if (!passwordRegex.test(form.password)) return setError("Weak password.");
        if (form.password !== form.confirmPassword)
            return setError("Passwords do not match.");

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
            setError("Email already registered.");
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
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
                    onClick={() => setAuthOpen(false)}
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.92 }}
                        transition={{
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="bg-white rounded-2xl p-8 w-100 max-w-[90%] min-h-[60vh] max-h-[85vh] overflow-y-auto shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setAuthOpen(false)}
                            className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black transition"
                        >
                            <IoClose />
                        </button>

                        {/* 🟦 USER DETAILS IF LOGGED IN */}
                        {user ? (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="flex flex-col items-center text-center gap-4 mt-8"
                            >
                                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold">
                                    {user.name[0]}
                                </div>

                                <h2 className="text-2xl font-semibold">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>

                                <p className="px-4 py-1 rounded-full bg-black text-white text-sm">
                                    {user.role.toUpperCase()}
                                </p>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
                                >
                                    Logout
                                </motion.button>
                            </motion.div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold mb-6 text-center">
                                    {tab === "login" ? "Welcome Back" : "Create Account"}
                                </h2>

                                <div className="flex mb-6 border-b">
                                    <button
                                        className={`w-1/2 py-2 text-lg font-medium transition ${tab === "login"
                                            ? "text-black border-b-2 border-black"
                                            : "text-gray-500"
                                            }`}
                                        onClick={() => setTab("login")}
                                    >
                                        Login
                                    </button>

                                    <button
                                        className={`w-1/2 py-2 text-lg font-medium transition ${tab === "signup"
                                            ? "text-black border-b-2 border-black"
                                            : "text-gray-500"
                                            }`}
                                        onClick={() => setTab("signup")}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                                )}

                                {/* LOGIN */}
                                {tab === "login" && (
                                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={form.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={form.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-700"
                                        >
                                            {loading ? "Processing..." : "Login"}
                                        </motion.button>
                                    </form>
                                )}

                                {/* SIGNUP */}
                                {tab === "signup" && (
                                    <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={form.name}
                                            onChange={(e) => updateField("name", e.target.value)}
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={form.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={form.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={form.confirmPassword}
                                            onChange={(e) =>
                                                updateField("confirmPassword", e.target.value)
                                            }
                                            className="border p-3 rounded-lg outline-none transition-all duration-300 focus:ring focus:ring-gray-300"
                                        />

                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:bg-gray-700"
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
