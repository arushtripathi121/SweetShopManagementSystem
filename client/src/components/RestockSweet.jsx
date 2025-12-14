import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { api } from "../hooks/api";
import { useAdmin } from "../context/AdminContext";

const RestockSweet = ({ refresh }) => {
    const { restockOpen, setRestockOpen, restockData } = useAdmin();
    const [qty, setQty] = useState("");

    if (!restockOpen) return null;

    const handleSubmit = async () => {
        try {
            await api.post(`/inventory/${restockData._id}/restock`, {
                quantity: qty
            });

            refresh();               // 🔥 Refresh sweets in AdminDashboard
            setRestockOpen(false);   // Close modal
        } catch (err) {
            alert("Failed to restock");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]"
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 w-[350px] rounded-xl shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Restock Sweet</h2>
                    <IoClose
                        data-testid="close-restock"
                        className="text-3xl cursor-pointer"
                        onClick={() => setRestockOpen(false)}
                    />
                </div>

                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Quantity"
                    className="w-full p-3 border rounded mb-3"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-black text-white rounded-lg mt-3"
                >
                    Add Stock
                </button>
            </motion.div>
        </motion.div>
    );
};

export default RestockSweet;
