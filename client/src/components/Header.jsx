import React from 'react'
import logo from '../assets/logo.png';
import { CiSearch, CiUser } from "react-icons/ci";
import { useUser } from "../context/UserContext";

const Header = () => {
    const { setAuthOpen } = useUser();

    return (
        <header className="w-full bg-white font-poppins">
            <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">

                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-12 h-12 object-cover" />
                    <h1 className="text-xl font-semibold">SweetShop</h1>
                </div>

                <nav>
                    <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
                        <li className="hover:text-black cursor-pointer transition">Home</li>
                        <li className="hover:text-black cursor-pointer transition">About</li>
                        <li className="hover:text-black cursor-pointer transition">Sweets</li>
                        <li className="hover:text-black cursor-pointer transition">Contact Us</li>
                    </ul>
                </nav>

                <div className="flex items-center gap-4 text-2xl text-gray-700 cursor-pointer">
                    <CiSearch className="hover:text-black transition" />

                    <CiUser
                        className="hover:text-black transition"
                        onClick={() => setAuthOpen(true)}
                    />
                </div>

            </div>
        </header>
    );
};

export default Header;
