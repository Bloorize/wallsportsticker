import React from 'react';
import RivalryTicker from '../display/RivalryTicker';
import logo from '/logo.png';

/**
 * Holy War Layout - Solid BYU Brand Colors
 * Navy: #002E5D, Royal: #0047BA, White: #FFFFFF
 * NO GRADIENTS - Solid colors only
 */
const HolyWarLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen relative overflow-hidden bg-[#002E5D]">
            {/* Main content container with safe area */}
            <div className="absolute inset-3 md:inset-4 lg:inset-6 flex flex-col z-10 overflow-hidden">
                {/* Header - Refined borders */}
                <header className="h-20 md:h-24 lg:h-28 flex items-center justify-between px-10 md:px-14 lg:px-20 
                    bg-[#002E5D] border border-white/30 rounded-3xl shadow-xl
                    relative overflow-hidden mb-4 md:mb-5 lg:mb-6 flex-none">
                    
                    <div className="flex items-center gap-6 md:gap-8 relative z-10">
                        <img src={logo} alt="BYU Logo" className="h-12 md:h-16 lg:h-20 object-contain drop-shadow-2xl" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none"
                                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                                THE HOLY WAR
                            </h1>
                            <p className="text-xs md:text-sm lg:text-base font-semibold text-white uppercase tracking-[0.3em] mt-1 opacity-70">
                                BYU vs UTAH
                            </p>
                        </div>
                    </div>

                    {/* Live indicator */}
                    <div className="hidden md:flex items-center gap-3 px-6 py-3
                        bg-white border border-white/30 rounded-full relative z-10 shadow-lg">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-[#002E5D] rounded-full animate-ping absolute" />
                            <div className="w-2.5 h-2.5 bg-[#002E5D] rounded-full relative" />
                        </div>
                        <span className="text-sm font-bold text-[#002E5D] uppercase tracking-widest">LIVE</span>
                    </div>
                </header>

                {/* Dashboard Content - White background with refined border */}
                <section className="flex-grow relative overflow-hidden min-h-0 
                    bg-white border border-white/20 rounded-3xl shadow-xl">
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        {children}
                    </div>
                </section>

                {/* Rivalry Ticker */}
                <div className="flex-none mt-4 md:mt-5 lg:mt-6">
                    <RivalryTicker />
                </div>
            </div>
        </div>
    );
};

export default HolyWarLayout;
