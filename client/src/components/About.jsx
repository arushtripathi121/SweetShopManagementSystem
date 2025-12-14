import React from "react";
import about1 from "/about1.jpg";
import about2 from "/about2.jpg";
import about3 from "/about3.jpg";
import about4 from "/about4.png";

const About = () => {
    return (
        <main
            id="about-section"
            className="w-full flex flex-col justify-center items-center px-6 md:px-10 pb-20 pt-8"
        >

            {/* Hero Section — HIDDEN on small screens */}
            <section className="relative w-full justify-center items-center hidden md:flex">

                <img
                    src={about1}
                    className="w-full max-w-[90vw] max-h-[75vh] object-cover rounded-2xl shadow-xl"
                />

                {/* Floating Box — Desktop only */}
                <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md px-6 lg:px-12 py-8 lg:py-10 rounded-2xl shadow-2xl max-w-md border border-white/40">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
                        Welcome to SweetShop
                    </h2>

                    <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                        Experience delightful handcrafted sweets prepared with tradition,
                        freshness, and flavor that stays with you.
                    </p>
                </div>
            </section>

            {/* Middle Title Section */}
            <section className="px-4 md:px-20 py-16 w-full flex flex-col items-center text-center text-black">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    Excellence in Every Bite
                </h2>

                <p className="text-gray-700 text-base md:text-lg max-w-4xl leading-relaxed">
                    We blend craftsmanship and tradition to deliver sweets that taste as
                    amazing as they look. Each creation carries passion, precision,
                    and the warmth of generations.
                </p>
            </section>

            {/* Features Section */}
            <section className="w-full flex flex-col items-center gap-20 md:gap-28 py-10 md:py-24">
                {[
                    {
                        title: "Premium Quality Sweets",
                        text: "Crafted with tradition and perfected with love — our sweets bring unmatched richness and freshness.",
                        img: about2,
                        reverse: false
                    },
                    {
                        title: "Traditional Flavors",
                        text: "Inspired by age-old recipes, each sweet carries authenticity and heritage passed through generations.",
                        img: about3,
                        reverse: true
                    },
                    {
                        title: "Made Fresh Daily",
                        text: "Prepared every morning to ensure vibrant texture, rich aroma, and fresh warmth in every bite.",
                        img: about4,
                        reverse: false
                    }
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`w-[90%] flex flex-col md:flex-row ${item.reverse ? "md:flex-row-reverse" : ""
                            } items-center justify-between gap-12 md:gap-20`}
                    >
                        <div className="flex-1 text-left">
                            <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl">
                                {item.text}
                            </p>
                        </div>

                        <div className="flex-1 flex justify-center">
                            <img
                                src={item.img}
                                className="w-[360px] md:w-[460px] h-[240px] md:h-[300px] object-cover rounded-2xl shadow-xl hover:scale-[1.02] transition-all duration-300"
                            />
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default About;
