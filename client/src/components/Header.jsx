import React, { useState } from "react";
import logo from "/logo.png";
import { CiSearch, CiUser, CiMenuBurger } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const Header = () => {
    const { setAuthOpen, isAdmin, user } = useAuth();
    const { setAdminDashboardOpen } = useAdmin();

    const [menuOpen, setMenuOpen] = useState(false);

    // Smooth scroll handler
    const goTo = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMenuOpen(false); // close mobile menu after clicking
    };

    return (
        <header className="w-full bg-white font-poppins shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">

                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => goTo("about-section")}
                >
                    <img src={logo} alt="Logo" className="w-12 h-12 object-cover" />
                    <h1 className="text-xl font-semibold">SweetShop</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-8 text-gray-700 font-medium">
                        <li
                            onClick={() => goTo("about-section")}
                            className="hover:text-black cursor-pointer"
                        >
                            About
                        </li>
                        <li
                            onClick={() => goTo("sweets-section")}
                            className="hover:text-black cursor-pointer"
                        >
                            Sweets
                        </li>
                        <li
                            onClick={() => goTo("contact-section")}
                            className="hover:text-black cursor-pointer"
                        >
                            Contact Us
                        </li>

                        {isAdmin && (
                            <li
                                className="hover:text-black cursor-pointer"
                                onClick={() => setAdminDashboardOpen(true)}
                            >
                                Admin Panel
                            </li>
                        )}
                    </ul>
                </nav>

                {/* Icons on Right */}
                <div className="flex items-center gap-4 text-2xl text-gray-700 md:hidden">

                    {/* Mobile Menu Toggle */}
                    {menuOpen ? (
                        <IoClose
                            className="cursor-pointer"
                            onClick={() => setMenuOpen(false)}
                        />
                    ) : (
                        <CiMenuBurger
                            className="cursor-pointer"
                            onClick={() => setMenuOpen(true)}
                        />
                    )}

                    <CiUser
                        className="hover:text-black cursor-pointer hidden md:block"
                        onClick={() => setAuthOpen(true)}
                    />
                </div>

                {/* Desktop User Icon */}
                <div className="hidden md:flex items-center gap-4 text-2xl text-gray-700">
                    <CiUser
                        className="hover:text-black cursor-pointer"
                        onClick={() => setAuthOpen(true)}
                    />
                </div>
            </div>

            {/* ------------------------- MOBILE DROPDOWN MENU ------------------------- */}
            <div
                className={`md:hidden bg-white shadow-lg border-t overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <ul className="flex flex-col px-6 py-4 text-gray-700 font-medium space-y-4">

                    <li
                        className="hover:text-black cursor-pointer"
                        onClick={() => goTo("about-section")}
                    >
                        About
                    </li>

                    <li
                        className="hover:text-black cursor-pointer"
                        onClick={() => goTo("sweets-section")}
                    >
                        Sweets
                    </li>

                    <li
                        className="hover:text-black cursor-pointer"
                        onClick={() => goTo("contact-section")}
                    >
                        Contact Us
                    </li>

                    {isAdmin && (
                        <li
                            className="hover:text-black cursor-pointer"
                            onClick={() => {
                                setAdminDashboardOpen(true);
                                setMenuOpen(false);
                            }}
                        >
                            Admin Panel
                        </li>
                    )}

                    <li
                        className="hover:text-black cursor-pointer"
                        onClick={() => {
                            setAuthOpen(true);
                            setMenuOpen(false);
                        }}
                    >
                        {user ? "Account details" : "Login / Signup"}
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
