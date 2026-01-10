import React, { useState, useEffect } from 'react';
import { getRivalryTickerItems } from '../../config/rivalryData';

/**
 * Rivalry Ticker - ESPN style
 * Clean, minimal bottom ticker
 */
const RivalryTicker = () => {
    const [items] = useState(() => getRivalryTickerItems());

    if (!items.length) return null;

    return (
        <div className="h-20 md:h-24 bg-[#001a3d] border-t border-white/10 overflow-hidden relative flex items-center">
            {/* Category Badge */}
            <div className="h-full px-6 md:px-8 flex items-center justify-center 
                bg-white/10 border-r border-white/10
                min-w-[160px] md:min-w-[200px]">
                <span className="text-lg md:text-xl font-bold text-white uppercase tracking-wide">
                    RIVALRY
                </span>
            </div>

            {/* Scrolling Content */}
            <div className="flex-1 flex items-center h-full overflow-hidden relative">
                <div className="flex animate-scroll whitespace-nowrap items-center h-full">
                    {[...items, ...items].map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 flex items-center h-full px-8 md:px-10">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-white/40" />
                                <span className="font-semibold text-white text-base md:text-lg">
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
                    animation: scroll ${Math.max(60, items.length * 8)}s linear infinite; 
                }
            `}</style>
        </div>
    );
};

export default RivalryTicker;
