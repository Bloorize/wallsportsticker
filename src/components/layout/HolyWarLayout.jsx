import React from 'react';
import Ticker from '../display/Ticker';
import logo from '/logo.png';

/**
 * Holy War Layout - BYU Brand Colors
 * Navy: #002E5D, Royal: #0047BA, White: #FFFFFF
 */
const HolyWarLayout = ({ children, filter, games, tickerData }) => {
    return (
        <div className="h-screen w-screen relative overflow-hidden" style={{ backgroundColor: '#002E5D' }}>
            {/* BYU Navy Background with Royal accents */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#002E5D] via-[#001a3d] to-[#000d1f]" />
            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#0047BA] opacity-15 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
            
            {/* BYU Royal accent lines */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0047BA]" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0047BA]" />

            {/* TV SAFE AREA WRAPPER */}
            <div className="absolute inset-2 md:inset-4 lg:inset-[25px] flex flex-col z-10 overflow-hidden bg-[#002E5D]/80 backdrop-blur-md border-2 border-[#0047BA]/30 rounded-lg md:rounded-2xl lg:rounded-[40px] shadow-2xl">
                {/* Internal Content Area */}
                <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                    {/* Top Bar - BYU Styled */}
                    <header className="h-16 md:h-20 lg:h-[120px] flex items-center justify-between px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#001a3d] to-transparent z-50 flex-none border-b-2 border-[#0047BA]/20">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img src={logo} alt="BYU Logo" className="h-12 md:h-16 lg:h-24 object-contain drop-shadow-2xl" />
                            <div className="flex flex-col">
                                <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'serif' }}>
                                    THE HOLY WAR
                                </h1>
                                <p className="text-[8px] md:text-[10px] lg:text-xs font-bold text-[#0047BA] uppercase tracking-widest">
                                    BYU vs UTAH
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#0047BA]/20 border border-[#0047BA]/40 rounded">
                            <div className="w-2 h-2 bg-[#0047BA] rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE</span>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <section className="flex-grow relative overflow-hidden min-h-0 px-2 md:px-3 lg:px-4">
                        <div className="absolute inset-0 overflow-hidden">
                            {children}
                        </div>
                    </section>

                    {/* Ticker anchored at bottom - BYU styled */}
                    <div className="flex-none p-2 md:p-3 lg:p-4 border-t-2 border-[#0047BA]/20">
                        <Ticker filter={filter} games={games} tickerData={tickerData} isHolyWar={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolyWarLayout;
