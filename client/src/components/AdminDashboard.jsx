import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

import { useAdmin } from "../context/AdminContext";
import AddSweet from "./AddSweet";
import UpdateSweet from "./UpdateSweet";
import RestockSweet from "./RestockSweet";
import { api } from "../hooks/api";

// Debounce helper – avoids firing API on every keystroke
function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value]);
    return debounced;
}

const AdminDashboard = () => {
    const {
        setAdminDashboardOpen,
        setAddOpen,
        setUpdateOpen,
        setUpdateSweetData,
        setRestockOpen,
        setRestockData,
    } = useAdmin();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search
    const [name, setName] = useState("");
    const debouncedName = useDebounce(name);

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

    /* ---------------- FETCH PAGINATED ---------------- */
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

    /* ---------------- FETCH FILTERED ---------------- */
    const fetchFiltered = async () => {
        let q = [];
        if (debouncedName) q.push(`name=${debouncedName}`);
        if (category) q.push(`category=${category}`);
        if (minPrice) q.push(`minPrice=${minPrice}`);
        if (maxPrice) q.push(`maxPrice=${maxPrice}`);

        const finalQuery = q.length ? "?" + q.join("&") : "";

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

    useEffect(() => {
        if (!filtersActive) fetchSweets();
    }, [page]);

    useEffect(() => {
        if (filtersActive) fetchFiltered();
    }, [debouncedName, category, minPrice, maxPrice]);

    /* ---------------- DELETE A SWEET ---------------- */
    const deleteSweet = async (id) => {
        await api.delete(`/sweet/${id}`);
        filtersActive ? fetchFiltered() : fetchSweets();
    };

    return (
        <>
            {/* Modals */}
            <AddSweet refresh={fetchSweets} />
            <UpdateSweet refresh={fetchSweets} />
            <RestockSweet refresh={fetchSweets} />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex justify-center font-poppins px-3 sm:px-5 pb-20"
            >
                <div className="w-full max-w-6xl p-4 sm:p-6 bg-white shadow-lg rounded-xl mt-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black">
                            Admin Dashboard
                        </h2>

                        <button
                            onClick={() => setAdminDashboardOpen(false)}
                            className="text-3xl text-gray-600 hover:text-black"
                        >
                            <IoClose />
                        </button>
                    </div>

                    {/* TOP CONTROLS (RESPONSIVE ORDERING) */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">

                        {/* SEARCH BAR */}
                        <div className="relative flex-1 order-1">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Search sweets..."
                                className="w-full p-3 pl-12 border rounded-xl border-gray-300"
                            />
                            <CiSearch className="absolute top-4 left-4 text-xl text-gray-600" />
                        </div>

                        {/* FILTER BUTTON (Above Add Button on Mobile) */}
                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="px-5 py-3 rounded-lg border border-gray-400 hover:bg-gray-100 transition
                                       order-2 sm:order-1 w-full sm:w-auto"
                        >
                            Filters
                        </button>

                        {/* ADD SWEET BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAddOpen(true)}
                            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900
                                       order-3 sm:order-2 w-full sm:w-auto"
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
                                className="w-full bg-white border shadow-md rounded-xl p-5 mb-6"
                            >
                                <div className="flex flex-col mb-5">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min Price"
                                        className="p-3 border rounded-lg"
                                    />

                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max Price"
                                        className="p-3 border rounded-lg"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={fetchFiltered}
                                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
                                    >
                                        Apply
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
                                        Clear
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SWEETS GRID */}
                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : sweets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No sweets found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
                            {sweets.map((sweet) => (
                                <motion.div
                                    key={sweet._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col sm:flex-row gap-4 bg-white border rounded-xl p-4 shadow hover:shadow-lg transition"
                                >
                                    <img
                                        src={sweet.image}
                                        alt={sweet.name}
                                        className="w-full sm:w-28 h-32 object-cover rounded-lg"
                                    />

                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-lg font-semibold">{sweet.name}</h4>

                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {sweet.description}
                                        </p>

                                        <div className="flex justify-between mt-3">
                                            <span className="font-semibold">₹{sweet.price}</span>
                                            <span className="font-semibold">{sweet.quantity} kg</span>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-4">
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
                                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
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

                            <span className="text-lg font-semibold">
                                Page {page} / {totalPages}
                            </span>

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
