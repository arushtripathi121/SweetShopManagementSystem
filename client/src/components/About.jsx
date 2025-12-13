import React from 'react';
import about1 from '/about1.jpg';
import about2 from '/about2.jpg';
import about3 from '/about3.jpg';
import about4 from '/about4.png';

const About = () => {
    return (
        <main className="w-full flex flex-col justify-center items-center px-10 pb-20 pt-8">

            {/* HERO SECTION */}
            <section className="relative w-full flex justify-center items-center">

                <img
                    src={about1}
                    className="w-[90vw] max-h-[75vh] object-cover object-center rounded-2xl shadow-xl"
                />

                <div
                    className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md px-12 py-10 rounded-2xl shadow-2xl max-w-lg text-black border border-white/40"
                >
                    <div className="text-5xl font-bold mb-4 leading-tight tracking-tight">
                        Welcome to SweetShop
                    </div>

                    <div className="text-lg leading-relaxed text-gray-700">
                        Experience delightful handcrafted sweets filled with rich tradition
                        and unforgettable flavor. Pure indulgence, made fresh every day.
                    </div>
                </div>

            </section>

            {/* MIDDLE TITLE SECTION */}
            <section className="px-20 py-16 w-full flex flex-col items-center text-black text-center">

                <div className="text-5xl font-bold mb-4 leading-tight tracking-tight">
                    Excellence in Every Bite
                </div>

                <div className="text-lg max-w-5xl leading-relaxed text-gray-700">
                    At SweetShop, we combine tradition, creativity, and exceptional craftsmanship
                    to bring you sweets that delight your senses. From rich flavors to stunning
                    presentation — every creation is made with passion and precision.
                    Discover why our sweets are cherished by generations.
                </div>

            </section>

            {/* FEATURES SECTION */}
            <section className="w-full flex flex-col items-center gap-28 py-24 px-10">

                {/* 1 — IMAGE RIGHT */}
                <div className="w-[90%] flex flex-col md:flex-row items-center justify-between gap-20">

                    <div className="flex-1 text-left">
                        <div className="text-5xl font-bold mb-6 tracking-tight">Premium Quality Sweets</div>
                        <div className="text-lg text-gray-700 leading-relaxed max-w-xl">
                            Crafted with tradition and perfected with love — our sweets deliver unmatched
                            richness, freshness, and irresistible flavor in every bite.
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src={about2}
                            className="w-[460px] h-[300px] object-cover rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        />
                    </div>

                </div>

                {/* 2 — IMAGE LEFT */}
                <div className="w-[90%] flex flex-col md:flex-row-reverse items-center justify-between gap-20">

                    <div className="flex-1 text-left">
                        <div className="text-5xl font-bold mb-6 tracking-tight">Traditional Flavors</div>
                        <div className="text-lg text-gray-700 leading-relaxed max-w-xl">
                            Inspired by age-old recipes, each sweet preserves the warmth, heritage,
                            and authenticity passed down through generations.
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src={about3}
                            className="w-[460px] h-[300px] object-cover rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        />
                    </div>

                </div>

                {/* 3 — IMAGE RIGHT */}
                <div className="w-[90%] flex flex-col md:flex-row items-center justify-between gap-20">

                    <div className="flex-1 text-left">
                        <div className="text-5xl font-bold mb-6 tracking-tight">Made Fresh Daily</div>
                        <div className="text-lg text-gray-700 leading-relaxed max-w-xl">
                            We prepare everything fresh every morning so that every sweet reaches you
                            with vibrant texture, rich aroma, and delightful warmth.
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src={about4}
                            className="w-[460px] h-[300px] object-cover rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        />
                    </div>

                </div>

            </section>
        </main>
    );
};

export default About;
