import React from 'react';
import RivalryTicker from '../display/RivalryTicker';
import logo from '/logo.png';

/**
 * Holy War Layout - Modern Apple Glassmorphism
 * BYU Brand Colors: Navy #002E5D, Royal #0047BA, White #FFFFFF
 * NO RED COLORS
 */
const HolyWarLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen relative overflow-hidden">
            {/* Solid background - BYU themed */}
            <div className="absolute inset-0 bg-[#002E5D]" />
            
            {/* Animated orbs for depth - subtle BYU blue tones */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0047BA]/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-30%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#0047BA]/15 blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
            
            {/* Noise texture overlay for depth */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }} />

            {/* Main content container with safe area */}
            <div className="absolute inset-3 md:inset-4 lg:inset-6 flex flex-col z-10 overflow-hidden gap-4 md:gap-5 lg:gap-6">
                {/* Glass Header */}
                <header className="h-20 md:h-24 lg:h-28 flex items-center justify-between px-10 md:px-14 lg:px-20 
                    bg-white/[0.08] backdrop-blur-2xl rounded-2xl shadow-2xl
                    relative overflow-hidden flex-none">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-white/[0.05] rounded-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-6 md:gap-8 relative z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                            <img src={logo} alt="BYU Logo" className="h-12 md:h-16 lg:h-20 object-contain relative z-10 drop-shadow-2xl" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white uppercase leading-none"
                                style={{ 
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textShadow: '0 2px 20px rgba(0,71,186,0.5)'
                                }}>
                                THE HOLY WAR
                            </h1>
                            <p className="text-[#0047BA] uppercase mt-1"
                                style={{ 
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                }}>
                                BYU vs UTAH
                            </p>
                        </div>
                    </div>

                    {/* Live indicator with glow */}
                    <div className="hidden md:flex items-center gap-3 px-6 py-3
                        bg-[#0047BA]/30 backdrop-blur-xl rounded-full
                        shadow-[0_0_30px_rgba(0,71,186,0.4)] relative z-10">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping absolute" />
                            <div className="w-2.5 h-2.5 bg-white rounded-full relative" />
                        </div>
                        <span className="text-white uppercase"
                            style={{ 
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '12px',
                                fontWeight: 600,
                                letterSpacing: '0.05em'
                            }}>
                            LIVE
                        </span>
                    </div>
                </header>

                {/* Dashboard Content - Glass container */}
                <section className="flex-grow relative overflow-hidden min-h-0 
                    bg-white/[0.05] backdrop-blur-xl rounded-2xl
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {children}
                    </div>
                </section>

                {/* Rivalry Ticker */}
                <div className="flex-none">
                    <RivalryTicker />
                </div>
            </div>
        </div>
    );
};

export default HolyWarLayout;
