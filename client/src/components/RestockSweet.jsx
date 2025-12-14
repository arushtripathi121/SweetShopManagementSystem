import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { api } from "../hooks/api";
import { useAdmin } from "../context/AdminContext";

const RestockSweet = ({ refresh }) => {
    const { restockOpen, setRestockOpen, restockData } = useAdmin();
    const [qty, setQty] = useState("");

    // No modal visible → return nothing
    if (!restockOpen) return null;

    // Called when admin clicks "Add Stock"
    const handleSubmit = async () => {
        if (!qty || qty <= 0) {
            alert("Enter a valid quantity");
            return;
        }

        try {
            await api.post(`/inventory/${restockData._id}/restock`, {
                quantity: qty
            });

            /* Human-style: refresh the list so admin sees updated quantity */
            refresh();
            setRestockOpen(false);
        } catch {
            alert("Failed to restock sweet");
        }
    };

    return (
        <AnimatePresence>
            {restockOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] px-4"
                >
                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white w-full max-w-[380px] rounded-2xl shadow-2xl p-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setRestockOpen(false)}
                            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
                        >
                            <IoClose />
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-5 text-black text-center">
                            Restock Sweet
                        </h2>

                        {/* Sweet name preview */}
                        <div className="mb-4 bg-gray-100 p-3 rounded-lg text-center text-gray-700 font-medium">
                            {restockData?.name}
                        </div>

                        {/* Quantity Input */}
                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            placeholder="Add Quantity (kg)"
                            className="w-full p-3 border rounded-lg mb-4"
                        />

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 active:scale-95 transition"
                        >
                            Add Stock
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RestockSweet;
