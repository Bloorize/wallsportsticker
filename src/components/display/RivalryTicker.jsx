import React, { useState, useEffect } from 'react';
import { getRivalryTickerItems } from '../../config/rivalryData';

/**
 * Rivalry Ticker - Modern Glassmorphism Design
 * Scrolls through all BYU vs Utah rivalry facts
 */
const RivalryTicker = () => {
    const [items] = useState(() => getRivalryTickerItems());
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [items.length]);

    if (!items.length) return null;

    return (
        <div className="h-16 md:h-20 lg:h-24 
            bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] rounded-2xl
            shadow-2xl overflow-hidden relative flex items-center">
            
            {/* Animated gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent 
                animate-shimmer pointer-events-none" style={{ backgroundSize: '200% 100%' }} />
            
            {/* Category Badge */}
            <div className="h-full px-10 md:px-12 lg:px-14 flex flex-col justify-center items-center 
                bg-[#0047BA]/40 backdrop-blur-xl border-r border-white/[0.1]
                min-w-[200px] md:min-w-[240px] lg:min-w-[280px] relative z-20">
                <span className="text-white/60 uppercase"
                    style={{ 
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '0.12em'
                    }}>
                    RIVALRY
                </span>
                <span className="text-white uppercase leading-none mt-1"
                    style={{ 
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '0.12em'
                    }}>
                    HOLY WAR
                </span>
            </div>

            {/* Scrolling Content Area */}
            <div className="flex-1 flex items-center h-full overflow-hidden relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#002E5D]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#002E5D]/80 to-transparent z-10 pointer-events-none" />
                
                <div className="flex animate-scroll whitespace-nowrap items-center h-full min-w-max">
                    {[...items, ...items].map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 flex items-center h-full px-10 md:px-12 lg:px-14">
                            <div className="flex items-center gap-6">
                                {/* Decorative dot */}
                                <div className="w-2 h-2 rounded-full bg-[#0047BA] shadow-[0_0_10px_rgba(0,71,186,0.8)]" />
                                <span className="text-white/90"
                                    style={{ 
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        fontSize: '22px',
                                        fontWeight: 400
                                    }}>
                                    {item}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes scroll { 
                    0% { transform: translateX(0); } 
                    100% { transform: translateX(-50%); } 
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-scroll { 
                    animation: scroll ${Math.max(80, items.length * 10)}s linear infinite; 
                }
                .animate-shimmer {
                    animation: shimmer 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default RivalryTicker;
