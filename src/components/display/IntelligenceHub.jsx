import React from 'react';

const FieldVisualization = ({ game }) => {
    const category = game._category;
    const situation = game.competitions?.[0]?.situation;
    if (!situation && category !== 'SOCCER') return null;

    // Football Field (NFL/NCAAF)
    if (category === 'NFL' || category === 'NCAAF') {
        const yardLine = situation.yardLine || 50;
        const down = situation.down || 1;
        const distance = situation.distance || 10;

        return (
            <div className="w-full space-y-4">
                <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Field View</span>
                        <span className="text-xl font-black text-white uppercase tracking-tighter">
                            {situation.possessionText || 'Midfield'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 bg-red-600 px-4 py-2">
                        <span className="text-lg font-mono font-black text-white">{down} & {distance}</span>
                    </div>
                </div>
                <div className="h-28 bg-[#1a3a2a] relative overflow-hidden border border-white/10 shadow-inner">
                    {/* Yard Lines */}
                    <div className="absolute inset-x-4 inset-y-0 flex justify-between opacity-30">
                        {[...Array(11)].map((_, i) => (
                            <div key={i} className="w-px h-full bg-white relative">
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/60 font-mono">
                                    {(Math.abs(5 - i) * 10) || '50'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Ball Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-1.5 bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.8)] transition-all duration-1000 z-20 flex flex-col items-center justify-center translate-x-4"
                        style={{ left: `${yardLine}%` }}
                    >
                        <div className="w-4 h-4 bg-red-500 rotate-45" />
                    </div>
                    {/* Endzones */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/60 flex items-center justify-center border-r border-white/10">
                        <div className="rotate-90 text-[10px] font-black text-white/40 tracking-widest">VISITOR</div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-red-700/40 flex items-center justify-center border-l border-white/10">
                        <div className="-rotate-90 text-[10px] font-black text-white/40 tracking-widest uppercase text-white/80">HOME</div>
                    </div>
                </div>
            </div>
        );
    }

    // Basketball Court (NBA/NCAAM)
    if (category === 'NBA' || category === 'NCAAM') {
        return (
            <div className="w-full space-y-4">
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Active Court Tracking</span>
                    <div className="flex items-center gap-2 bg-red-600 px-3 py-1">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] font-black text-white uppercase">Live Play</span>
                    </div>
                </div>
                <div className="h-40 bg-[#3d2b1d] relative border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 flex justify-center items-center opacity-20">
                        <div className="w-20 h-20 border-2 border-white rounded-full" />
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-red-600 rounded-full shadow-[0_0_40px_rgba(255,0,0,0.6)] animate-bounce ring-4 ring-black/40">
                        <div className="text-[10px] font-black text-white">BALL</div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const IntelligenceHub = ({ game }) => {
    if (!game) return (
        <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-red-600 rounded-full animate-spin" />
            <span className="text-sm font-black uppercase tracking-[0.4em]">Optimizing Intel</span>
        </div>
    );

    const competition = game.competitions[0];
    const odds = competition.odds?.[0];
    const situation = competition.situation;

    return (
        <div className="flex-grow flex flex-col overflow-y-auto no-scrollbar bg-[#1a1b1c]">
            {/* Header with High-End Broadcast Look */}
            <div className="flex-none p-10 bg-black border-b-4 border-red-600 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black text-white uppercase tracking-[0.5em]">Game Intelligence</span>
                    <div className="px-4 py-2 bg-white text-black text-[11px] font-black uppercase tracking-tighter italic">
                        ESPN ANALYTICS
                    </div>
                </div>
                <div className="text-[12px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="text-white opacity-60">Status:</span>
                    <span className="text-white">{game.status.type.detail}</span>
                    <span className="mx-2 text-white/20">|</span>
                    <span className="text-white/40">{competition.venue?.fullName}</span>
                </div>
            </div>

            <div className="flex-grow p-10 space-y-16">
                {/* 1. BETTING & ANALYTICS MODULE */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-l-8 border-red-600 pl-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Market Dynamics</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                        <div className="bg-black/40 p-10 group transition-none">
                            <span className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-6 block">Spread Line</span>
                            <div className="text-5xl font-mono font-black text-white tabular-nums tracking-tighter">
                                {odds?.details || 'EVEN'}
                            </div>
                        </div>
                        <div className="bg-black/40 p-10 group transition-none border-l border-white/10">
                            <span className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-6 block">Over / Under</span>
                            <div className="text-5xl font-mono font-black text-white tabular-nums tracking-tighter">
                                {odds?.overUnder || '--'}
                            </div>
                        </div>
                    </div>

                    {situation?.lastPlay?.probability && (
                        <div className="bg-black p-10 border border-white/5 relative overflow-hidden">
                            <div className="flex justify-between items-end mb-8 relative z-10">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{competition.competitors.find(c => c.homeAway === 'away').team.abbreviation}</span>
                                    <span className="text-4xl font-mono font-black text-white">{(situation.lastPlay.probability.awayWinPercentage * 100).toFixed(0)}%</span>
                                </div>
                                <div className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-2 px-4 py-1 bg-white/5">Win Probability</div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{competition.competitors.find(c => c.homeAway === 'home').team.abbreviation}</span>
                                    <span className="text-4xl font-mono font-black text-red-600">{(situation.lastPlay.probability.homeWinPercentage * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div className="h-2 bg-white/5 flex">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${situation.lastPlay.probability.awayWinPercentage * 100}%` }}
                                />
                                <div
                                    className="h-full bg-red-600 transition-all duration-1000"
                                    style={{ width: `${situation.lastPlay.probability.homeWinPercentage * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. FIELD / COURT VISUALIZATION */}
                <section className="space-y-8">
                    <FieldVisualization game={game} />
                </section>

                {/* 3. PERFORMANCE LEADERS MODULE */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-l-8 border-white pl-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Game Leaders</h3>
                    </div>

                    <div className="space-y-4">
                        {competition.leaders?.slice(0, 3).map((cat, i) => (
                            <div key={i} className="bg-black/40 border border-white/10 group overflow-hidden">
                                <div className="flex items-center p-6 gap-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-black overflow-hidden border-2 border-white/10 group-transition-none">
                                            <img src={cat.leaders?.[0]?.athlete?.headshot} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase shadow-2xl">
                                            {cat.leaders?.[0]?.team?.abbreviation || '---'}
                                        </div>
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center gap-1">
                                        <div className="text-[11px] font-black text-red-500 uppercase tracking-widest">
                                            {cat.displayName}
                                        </div>
                                        <div className="text-xl font-black text-white uppercase tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                                            {cat.leaders?.[0]?.athlete?.displayName}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 border-l border-white/5 pl-8">
                                        <div className="text-4xl font-mono font-black text-white tabular-nums">
                                            {cat.leaders?.[0]?.displayValue}
                                        </div>
                                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Stat Value</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. LIVE FIELD REPORT */}
                <section className="space-y-8">
                    <div className="flex items-center border-l-8 border-red-600 pl-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Live Feed</h3>
                    </div>

                    <div className="bg-black p-10 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
                        <p className="text-lg font-black text-white leading-relaxed italic tracking-tight opacity-90">
                            "{situation?.lastPlay?.text || "Synchronizing live stadium data feed..."}"
                        </p>
                    </div>
                </section>
            </div>

            {/* Premium Intelligence Footer */}
            <div className="flex-none p-8 bg-black border-t border-white/5">
                <div className="flex justify-between items-center opacity-40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-600 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal Active</span>
                        </div>
                        <span className="text-[10px] font-mono text-white uppercase">FPS: 60.0</span>
                    </div>
                    <div className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">ESPN COMPANION v3.0</div>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceHub;
