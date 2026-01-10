import React from 'react';
import RivalryTicker from '../display/RivalryTicker';
import logo from '/logo.png';

/**
 * Holy War Layout - ESPN-inspired clean design
 * BYU Colors: Navy #002E5D
 */
const HolyWarLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen flex flex-col bg-[#002E5D] overflow-hidden">
            {/* Header - ESPN style thin bar */}
            <header className="flex-none h-14 md:h-16 flex items-center justify-between px-4 md:px-6 
                bg-[#001a3d] border-b border-white/10">
                
                <div className="flex items-center gap-4">
                    <img src={logo} alt="BYU Logo" className="h-8 md:h-10 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-none">
                            THE HOLY WAR
                        </h1>
                        <p className="text-[10px] md:text-xs font-medium text-white/60 uppercase tracking-wider">
                            BYU vs UTAH
                        </p>
                    </div>
                </div>

                {/* Live indicator - ESPN style */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">LIVE</span>
                </div>
            </header>

            {/* Dashboard Content - Full width, no borders */}
            <section className="flex-grow overflow-hidden bg-[#002E5D]">
                {children}
            </section>

            {/* Rivalry Ticker - ESPN style thin bar */}
            <div className="flex-none">
                <RivalryTicker />
            </div>
        </div>
    );
};

export default HolyWarLayout;
