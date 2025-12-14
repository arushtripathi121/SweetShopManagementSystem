import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { api } from "../hooks/api";
import { useAdmin } from "../context/AdminContext";

const AddSweet = ({ refresh }) => {
    const { addOpen, setAddOpen } = useAdmin();

    const [fields, setFields] = useState({
        name: "",
        price: "",
        category: "",
        quantity: "",
        image: "",
        description: ""
    });

    // When user types in any input
    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    // Called when clicking "Add Sweet" button
    const handleSubmit = async () => {
        try {
            await api.post("/sweet/", fields);

            // Human-style: Refresh parent list so admin sees newly added item
            refresh();

            // Close modal after success
            setAddOpen(false);
        } catch {
            alert("Failed to add sweet");
        }
    };

    return (
        <AnimatePresence>
            {addOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] px-4"
                >
                    {/* 
                      Human-style comment:
                      The modal itself grows in smoothly.
                      Width shrinks on smaller screens.
                    */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl p-6 relative"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setAddOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                        >
                            <IoClose />
                        </button>

                        <h2 className="text-2xl font-bold mb-5 text-black">
                            Add New Sweet
                        </h2>

                        {/* Input fields — clean layout, mobile friendly */}
                        <div className="flex flex-col gap-4">

                            <input
                                name="name"
                                onChange={handleChange}
                                placeholder="Sweet Name"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                name="price"
                                type="number"
                                onChange={handleChange}
                                placeholder="Price (₹)"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                name="quantity"
                                type="number"
                                onChange={handleChange}
                                placeholder="Initial Quantity (kg)"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                name="category"
                                onChange={handleChange}
                                placeholder="Category"
                                className="p-3 border rounded-lg"
                            />

                            <input
                                name="image"
                                onChange={handleChange}
                                placeholder="Image URL"
                                className="p-3 border rounded-lg"
                            />

                            <textarea
                                name="description"
                                onChange={handleChange}
                                placeholder="Description"
                                className="p-3 border rounded-lg min-h-[90px] resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition active:scale-95"
                        >
                            Add Sweet
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddSweet;
