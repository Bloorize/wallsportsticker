import React from 'react';
import Ticker from '../display/Ticker';
import logo from '/logo.png';

const GlassLayout = ({ children, filter, games, tickerData }) => {
    return (
        <div className="h-screen w-screen relative overflow-hidden bg-black">
            {/* Background Ambience - Always fills entire screen */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--byu-navy)] via-black to-[#001020] animate-pulse-slow" />
            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[var(--byu-royal)] opacity-10 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

            {/* 
                TV SAFE AREA WRAPPER 
                Forcing a strict 25px margin from all edges using absolute positioning.
                This is the most reliable way to ensure the UI stays away from the edges.
            */}
            <div className="absolute inset-[25px] flex flex-col z-10 overflow-hidden bg-black/20 backdrop-blur-md border border-white/5 rounded-[40px] shadow-2xl">

                {/* Internal Content Area */}
                <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                    {/* Top Bar */}
                    <header className="h-[120px] flex items-center justify-between px-16 bg-gradient-to-b from-black/60 to-transparent z-50 flex-none">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="h-24 object-contain drop-shadow-2xl" />
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <section className="flex-grow relative overflow-hidden min-h-0 px-4">
                        <div className="absolute inset-0 overflow-hidden">
                            {children}
                        </div>
                    </section>

                    {/* Ticker anchored at bottom of safe area */}
                    <div className="flex-none p-4">
                        <Ticker filter={filter} games={games} tickerData={tickerData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlassLayout;
