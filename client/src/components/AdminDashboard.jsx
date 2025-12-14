import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

import { useAdmin } from "../context/AdminContext";
import AddSweet from "./AddSweet";
import UpdateSweet from "./UpdateSweet";
import RestockSweet from "./RestockSweet";
import { api } from "../hooks/api";

// Debounce Hook
function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

const AdminDashboard = () => {
    const {
        setAdminDashboardOpen,
        setAddOpen,
        setUpdateOpen,
        setUpdateSweetData,
        setRestockOpen,
        setRestockData
    } = useAdmin();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search (outside filter)
    const [name, setName] = useState("");
    const debouncedName = useDebounce(name, 400);

    // Filters
    const [filterOpen, setFilterOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const filtersActive = debouncedName || category || minPrice || maxPrice;

    const categoryOptions = [
        "Indian", "Bengali", "Classic", "Dry Fruit",
        "Chocolate", "Milk Sweet", "Western",
        "South Indian", "Fusion"
    ];

    /* ---------------- FETCH PAGINATED DATA ---------------- */
    const fetchSweets = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/sweet?page=${page}`);
            setSweets(res.data.sweets || []);
            setTotalPages(res.data.totalPages || 1);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- FILTER SEARCH ---------------- */
    const fetchFilteredSweets = async () => {
        let query = [];

        if (debouncedName) query.push(`name=${debouncedName}`);
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
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- EFFECTS ---------------- */
    useEffect(() => {
        if (!filtersActive) fetchSweets();
    }, [page]);

    useEffect(() => {
        if (filtersActive) fetchFilteredSweets();
    }, [debouncedName, category, minPrice, maxPrice]);

    /* ---------------- DELETE SWEET ---------------- */
    const deleteSweet = async (id) => {
        await api.delete(`/sweet/${id}`);
        filtersActive ? fetchFilteredSweets() : fetchSweets();
    };

    return (
        <>
            <AddSweet refresh={fetchSweets} />
            <UpdateSweet refresh={fetchSweets} />
            <RestockSweet refresh={fetchSweets} />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex justify-center font-poppins">
                <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-xl mt-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-black">Admin Dashboard</h2>
                        <button onClick={() => setAdminDashboardOpen(false)} className="text-3xl text-gray-600 hover:text-black">
                            <IoClose />
                        </button>
                    </div>

                    {/* TOP BAR — SEARCH | FILTERS | ADD BUTTON */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">

                        {/* SEARCH FIELD */}
                        <div className="relative flex-1 min-w-[260px]">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Search sweets..."
                                className="w-full p-3 pl-12 border border-gray-300 rounded-xl"
                            />
                            <CiSearch className="absolute top-4 left-4 text-xl text-gray-600" />
                        </div>

                        {/* FILTER BUTTON */}
                        <button
                            onClick={() => setFilterOpen(prev => !prev)}
                            className="px-5 py-2.5 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
                        >
                            Filters ▼
                        </button>

                        {/* ADD SWEET BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAddOpen(true)}
                            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900"
                        >
                            Add Sweet
                        </motion.button>
                    </div>

                    {/* FILTER PANEL */}
                    <AnimatePresence>
                        {filterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full bg-white border shadow-lg rounded-xl p-6 mb-6"
                            >
                                {/* CATEGORY */}
                                <div className="flex flex-col mb-4">
                                    <label className="font-medium text-gray-700">Category</label>
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
                                        <label className="font-medium text-gray-700">Min Price</label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="p-3 border rounded-lg w-full"
                                            placeholder="₹ Min"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-medium text-gray-700">Max Price</label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="p-3 border rounded-lg w-full"
                                            placeholder="₹ Max"
                                        />
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={fetchFilteredSweets}
                                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
                                    >
                                        Apply Filters
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCategory("");
                                            setMinPrice("");
                                            setMaxPrice("");
                                            if (!debouncedName) fetchSweets();
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

                    {/* SWEET LIST */}
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : sweets.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No sweets found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <AnimatePresence>
                                {sweets.map((sweet) => (
                                    <motion.div
                                        key={sweet._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex gap-4 bg-gray-100 p-4 rounded-xl shadow"
                                    >
                                        <img
                                            src={sweet.image}
                                            alt={sweet.name}
                                            className="w-28 h-28 rounded-lg object-cover"
                                        />

                                        <div className="flex flex-col flex-1">
                                            <h4 className="text-lg font-semibold">{sweet.name}</h4>
                                            <p className="text-sm text-gray-600">{sweet.description}</p>

                                            <div className="flex justify-between mt-3">
                                                <span>₹{sweet.price}</span>
                                                <span>{sweet.quantity} kg</span>
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        setUpdateSweetData(sweet);
                                                        setUpdateOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setRestockData(sweet);
                                                        setRestockOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
                                                >
                                                    Restock
                                                </button>

                                                <button
                                                    onClick={() => deleteSweet(sweet._id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* PAGINATION */}
                    {!filtersActive && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-6 mt-10">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-6 py-2 bg-black text-white rounded-lg disabled:bg-gray-400"
                            >
                                Previous
                            </button>

                            <div className="text-lg font-semibold">
                                Page {page} / {totalPages}
                            </div>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-6 py-2 bg-black text-white rounded-lg disabled:bg-gray-400"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default AdminDashboard;
