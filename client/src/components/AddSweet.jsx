import React, { useState } from "react";
import { motion } from "framer-motion";
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

    if (!addOpen) return null;

    const handleChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post("/sweet/", fields);
            refresh();             // 🔥 fetch updated list
            setAddOpen(false);     // close modal
        } catch (err) {
            alert("Failed to add sweet");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]"
        >
            <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                className="bg-white p-6 w-[400px] rounded-xl shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Sweet</h2>
                    <IoClose
                        data-testid="close-btn"
                        className="text-3xl cursor-pointer"
                        onClick={() => setAddOpen(false)}
                    />
                </div>

                <input name="name" onChange={handleChange} placeholder="Name" className="w-full p-3 border rounded mb-3" />
                <input name="price" onChange={handleChange} placeholder="Price" className="w-full p-3 border rounded mb-3" />
                <input name="quantity" onChange={handleChange} placeholder="Quantity" className="w-full p-3 border rounded mb-3" />
                <input name="category" onChange={handleChange} placeholder="Category" className="w-full p-3 border rounded mb-3" />
                <input name="image" onChange={handleChange} placeholder="Image URL" className="w-full p-3 border rounded mb-3" />
                <textarea name="description" onChange={handleChange} placeholder="Description" className="w-full p-3 border rounded mb-3" />

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-black text-white rounded-lg"
                >
                    Add Sweet
                </button>
            </motion.div>
        </motion.div>
    );
};

export default AddSweet;
