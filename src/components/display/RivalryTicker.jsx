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
            <div className="h-full px-8 md:px-10 lg:px-12 flex flex-col justify-center items-center 
                bg-[#0047BA]/40 backdrop-blur-xl border-r border-white/[0.1]
                min-w-[180px] md:min-w-[220px] lg:min-w-[260px] relative z-20">
                <span className="text-[9px] md:text-[10px] lg:text-xs text-white/60 font-semibold uppercase tracking-[0.4em]">
                    RIVALRY
                </span>
                <span className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-none mt-1">
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
                        <div key={idx} className="flex-shrink-0 flex items-center h-full px-8 md:px-10 lg:px-12">
                            <div className="flex items-center gap-5">
                                {/* Decorative dot */}
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0047BA] shadow-[0_0_10px_rgba(0,71,186,0.8)]" />
                                <span className="font-semibold text-white/90 text-sm md:text-lg lg:text-xl tracking-wide">
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
