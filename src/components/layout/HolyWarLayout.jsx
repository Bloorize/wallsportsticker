import React from 'react';
import RivalryTicker from '../display/RivalryTicker';
import logo from '/logo.png';
import holyWarLogo from '/holywar.png';

/**
 * Holy War Layout - Floating logo, minimal header
 * Logo floats over grid boundaries with z-50
 */
const HolyWarLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen flex flex-col bg-[#002E5D] overflow-hidden relative">
            {/* Floating Wall Sports Logo - BIG, top left, z-50 */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
                <img 
                    src={logo} 
                    alt="Wall Sports Logo" 
                    className="h-20 md:h-24 lg:h-28 object-contain drop-shadow-2xl"
                />
            </div>

            {/* Floating Holy War Logo - BIG, top right, z-50 */}
            <div className="absolute top-4 right-8 md:top-6 md:right-12 lg:right-16 z-50">
                <img 
                    src={holyWarLogo} 
                    alt="Holy War Logo" 
                    className="h-30 md:h-36 lg:h-42 object-contain drop-shadow-2xl"
                />
            </div>

            {/* Minimal Header Bar */}
            <header className="flex-none h-12 md:h-14 flex items-center justify-end px-4 md:px-6 pl-28 md:pl-32 lg:pl-36
                bg-[#001428]">
                {/* Live indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded">
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
