import React from "react";
import logo from "/logo.png";
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer id="contact-section" className="bg-black text-gray-300 py-10 px-6 md:px-16 font-poppins">

            {/* Grid Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                {/* Brand + Social */}
                <div>
                    <img src={logo} alt="SweetShop Logo" className="w-28 mb-3" />

                    <p className="mt-3 text-sm leading-relaxed">
                        Freshly prepared Indian sweets made with love — hygienic, delicious,
                        and delivered to your doorstep.
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-xl">
                        <FaFacebook className="hover:text-white cursor-pointer" />
                        <FaInstagram className="hover:text-white cursor-pointer" />
                        <FaTwitter className="hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Home</li>
                        <li className="hover:text-white cursor-pointer">All Sweets</li>
                        <li className="hover:text-white cursor-pointer">Categories</li>
                        <li className="hover:text-white cursor-pointer">Offers</li>
                        <li className="hover:text-white cursor-pointer">Contact Us</li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Popular Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Milk Sweets</li>
                        <li className="hover:text-white cursor-pointer">Dry Fruit Sweets</li>
                        <li className="hover:text-white cursor-pointer">Bengali Sweets</li>
                        <li className="hover:text-white cursor-pointer">Sugar-Free Sweets</li>
                        <li className="hover:text-white cursor-pointer">Festival Specials</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>

                    <div className="flex items-start gap-3 mb-3 text-sm">
                        <FaMapMarkerAlt className="text-pink-500 mt-1" />
                        <span>123 Sweet Street, Mumbai, India</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-sm">
                        <FaPhone className="text-pink-500" />
                        <span>+91 91919 91919</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <FaEnvelope className="text-pink-500" />
                        <span>support@sweetshop.in</span>
                    </div>
                </div>
            </div>

            {/* Credits */}
            <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-4">
                © {new Date().getFullYear()} SweetShop. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
