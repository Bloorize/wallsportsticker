import React, { useState, useEffect } from 'react';
import { getRivalryTickerItems } from '../../config/rivalryData';

/**
 * Rivalry Ticker - Solid BYU Colors
 * Scrolls through all BYU vs Utah rivalry facts
 * NO GRADIENTS - Solid colors only
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
            bg-[#002E5D] border-2 border-white rounded-2xl
            shadow-lg overflow-hidden relative flex items-center">
            
            {/* Category Badge - Royal Blue background */}
            <div className="h-full px-10 md:px-12 lg:px-14 flex flex-col justify-center items-center 
                bg-[#0047BA] border-r-2 border-white
                min-w-[200px] md:min-w-[240px] lg:min-w-[280px] relative z-20">
                <span className="text-[9px] md:text-[10px] lg:text-xs text-white font-semibold uppercase tracking-[0.4em]">
                    RIVALRY
                </span>
                <span className="text-lg md:text-xl lg:text-2xl font-black text-white uppercase tracking-tight leading-none mt-1">
                    HOLY WAR
                </span>
            </div>

            {/* Scrolling Content Area - Navy background */}
            <div className="flex-1 flex items-center h-full overflow-hidden relative bg-[#002E5D]">
                <div className="flex animate-scroll whitespace-nowrap items-center h-full min-w-max">
                    {[...items, ...items].map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 flex items-center h-full px-10 md:px-12 lg:px-14">
                            <div className="flex items-center gap-6">
                                {/* Decorative dot - White */}
                                <div className="w-2 h-2 rounded-full bg-white" />
                                <span className="font-semibold text-white text-sm md:text-lg lg:text-xl tracking-wide">
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
                .animate-scroll { 
                    animation: scroll ${Math.max(80, items.length * 10)}s linear infinite; 
                }
            `}</style>
        </div>
    );
};

export default RivalryTicker;
