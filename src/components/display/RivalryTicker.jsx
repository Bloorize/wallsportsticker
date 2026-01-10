import React, { useState, useEffect } from 'react';
import { getRivalryTickerItems } from '../../config/rivalryData';

/**
 * Rivalry Ticker - Scrolls through all BYU vs Utah rivalry facts
 * TV-optimized for sports bar display
 */
const RivalryTicker = () => {
    const [items] = useState(() => getRivalryTickerItems());
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Rotate through items every 8 seconds
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [items.length]);

    if (!items.length) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="h-16 md:h-20 lg:h-[100px] bg-[#002E5D] border-t-2 border-[#0047BA] z-50 flex items-center overflow-hidden w-full relative">
            {/* Mode Label */}
            <div className="bg-[#0047BA] h-full px-4 md:px-8 lg:px-12 flex flex-col justify-center items-center z-20 shadow-[20px_0_40px_rgba(0,0,0,0.3)] relative min-w-[200px] md:min-w-[300px] lg:min-w-[380px]">
                <span className="text-[8px] md:text-[9px] lg:text-[10px] text-white/80 font-black uppercase tracking-[0.4em] mb-0.5 md:mb-1">
                    RIVALRY
                </span>
                <span className="text-lg md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap italic">HOLY WAR</span>
                <div className="absolute top-0 right-0 w-1 h-full bg-white/40" />
            </div>

            {/* Scrolling Content */}
            <div className="flex-1 flex items-center h-full overflow-hidden bg-white">
                <div className="flex animate-scroll whitespace-nowrap items-center h-full min-w-max px-4 md:px-6 lg:px-8">
                    {/* Duplicate items for seamless loop */}
                    {[...items, ...items].map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 flex items-center h-full">
                            <div className="flex flex-col justify-center px-4 md:px-6 lg:px-8 border-l border-[#0047BA]/20">
                                <span className="font-black text-[#002E5D] text-base md:text-2xl lg:text-3xl leading-none uppercase tracking-tight">
                                    {item}
                                </span>
                            </div>
                            {/* Separator */}
                            <div className="w-[60px] md:w-[80px] lg:w-[100px] flex-shrink-0 flex items-center justify-center">
                                <div className="w-1 h-4 md:h-6 lg:h-8 bg-[#0047BA]/20" />
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
                    animation: scroll ${Math.max(60, items.length * 8)}s linear infinite; 
                }
            `}</style>
        </div>
    );
};

export default RivalryTicker;
