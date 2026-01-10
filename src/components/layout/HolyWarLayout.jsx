import React from 'react';
import RivalryTicker from '../display/RivalryTicker';
import logo from '/logo.png';

/**
 * Holy War Layout - Minimal header, dashboard owns the space
 * Broadcast graphics aesthetic - clean, minimal chrome
 */
const HolyWarLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen flex flex-col bg-[#002E5D] overflow-hidden">
            {/* Minimal Header Bar */}
            <header className="flex-none h-12 md:h-14 flex items-center justify-between px-4 md:px-6 
                bg-black/20 backdrop-blur-sm border-b border-white/10">
                
                <div className="flex items-center gap-3 md:gap-4">
                    <img src={logo} alt="BYU Logo" className="h-7 md:h-8 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-sm md:text-base font-black text-white uppercase tracking-tight leading-none">
                            THE HOLY WAR
                        </h1>
                        <p className="text-[10px] md:text-xs font-medium text-white/60 uppercase tracking-wider">
                            BYU vs UTAH
                        </p>
                    </div>
                </div>

                {/* Live indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">LIVE</span>
                </div>
            </header>

            {/* Dashboard Content - Full space, no borders */}
            <section className="flex-1 overflow-hidden">
                {children}
            </section>

            {/* Rivalry Ticker */}
            <div className="flex-none">
                <RivalryTicker />
            </div>
        </div>
    );
};

export default HolyWarLayout;
