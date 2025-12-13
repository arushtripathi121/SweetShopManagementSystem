import React from "react";
import { IoClose } from "react-icons/io5";
import { useUser } from "../context/UserContext";

const AdminDashboard = () => {
    const { setAdminDashboardOpen } = useUser();

    return (
        <div className="w-full bg-white shadow-lg rounded-xl p-4 mt-6 max-w-5xl mx-auto font-poppins">

            {/* Header Row */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Admin Dashboard</h2>

                <button
                    onClick={() => setAdminDashboardOpen(false)}
                    className="text-3xl text-gray-600 hover:text-black transition"
                >
                    <IoClose />
                </button>
            </div>

            {/* Content */}
            <div className="text-gray-700 text-lg">
                <p>Welcome, Admin! Manage products, inventory, and orders here.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                    <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md cursor-pointer transition">
                        <h3 className="font-semibold text-black">Manage Sweets</h3>
                        <p className="text-sm text-gray-600 mt-1">Add, update, delete sweets</p>
                    </div>

                    <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md cursor-pointer transition">
                        <h3 className="font-semibold text-black">View Orders</h3>
                        <p className="text-sm text-gray-600 mt-1">Track customer orders</p>
                    </div>

                    <div className="p-6 bg-gray-100 rounded-xl shadow hover:shadow-md cursor-pointer transition">
                        <h3 className="font-semibold text-black">Inventory</h3>
                        <p className="text-sm text-gray-600 mt-1">Check stock availability</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
