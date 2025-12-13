import React, { useEffect, useState } from "react";
import { api } from "../hooks/api";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

const Sweets = () => {
    const [sweets, setSweets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { setBuyOpen, setSelectedSweetId } = useUser();

    const sweetsPerPage = 6;

    const fetchSweets = async () => {
        try {
            const res = await api.get("/sweet/");
            setSweets(res.data.sweets || []);
        } catch (err) {
            console.error("Error fetching sweets:", err);
            setSweets([]); // fail-safe
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    // 🛠 FIX: Safe fallback for undefined state (important for tests)
    const safeSweets = Array.isArray(sweets) ? sweets : [];

    const indexOfLastSweet = currentPage * sweetsPerPage;
    const indexOfFirstSweet = indexOfLastSweet - sweetsPerPage;

    const currentSweets = safeSweets.slice(indexOfFirstSweet, indexOfLastSweet);
    const totalPages = Math.ceil(safeSweets.length / sweetsPerPage);

    const nextPage = () =>
        currentPage < totalPages && setCurrentPage(currentPage + 1);

    const prevPage = () =>
        currentPage > 1 && setCurrentPage(currentPage - 1);

    return (
        <main className="w-full px-10 py-10 pt-0 flex flex-col items-center font-poppins">

            <div className="text-4xl font-bold text-black mb-12 tracking-tight">
                Our Delicious Sweets
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">

                <AnimatePresence mode="wait">
                    {currentSweets.map((sweet) => (
                        <motion.div
                            key={sweet._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="
                                bg-white 
                                rounded-2xl 
                                shadow-md
                                border 
                                border-gray-200
                                overflow-hidden
                                transition-all
                                hover:shadow-xl
                                hover:-translate-y-2
                                duration-300
                                flex flex-col
                                h-[430px]
                            "
                        >
                            <div className="relative w-full h-[200px] overflow-hidden">
                                <img
                                    src={sweet.image}
                                    alt={sweet.name}
                                    className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                                />

                                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                                    {sweet.category}
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <div className="text-xl font-semibold text-black tracking-tight">
                                    {sweet.name}
                                </div>

                                <div className="text-gray-600 text-sm mt-1 line-clamp-2 h-[38px]">
                                    {sweet.description}
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-black text-xl font-bold">
                                        ₹{sweet.price}
                                    </div>

                                    <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 text-sm rounded-lg font-medium shadow">
                                        ★ {sweet.rating?.toFixed(1)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedSweetId(sweet._id);
                                        setBuyOpen(true);
                                    }}
                                    className="
                                        mt-auto
                                        w-full
                                        py-2.5
                                        rounded-lg
                                        bg-black
                                        text-white
                                        text-base
                                        font-medium
                                        hover:bg-gray-900
                                        active:scale-95
                                        transition-all
                                        shadow-sm
                                        hover:shadow-md
                                        cursor-pointer
                                    "
                                >
                                    Buy Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-12">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`
                            px-6 py-2.5 rounded-lg text-white text-base font-medium
                            transition cursor-pointer
                            ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
                        `}
                    >
                        Previous
                    </button>

                    <div className="text-lg font-semibold text-black">
                        Page {currentPage} / {totalPages}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`
                            px-6 py-2.5 rounded-lg text-white text-base font-medium
                            transition cursor-pointer
                            ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
                        `}
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
};

export default Sweets;
