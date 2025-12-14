import React, { useEffect, useState, useCallback } from "react";
import { api } from "../hooks/api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useBuySweet } from "../context/BuySweetContext";

const CATEGORY_OPTIONS = [
    "Indian",
    "Bengali",
    "Classic",
    "Dry Fruit",
    "Chocolate",
    "Western",
];

const Sweets = () => {
    const { user } = useAuth();
    const { setBuyOpen, setSelectedSweetId } = useBuySweet();

    const [sweets, setSweets] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        name: "",
        category: "",
        minPrice: "",
        maxPrice: "",
    });

    const [filterOpen, setFilterOpen] = useState(false);

    const hasFilters =
        filters.name || filters.category || filters.minPrice || filters.maxPrice;

    const updateFilter = (key, value) =>
        setFilters((prev) => ({ ...prev, [key]: value }));

    const fetchSweets = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/sweet?page=${page}`);

            setSweets(data.sweets || []);
            setTotalPages(data.totalPages || 1);

        } catch {
            setSweets([]);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const fetchFiltered = async () => {
        const query = Object.entries(filters)
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k}=${v}`)
            .join("&");

        try {
            setLoading(true);
            const { data } = await api.get(`/sweet/search?${query}`);

            setSweets(data.sweets || []);
            setTotalPages(1);
            setPage(1);
        } catch {
            setSweets([]);
        } finally {
            setLoading(false);
            setFilterOpen(false);
        }
    };

    useEffect(() => {
        if (!hasFilters) fetchSweets();
    }, [page, hasFilters, fetchSweets]);

    return (
        <main id="sweets-section" className="w-full px-6 md:px-12 py-10 flex flex-col items-center font-poppins">

            {/* TITLE + FILTER BUTTON */}
            <div className="flex justify-between w-full max-w-7xl items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-black">
                    Explore Delicious Sweets
                </h1>

                <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
                >
                    Filters ▼
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
                        className="w-full max-w-7xl bg-white shadow-md border rounded-xl p-6 mb-10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                            <input
                                value={filters.name}
                                onChange={(e) => updateFilter("name", e.target.value)}
                                placeholder="Search by name"
                                className="p-3 border rounded-lg"
                            />

                            <select
                                value={filters.category}
                                onChange={(e) => updateFilter("category", e.target.value)}
                                className="p-3 border rounded-lg bg-white"
                            >
                                <option value="">Category</option>
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => updateFilter("minPrice", e.target.value)}
                                placeholder="Min Price"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                                placeholder="Max Price"
                                className="p-3 border rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={fetchFiltered}
                                className="px-6 py-3 bg-black text-white rounded-lg"
                            >
                                Apply
                            </button>

                            <button
                                onClick={() => {
                                    setFilters({
                                        name: "",
                                        category: "",
                                        minPrice: "",
                                        maxPrice: "",
                                    });
                                    fetchSweets();
                                    setFilterOpen(false);
                                }}
                                className="px-6 py-3 border border-gray-400 rounded-lg"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SWEETS GRID — SWIGGY/ZOMATO STYLE */}
            {loading ? (
                <div className="text-center py-20 text-gray-500 text-xl">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl">
                    {sweets.map((sweet) => (
                        <motion.div
                            key={sweet._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-2xl shadow-lg border hover:shadow-xl transition overflow-hidden cursor-pointer bg-white"
                        >
                            <img
                                src={sweet.image}
                                className="w-full h-[230px] object-cover"
                            />

                            <div className="p-4 space-y-2">
                                <h3 className="text-xl font-semibold">{sweet.name}</h3>

                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {sweet.description}
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xl font-bold text-black">₹{sweet.price}</span>

                                    <span className="bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
                                        ★ {sweet.rating}
                                    </span>
                                </div>

                                {user?.role !== "admin" && (
                                    <button
                                        onClick={() => {
                                            setSelectedSweetId(sweet._id);
                                            setBuyOpen(true);
                                        }}
                                        className="mt-3 w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-900"
                                    >
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* NO RESULTS */}
            {!loading && sweets.length === 0 && (
                <div className="text-center py-16 text-gray-500 text-lg">No sweets found.</div>
            )}

            {/* PAGINATION */}
            {!hasFilters && totalPages > 1 && (
                <div className="flex items-center gap-6 mt-12">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-6 py-2.5 rounded-lg text-white ${page === 1 ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-lg font-semibold">Page {page} / {totalPages}</span>

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
