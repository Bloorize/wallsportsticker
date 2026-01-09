import React, { useEffect, useState } from 'react';

const Ticker = ({ filter, games = [], tickerData = { news: [], transactions: [], injuries: [] } }) => {
    const [modeIndex, setModeIndex] = useState(0);
    const [displayItems, setDisplayItems] = useState([]);

    const MODES = [
        { id: 'NEWS', label: 'NEWS WIRE', color: 'bg-slate-800' },
        { id: 'TRANS', label: 'TRANSACTIONS', color: 'bg-red-700' },
        { id: 'INJURY', label: 'INJURY REPORT', color: 'bg-red-800' },
        { id: 'STATS', label: 'TOP PERFORMERS', color: 'bg-slate-900' },
    ];

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
                            indicator: a._category
                        }));
                    break;
                case 'TRANS':
                    items = (tickerData.transactions || [])
                        .filter(t => !sportFilter || t._category === sportFilter)
                        .map((t, idx) => ({
                            id: `trans-${idx}`,
                            title: t.description,
                            detail: t.team?.displayName || 'LEAGUE',
                            indicator: t._category
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
                                    indicator: team._category
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
                                    statsList.push({
                                        id: `stat-${g.id}-${top.athlete?.id}`,
                                        title: `${top.athlete?.displayName}: ${top.displayValue}`,
                                        detail: `${g.competitions[0].competitors.find(c => c.team.id === top.athlete?.team?.id)?.team.abbreviation || ''} | ${leaderCat.displayName}`,
                                        indicator: g._category
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
    }, [modeIndex, filter, tickerData, games]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModeIndex(prev => (prev + 1) % MODES.length);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!displayItems.length) {
            const timer = setTimeout(() => {
                setModeIndex(prev => (prev + 1) % MODES.length);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [displayItems, modeIndex]);

    if (!displayItems.length) return null;

    const activeMode = MODES[modeIndex];

    return (
        <div className="h-[100px] bg-black border-t-4 border-red-700 z-50 flex items-center overflow-hidden w-full relative">
            {/* Mode Label - SOLID Background for ESPN Style */}
            <div className={`${activeMode.color} h-full px-12 flex flex-col justify-center items-center z-20 shadow-[20px_0_40px_rgba(0,0,0,0.9)] relative min-w-[380px]`}>
                <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.4em] mb-1">
                    {(() => {
                        const currentIndicator = displayItems[0]?.indicator;
                        const labelValue = (filter !== 'All' ? filter : (displayItems.every(item => item.indicator === currentIndicator) ? currentIndicator : 'PRO WIRE')) || 'PRO WIRE';
                        if (labelValue === 'NCAAM') return 'NCAA BB';
                        if (labelValue === 'NCAAF') return 'NCAA FB';
                        return labelValue;
                    })()}
                </span>
                <span className="text-3xl font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap italic">{activeMode.label}</span>
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-1 h-full bg-white/20" />
            </div>

            {/* Scrolling Content */}
            <div key={`${filter}-${activeMode.id}`} className="flex animate-scroll whitespace-nowrap items-center h-full min-w-max bg-[#121212]">
                {displayItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex-shrink-0 flex items-center h-full">
                        <div className="flex flex-col justify-center px-8 border-l border-white/5">
                            <div className="flex items-center gap-6 mb-1">
                                <span className="bg-red-700 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-widest">{item.indicator}</span>
                                <span className="font-black text-white text-3xl leading-none uppercase tracking-tight">{item.title}</span>
                            </div>
                            <span className="text-white/30 text-xl font-bold tracking-tight pl-0">{item.detail}</span>
                        </div>
                        {/* High Contrast Separator */}
                        <div className="w-[100px] flex-shrink-0 flex items-center justify-center">
                            <div className="w-1 h-8 bg-white/10" />
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
