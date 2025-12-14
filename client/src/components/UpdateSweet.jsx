import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useAdmin } from "../context/AdminContext";

const UpdateSweet = () => {
    const { updateOpen, setUpdateOpen, updateSweetData } = useAdmin();

    if (!updateOpen || !updateSweetData) return null;

    const [form, setForm] = useState({
        name: updateSweetData?.name || "",
        category: updateSweetData?.category || "",
        price: updateSweetData?.price || "",
        quantity: updateSweetData?.quantity || "",
        rating: updateSweetData?.rating || 4.5,
        image: updateSweetData?.image || "",
        description: updateSweetData?.description || "",
    });

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        console.log("Updated Sweet:", form);
        // later: call API & refresh admin list
        setUpdateOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white p-6 rounded-xl w-[420px] relative font-poppins max-h-[90vh] overflow-y-auto"
            >
                <button
                    onClick={() => setUpdateOpen(false)}
                    className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
                >
                    <IoClose />
                </button>

                <h2 className="text-2xl font-bold mb-5 text-black">Update Sweet</h2>

                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <input
                    type="text"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Price (₹)</label>
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Quantity (kg)</label>
                <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => updateField("quantity", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Rating</label>
                <input
                    type="number"
                    step="0.1"
                    max="5"
                    min="0"
                    value={form.rating}
                    onChange={(e) => updateField("rating", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                <input
                    type="text"
                    value={form.image}
                    onChange={(e) => updateField("image", e.target.value)}
                    className="w-full p-3 border rounded mb-4"
                />

                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full p-3 border rounded mb-4 h-24 resize-none"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                >
                    Save Changes
                </button>
            </motion.div>
        </motion.div>
    );
};

export default UpdateSweet;
