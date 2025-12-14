import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { api } from "../hooks/api";
import { useAdmin } from "../context/AdminContext";

const UpdateSweet = ({ refresh }) => {
    const { updateOpen, setUpdateOpen, updateSweetData } = useAdmin();

    // If panel not open or data missing, do nothing
    if (!updateOpen || !updateSweetData) return null;

    // Prefill the form with the sweet's current details
    const [form, setForm] = useState({
        name: updateSweetData.name,
        category: updateSweetData.category,
        price: updateSweetData.price,
        quantity: updateSweetData.quantity,
        rating: updateSweetData.rating,
        image: updateSweetData.image,
        description: updateSweetData.description,
    });

    // Updates a single field when user types
    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Submit updated details
    const handleSubmit = async () => {
        try {
            await api.put(`/sweet/${updateSweetData._id}`, form);

            /* Human-style: Refresh main admin list so updates appear immediately */
            refresh();

            setUpdateOpen(false);
        } catch {
            alert("Failed to update sweet");
        }
    };

    return (
        <AnimatePresence>
            {updateOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] px-4"
                >
                    {/* Smooth grow animation */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="bg-white w-full max-w-[450px] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setUpdateOpen(false)}
                            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
                        >
                            <IoClose />
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-5 text-black text-center">
                            Update Sweet
                        </h2>

                        {/* Inputs - clean spacing, mobile friendly */}
                        <div className="flex flex-col gap-4">

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder="Sweet Name"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) => updateField("category", e.target.value)}
                                placeholder="Category"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => updateField("price", e.target.value)}
                                placeholder="Price (₹)"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="number"
                                value={form.quantity}
                                onChange={(e) => updateField("quantity", e.target.value)}
                                placeholder="Available Quantity (kg)"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="number"
                                step="0.1"
                                max="5"
                                min="0"
                                value={form.rating}
                                onChange={(e) => updateField("rating", e.target.value)}
                                placeholder="Rating"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                type="text"
                                value={form.image}
                                onChange={(e) => updateField("image", e.target.value)}
                                placeholder="Image URL"
                                className="p-3 border rounded-lg"
                            />

                            <textarea
                                value={form.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                placeholder="Description"
                                className="p-3 border rounded-lg min-h-[80px] resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 mt-6 bg-black text-white rounded-lg hover:bg-gray-900 active:scale-95 transition"
                        >
                            Save Changes
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateSweet;
