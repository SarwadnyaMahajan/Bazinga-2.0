import { useState } from "react";
import { Link } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";

const navItems = [
    { label: "Platform", href: "#platform" },
    { label: "Claims", href: "#claims" },
    { label: "FAQ", href: "#faq" },
    { label: "Security", href: "#security" },
    { label: "Contact", href: "#contact" },
];

const Hero = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-[#FDFBF7] overflow-hidden min-h-screen flex flex-col relative w-full">
            {/* Header */}
            <header className="w-full relative z-30">
                <div className="px-4 sm:px-6 lg:px-12 mx-auto max-w-[1400px] pt-4 sm:pt-5">
                    <div className="flex items-center justify-between rounded-full border border-[#E8E6E1] bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(10,10,10,0.04)] backdrop-blur-md sm:px-5 lg:px-6 lg:py-4">
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-[2.5px] border-[#0A0A0A] relative flex items-center justify-center">
                                    <div className="absolute top-0 right-0 w-1/2 h-1/2 border-l-[2.5px] border-b-[2.5px] border-[#0A0A0A]"></div>
                                </div>
                                <span className="text-lg sm:text-xl font-medium tracking-tight text-[#0A0A0A]">Veridium STP</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-[15px] font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity"
                                >
                                    {item.label}
                                </a>
                            ))}
                            
                            <div className="w-px h-5 bg-[#0A0A0A]/15 mx-2"></div>

                            <Link to="/login" className="text-[15px] font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity mr-2">Log in</Link>

                            <Link to="/signup" className="inline-flex items-center justify-center px-5 py-2.5 text-[15px] font-medium text-white bg-[#0A0A0A] rounded-[10px] hover:bg-[#202020] transition-colors focus:outline-none" role="button"> Access Engine </Link>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="lg:hidden inline-flex items-center gap-2 rounded-full border border-[#E8E6E1] bg-[#F8F4ED] px-3 py-2 text-sm font-medium text-[#0A0A0A]"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            <span>Menu</span>
                            {isMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="mt-3 rounded-[28px] border border-[#E8E6E1] bg-white/95 p-4 shadow-[0_16px_40px_rgba(10,10,10,0.08)] backdrop-blur-md lg:hidden">
                            <nav className="grid gap-2">
                                {navItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="rounded-2xl px-4 py-3 text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#F8F4ED]"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-4 grid gap-2 border-t border-[#ECE4D8] pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-2xl px-4 py-3 text-[15px] font-medium text-[#0A0A0A] transition-colors hover:bg-[#F8F4ED]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="inline-flex items-center justify-center rounded-2xl bg-[#0A0A0A] px-4 py-3 text-[15px] font-medium text-white"
                                >
                                    Access Engine
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative flex-1 flex flex-col justify-center w-full">
                <div className="px-4 sm:px-6 lg:px-12 mx-auto max-w-[1400px] w-full relative z-10 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-32">
                    <div className="max-w-[600px] xl:max-w-[700px]">
                        <h1 className="text-[42px] font-medium text-[#0A0A0A] sm:text-[56px] lg:text-[84px] tracking-[-0.04em] leading-[1.02] mb-5 sm:mb-6 font-serif">
                            Intelligent claims <br className="hidden sm:block" />
                            <span className="text-[#0A0A0A]">processing with STP built in.</span>
                        </h1>

                        <p className="text-[#4A4A4A] text-[17px] sm:text-[21px] leading-relaxed max-w-lg mb-8 sm:mb-12">
                            Submit car and travel claims, score them automatically, route edge cases to manual review, and keep every decision traceable.
                        </p>

                        <div className="flex flex-col gap-6">
                            {/* Input Form */}
                            <div className="relative group max-w-[440px]">
                                <div className="flex flex-col gap-2 p-[5px] bg-white border border-[#E8E6E1] rounded-[20px] shadow-sm focus-within:ring-2 focus-within:ring-[#F97316]/20 focus-within:border-[#F97316]/30 transition-all duration-200 sm:flex-row sm:items-center sm:rounded-[16px]">
                                    <input
                                        type="email"
                                        placeholder="Enter your work email"
                                        className="min-w-0 flex-1 px-4 py-3 text-[16px] text-[#0A0A0A] bg-transparent outline-none placeholder:text-[#A8A8A8]"
                                    />
                                    <Link to="/signup" className="inline-flex items-center justify-center px-7 py-3 bg-[#F97316] text-white text-[15px] font-medium rounded-[14px] hover:bg-[#EA580C] transition-colors duration-200 sm:rounded-[12px]">
                                        Request access
                                    </Link>
                                </div>
                            </div>

                            {/* Secondary Action */}
                            <Link to="/dashboard" className="flex items-center gap-3 text-[#F97316] font-medium hover:opacity-80 transition-opacity w-fit mt-1 sm:mt-2">
                                <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-[#F97316] flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 ml-[1px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="text-[15px]">Open reviewer workspace</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right side image - Absolutely positioned to bleed off the edge safely */}
                <div className="lg:absolute lg:right-0 lg:bottom-0 lg:w-[55%] xl:w-[60%] flex justify-end pointer-events-none mt-10 sm:mt-12 lg:mt-0 z-0">
                    <img
                        className="w-[125%] max-w-none -ml-[12%] translate-x-3 sm:w-[118%] sm:-ml-[6%] sm:translate-x-4 lg:w-full lg:h-auto lg:max-w-none lg:ml-0 lg:translate-x-[5%] xl:translate-x-[5%] lg:translate-y-16"
                        src="/HP-Hero-Mobile.webp"
                        alt="Nova Platform"
                        style={{
                            WebkitMaskImage: 'radial-gradient(70% 70% at 70% 60%, black 50%, transparent 100%)',
                            maskImage: 'radial-gradient(70% 70% at 70% 60%, black 50%, transparent 100%)'
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

export default Hero;
