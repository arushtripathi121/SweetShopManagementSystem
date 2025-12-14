import React, { useEffect, useState, useCallback } from "react";
import { api } from "../hooks/api";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { useBuySweet } from "../context/BuySweetContext";

const Sweets = () => {
    const { user } = useAuth();
    const { setBuyOpen, setSelectedSweetId } = useBuySweet();

    const [sweets, setSweets] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // FILTER STATES
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [filterOpen, setFilterOpen] = useState(false);

    const categoryOptions = [
        "Indian",
        "Bengali",
        "Classic",
        "Dry Fruit",
        "Chocolate",
        "Western",
    ];

    const filtersActive = name || category || minPrice || maxPrice;

    /* ---------------------- FETCH PAGINATED SWEETS ---------------------- */
    const fetchSweets = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/sweet?page=${page}`);
            setSweets(res.data.sweets || []);
            setTotalPages(res.data.totalPages || 1);
        } catch {
            setSweets([]);
        } finally {
            setLoading(false);
        }
    }, [page]);

    /* ---------------------- FILTER SEARCH ---------------------- */
    const fetchFilteredSweets = async () => {
        let query = [];

        if (name) query.push(`name=${name}`);
        if (category) query.push(`category=${category}`);
        if (minPrice) query.push(`minPrice=${minPrice}`);
        if (maxPrice) query.push(`maxPrice=${maxPrice}`);

        const finalQuery = query.length ? "?" + query.join("&") : "";

        try {
            setLoading(true);
            const res = await api.get(`/sweet/search${finalQuery}`);
            setSweets(res.data.sweets || []);
            setTotalPages(1);
            setPage(1);
        } catch {
            setSweets([]);
        } finally {
            setLoading(false);
            setFilterOpen(false);
        }
    };

    /* ---------------------- USE EFFECT ---------------------- */
    useEffect(() => {
        if (!filtersActive) fetchSweets();
    }, [page]);

    return (
        <main className="w-full px-10 py-10 pt-0 flex flex-col items-center font-poppins">

            {/* TITLE */}
            <div className="flex justify-between w-full max-w-7xl items-center mb-6">
                <h1 className="text-4xl font-bold text-black">Our Delicious Sweets</h1>

                <button
                    onClick={() => setFilterOpen((prev) => !prev)}
                    className="px-5 py-2.5 rounded-lg border border-gray-400 hover:border-black hover:bg-gray-100 transition text-black font-medium"
                >
                    Search ▼
                </button>
            </div>

            {/* FILTER PANEL */}
            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="w-full max-w-7xl bg-white shadow-xl border rounded-xl p-6 mb-10"
                    >
                        {/* NAME */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1">Search by Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Ladoo, Barfi..."
                                className="p-3 border rounded-lg focus:ring-2 focus:ring-black/30"
                            />
                        </div>

                        {/* CATEGORY */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="p-3 border rounded-lg bg-white"
                            >
                                <option value="">All Categories</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* PRICE RANGE */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1">Min Price</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="₹ Min"
                                    className="p-3 border rounded-lg w-full"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1">Max Price</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="₹ Max"
                                    className="p-3 border rounded-lg w-full"
                                />
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-4">
                            <button
                                onClick={fetchFilteredSweets}
                                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
                            >
                                Apply Filters
                            </button>

                            <button
                                onClick={() => {
                                    setName("");
                                    setCategory("");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    fetchSweets();
                                    setFilterOpen(false);
                                }}
                                className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SWEETS GRID */}
            {loading ? (
                <div className="text-center py-20 text-gray-500 text-xl">Loading sweets...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
                    <AnimatePresence>
                        {sweets.map((sweet) => (
                            <motion.div
                                key={sweet._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white border rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-lg transition p-4 flex flex-col"
                            >
                                <img
                                    src={sweet.image}
                                    alt={sweet.name}
                                    className="w-full h-[200px] object-cover rounded-xl"
                                />

                                <h3 className="text-xl font-semibold mt-3">{sweet.name}</h3>

                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                    {sweet.description}
                                </p>

                                <div className="flex justify-between mt-3">
                                    <span className="text-xl font-bold">₹{sweet.price}</span>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                                        ★ {sweet.rating}
                                    </span>
                                </div>

                                {user?.role !== "admin" && (
                                    <button
                                        onClick={() => {
                                            setSelectedSweetId(sweet._id);
                                            setBuyOpen(true);
                                        }}
                                        className="mt-auto py-2.5 bg-black text-white rounded-lg hover:bg-gray-900"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && sweets.length === 0 && (
                <div className="text-center py-16 text-gray-500 text-lg">
                    No sweets found.
                </div>
            )}

            {/* PAGINATION */}
            {!filtersActive && totalPages > 1 && (
                <div className="flex gap-6 mt-12 items-center">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-6 py-2.5 rounded-lg text-white ${page === 1 ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-lg font-semibold">
                        Page {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className={`px-6 py-2.5 rounded-lg text-white ${page === totalPages ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
};

export default Sweets;
