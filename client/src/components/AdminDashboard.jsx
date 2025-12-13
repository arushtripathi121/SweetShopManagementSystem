import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

// MODALS
import AddSweet from "./AddSweet";
import UpdateSweet from "./UpdateSweet";
import RestockSweet from "./RestockSweet";

const AdminDashboard = () => {
    const {
        setAdminDashboardOpen,
        sweets,
        setSweets,
        setAddOpen,
        setUpdateOpen,
        setUpdateSweetData,
        setRestockOpen,
        setRestockData
    } = useUser();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const sweetsPerPage = 10;

    // SEARCH FILTER
    const filteredSweets = useMemo(() => {
        if (!search.trim()) return sweets;

        const lower = search.toLowerCase();
        return sweets.filter(
            (s) =>
                s.name.toLowerCase().includes(lower) ||
                s.category.toLowerCase().includes(lower) ||
                s.description?.toLowerCase().includes(lower)
        );
    }, [search, sweets]);

    // PAGINATION LOGIC
    const totalPages = Math.ceil(filteredSweets.length / sweetsPerPage);

    const currentSweets = useMemo(() => {
        const start = (page - 1) * sweetsPerPage;
        const end = start + sweetsPerPage;
        return filteredSweets.slice(start, end);
    }, [page, filteredSweets]);

    // DELETE SWEET
    const deleteSweet = (id) => {
        setSweets((prev) => prev.filter((s) => s._id !== id));
    };

    return (
        <>
            <AddSweet />
            <UpdateSweet />
            <RestockSweet />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center font-poppins"
            >
                <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-xl mt-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-black">Admin Dashboard</h2>
                        <button
                            onClick={() => setAdminDashboardOpen(false)}
                            className="text-3xl text-gray-600 hover:text-black transition"
                        >
                            <IoClose />
                        </button>
                    </div>

                    {/* TOP ACTION BAR */}
                    <div className="flex justify-between items-center mb-6">

                        {/* SEARCH BAR */}
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search sweet by name, category, description..."
                                className="w-full p-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30"
                            />
                            <CiSearch className="absolute top-3.5 left-4 text-xl text-gray-600" />
                        </div>

                        {/* ADD SWEET BUTTON */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAddOpen(true)}
                            className="ml-4 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition font-medium"
                        >
                            Add Sweet
                        </motion.button>
                    </div>

                    {/* SWEET LIST */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                        <AnimatePresence mode="wait">
                            {currentSweets.map((sweet) => (
                                <motion.div
                                    key={sweet._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex gap-4 bg-gray-100 p-4 rounded-xl shadow hover:shadow-md transition"
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={sweet.image}
                                        alt={sweet.name}
                                        className="w-28 h-28 rounded-lg object-cover"
                                    />

                                    {/* CONTENT */}
                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-lg font-semibold text-black">
                                            {sweet.name}
                                        </h4>

                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {sweet.description}
                                        </p>

                                        <div className="flex justify-between mt-3 text-black font-medium">
                                            <span>₹{sweet.price}</span>
                                            <span>{sweet.quantity} kg</span>
                                        </div>

                                        {/* BUTTONS */}
                                        <div className="flex gap-3 mt-4">

                                            {/* UPDATE */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setUpdateSweetData(sweet);
                                                    setUpdateOpen(true);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Update
                                            </motion.button>

                                            {/* RESTOCK */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setRestockData(sweet);
                                                    setRestockOpen(true);
                                                }}
                                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                            >
                                                Restock
                                            </motion.button>

                                            {/* DELETE */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => deleteSweet(sweet._id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* EMPTY STATE */}
                    {filteredSweets.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10 text-gray-500 text-lg"
                        >
                            No sweets found
                        </motion.div>
                    )}

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-6 mt-10">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-6 py-2.5 rounded-lg text-white font-medium transition 
                                    ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
                            >
                                Previous
                            </motion.button>

                            <div className="text-lg font-semibold text-black">
                                Page {page} / {totalPages}
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`px-6 py-2.5 rounded-lg text-white font-medium transition 
                                    ${page === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
                            >
                                Next
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default AdminDashboard;
