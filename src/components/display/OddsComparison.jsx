import React, { useState, useEffect } from 'react';
import { getGameOdds, mapCategoryToSport, formatOdds, getBestOdds } from '../../services/odds';

const OddsComparison = ({ game }) => {
    const [oddsData, setOddsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOdds = async () => {
            // Check if API key is configured
            if (!import.meta.env.VITE_ODDS_API_KEY) {
                setLoading(false);
                return;
            }

            if (!game || !game.competitions?.[0]) {
                setLoading(false);
                return;
            }

            const competition = game.competitions[0];
            const competitors = competition.competitors || [];
            
            if (competitors.length < 2) {
                setLoading(false);
                return;
            }

            const team1 = competitors[0].team?.displayName || '';
            const team2 = competitors[1].team?.displayName || '';
            const category = game._category;
            const sport = mapCategoryToSport(category);

            if (!sport) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const gameOdds = await getGameOdds(sport, team1, team2);
                
                if (gameOdds) {
                    const formatted = formatOdds(gameOdds);
                    setOddsData(formatted);
                } else {
                    setOddsData(null);
                }
            } catch (err) {
                console.error('Error fetching odds:', err);
                setError('Unable to load odds');
            } finally {
                setLoading(false);
            }
        };

        fetchOdds();
    }, [game]);

    // Don't render if API key not configured
    if (!import.meta.env.VITE_ODDS_API_KEY) {
        return null;
    }

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !oddsData) {
        return null; // Don't show if no odds available
    }

    const bestOdds = getBestOdds(oddsData);
    const competition = game.competitions[0];
    const competitors = competition.competitors || [];
    const awayTeam = competitors.find(c => c.homeAway === 'away');
    const homeTeam = competitors.find(c => c.homeAway === 'home');

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Best Odds Summary */}
            {bestOdds && (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {/* Spread */}
                    {bestOdds.spread && (
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 md:mb-3">Spread</div>
                            <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums tracking-tighter mb-2 md:mb-3">
                                {bestOdds.spread.point > 0 ? '+' : ''}{bestOdds.spread.point}
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="bg-red-600 px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black text-white uppercase">
                                    {bestOdds.spread.team}
                                </div>
                                <span className="text-[8px] md:text-[9px] text-white/40 uppercase">{bestOdds.spread.bookmaker}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Total */}
                    {bestOdds.total && (
                        <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                            <div className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 md:mb-3">Total</div>
                            <div className="text-2xl md:text-3xl font-mono font-black text-white tabular-nums tracking-tighter">
                                {bestOdds.total.over || bestOdds.total.under}
                            </div>
                            <div className="text-[8px] md:text-[9px] text-white/40 uppercase mt-2">{bestOdds.total.bookmaker}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Multiple Sportsbooks Comparison */}
            {oddsData.spreads.length > 0 && (
                <div className="bg-white/5 border border-white/8 rounded-xl p-4 md:p-5 lg:p-6">
                    <div className="text-[8px] md:text-[9px] font-black text-white/60 uppercase tracking-widest mb-3 md:mb-4">Sportsbook Comparison</div>
                    <div className="space-y-2 md:space-y-3">
                        {oddsData.spreads.slice(0, 3).map((spread, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="text-[9px] md:text-[10px] font-black text-white/80 uppercase">{spread.bookmaker}</span>
                                    <span className="text-[9px] md:text-[10px] font-black text-white/60">{spread.team}</span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="text-sm md:text-base font-mono font-black text-white tabular-nums">
                                        {spread.point > 0 ? '+' : ''}{spread.point}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-black text-white/40">({spread.price > 0 ? '+' : ''}{spread.price})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OddsComparison;
