import React, { useEffect, useState } from 'react';
import { getLeagueLogo } from '../../utils/timeUtils';

const Ticker = ({ filter, games = [], tickerData = { news: [], transactions: [], injuries: [] }, isHolyWar = false }) => {
    const [modeIndex, setModeIndex] = useState(0);
    const [displayItems, setDisplayItems] = useState([]);

    // MODES must be defined inside component to access isHolyWar prop
    const MODES = React.useMemo(() => [
        { id: 'NEWS', label: 'NEWS WIRE', color: isHolyWar ? 'bg-[#002E5D]' : 'bg-slate-800' },
        { id: 'TRANS', label: 'TRANSACTIONS', color: isHolyWar ? 'bg-[#003a9e]' : 'bg-red-700' },
        { id: 'INJURY', label: 'INJURY REPORT', color: isHolyWar ? 'bg-[#002E5D]' : 'bg-red-800' },
        { id: 'STATS', label: 'TOP PERFORMERS', color: isHolyWar ? 'bg-[#002E5D]' : 'bg-slate-900' },
    ], [isHolyWar]);

    useEffect(() => {
        const updateDisplay = () => {
            const currentMode = MODES[modeIndex].id;
            let items = [];
            const sportFilter = filter === 'All' ? null : filter;

            switch (currentMode) {
                case 'NEWS':
                    items = (tickerData.news || [])
                        .filter(a => !sportFilter || a._category === sportFilter)
                        .map(a => ({
                            id: a.id,
                            title: a.headline,
                            detail: a.description || '',
                            indicator: a._category,
                            logo: getLeagueLogo(a._category), // Fallback to league logo for news
                            teamLogo: null
                        }));
                    break;
                case 'TRANS':
                    items = (tickerData.transactions || [])
                        .filter(t => !sportFilter || t._category === sportFilter)
                        .map((t, idx) => ({
                            id: `trans-${idx}`,
                            title: t.description,
                            detail: t.team?.displayName || 'LEAGUE',
                            indicator: t._category,
                            logo: getLeagueLogo(t._category) // Always use league logo
                        }));
                    break;
                case 'INJURY':
                    const injuryList = [];
                    (tickerData.injuries || [])
                        .filter(team => !sportFilter || team._category === sportFilter)
                        .forEach(team => {
                            (team.injuries || []).forEach(inj => {
                                injuryList.push({
                                    id: inj.id,
                                    title: `${inj.athlete?.displayName || 'PLAYER'}: ${inj.status || 'OUT'}`,
                                    detail: `${team.displayName} - ${inj.shortComment || ''}`,
                                    indicator: team._category,
                                    logo: getLeagueLogo(team._category) // Always use league logo
                                });
                            });
                        });
                    items = injuryList;
                    break;
                case 'STATS':
                    const statsList = [];
                    games
                        .filter(g => !sportFilter || g._category === sportFilter)
                        .forEach(g => {
                            const leaders = g.competitions[0].leaders || [];
                            leaders.forEach(leaderCat => {
                                const top = leaderCat.leaders?.[0];
                                if (top) {
                                    const team = g.competitions[0].competitors.find(c => c.team.id === top.athlete?.team?.id)?.team;
                                    statsList.push({
                                        id: `stat-${g.id}-${top.athlete?.id}`,
                                        title: `${top.athlete?.displayName}: ${top.displayValue}`,
                                        detail: `${team?.abbreviation || ''} | ${leaderCat.displayName}`,
                                        indicator: g._category,
                                        logo: getLeagueLogo(g._category) // Always use league logo
                                    });
                                }
                            });
                        });
                    items = statsList;
                    break;
            }
            setDisplayItems(items.slice(0, 20));
        };
        updateDisplay();
    }, [modeIndex, filter, tickerData, games, MODES]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModeIndex(prev => (prev + 1) % MODES.length);
        }, 30000);
        return () => clearInterval(interval);
    }, [MODES.length]);

    useEffect(() => {
        if (!displayItems.length) {
            const timer = setTimeout(() => {
                setModeIndex(prev => (prev + 1) % MODES.length);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [displayItems, modeIndex, MODES.length]);

    if (!displayItems.length) return null;

    const activeMode = MODES[modeIndex];

    return (
        <div className={`h-16 md:h-20 lg:h-[100px] ${isHolyWar ? 'bg-white border-t-4 border-[#0047BA]' : 'bg-black border-t-4 border-red-700'} z-50 flex items-center overflow-hidden w-full relative`}>
            {/* Mode Label - SOLID Background for ESPN Style */}
            <div className={`${activeMode.color} h-full px-4 md:px-8 lg:px-12 flex flex-col justify-center items-center z-20 shadow-[20px_0_40px_rgba(0,0,0,0.9)] relative min-w-[200px] md:min-w-[300px] lg:min-w-[380px]`}>
                <span className="text-[8px] md:text-[9px] lg:text-[10px] text-white/60 font-black uppercase tracking-[0.4em] mb-0.5 md:mb-1">
                    {(() => {
                        const currentIndicator = displayItems[0]?.indicator;
                        const labelValue = (filter !== 'All' ? filter : (displayItems.every(item => item.indicator === currentIndicator) ? currentIndicator : 'PRO WIRE')) || 'PRO WIRE';
                        if (labelValue === 'NCAAM') return 'NCAA BB';
                        if (labelValue === 'NCAAF') return 'NCAA FB';
                        return labelValue;
                    })()}
                </span>
                <span className="text-lg md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap italic">{activeMode.label}</span>
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-1 h-full ${isHolyWar ? 'bg-white/40' : 'bg-white/20'}`} />
            </div>

            {/* Scrolling Content */}
            <div key={`${filter}-${activeMode.id}`} className={`flex animate-scroll whitespace-nowrap items-center h-full min-w-max ${isHolyWar ? 'bg-white' : 'bg-[#121212]'}`}>
                {displayItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex-shrink-0 flex items-center h-full">
                        <div className={`flex flex-col justify-center px-4 md:px-6 lg:px-8 ${isHolyWar ? 'border-l border-[#0047BA]/20' : 'border-l border-white/5'}`}>
                            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 mb-0.5 md:mb-1">
                                {item.logo ? (
                                    <img 
                                        src={item.logo} 
                                        alt={item.indicator}
                                        className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 object-contain rounded-full ${isHolyWar ? 'bg-[#0047BA]/10' : 'bg-white/10'} p-0.5`}
                                        onError={(e) => {
                                            // Hide image and show text badge if logo fails to load
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : null}
                                {!item.logo && (
                                    <span className={`${isHolyWar ? 'bg-[#0047BA]' : 'bg-red-700'} px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] lg:text-[10px] font-black text-white uppercase tracking-widest`}>
                                        {item.indicator === 'NCAAM' ? 'NCAA BB' : item.indicator === 'NCAAF' ? 'NCAA FB' : item.indicator}
                                    </span>
                                )}
                                <span className={`font-black ${isHolyWar ? 'text-[#002E5D]' : 'text-white'} text-base md:text-2xl lg:text-3xl leading-none uppercase tracking-tight`}>{item.title}</span>
                            </div>
                            <span className={`${isHolyWar ? 'text-[#002E5D]/60' : 'text-white/30'} text-xs md:text-base lg:text-xl font-bold tracking-tight pl-0`}>{item.detail}</span>
                        </div>
                        {/* High Contrast Separator */}
                        <div className="w-[60px] md:w-[80px] lg:w-[100px] flex-shrink-0 flex items-center justify-center">
                            <div className={`w-1 h-4 md:h-6 lg:h-8 ${isHolyWar ? 'bg-[#0047BA]/20' : 'bg-white/10'}`} />
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-scroll { animation: scroll ${Math.max(40, displayItems.length * 10)}s linear infinite; }
            `}</style>
        </div>
    );
};

export default Ticker;
