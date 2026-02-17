import React, { useState, useEffect } from 'react';
import { getSunTimes, getMoonTimes, calculateVedicData } from '../utils/astronomy';

interface DashboardProps {
  date: Date;
}

const PanchangDashboard: React.FC<DashboardProps> = ({ date }) => {
  const [data, setData] = useState<any>(null);
  const [location, setLocation] = useState("Mumbai, IN");

  // Effect to update data
  useEffect(() => {
    const vedic = calculateVedicData(date);
    
    // Mumbai Coordinates
    const LAT = 19.0760;
    const LNG = 72.8777;
    
    const sun = getSunTimes(date, LAT, LNG);
    const moon = getMoonTimes(date, vedic.tithi.index);

    setData({ vedic, sun, moon });
  }, [date]);

  if (!data) return null;

  const { vedic, sun, moon } = data;

  // Format Helpers
  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour12: false });
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' });

  return (
    <div className="w-full max-w-[1000px] mt-8 p-4 bg-[#0f172a] rounded-xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        {/* Top Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent opacity-50"></div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Zone A: Time & Location */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-[#d4af37]/40 rounded-lg p-4 flex flex-col justify-between">
                <div>
                    <h3 className="text-[#fbbf24] font-serif text-sm tracking-widest uppercase mb-1">Local Time</h3>
                    <div className="text-3xl md:text-4xl font-mono text-white font-bold tracking-tighter">
                        {formatTime(date)}
                    </div>
                    <div className="text-gray-400 font-mono text-xs mt-1">{formatDate(date)}</div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="text-gray-300 font-mono text-xs uppercase tracking-wide">{location}</span>
                </div>
            </div>

            {/* Zone B: Sun Cycle */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-[#d4af37]/40 rounded-lg p-4 relative overflow-hidden group">
                <h3 className="text-[#fbbf24] font-serif text-sm tracking-widest uppercase mb-2 flex items-center">
                    <span className="mr-2 text-lg">☀</span> Sun Cycle
                </h3>
                <div className="flex justify-between items-end mt-2">
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase">Sunrise</div>
                        <div className="text-xl font-mono text-white">{sun.sunrise}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase text-right">Sunset</div>
                        <div className="text-xl font-mono text-white text-right">{sun.sunset}</div>
                    </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-1 bg-gray-700 mt-3 rounded-full overflow-hidden">
                    <div className="h-full bg-[#fbbf24] w-2/3 shadow-[0_0_10px_#fbbf24]"></div>
                </div>
                <div className="text-[10px] text-center text-gray-500 mt-1 font-mono">Day Length: {Math.floor(sun.dayDuration / 60)}h {Math.floor(sun.dayDuration % 60)}m</div>
            </div>

            {/* Zone C: Moon Cycle */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-[#d4af37]/40 rounded-lg p-4">
                 <h3 className="text-[#fbbf24] font-serif text-sm tracking-widest uppercase mb-2 flex items-center">
                    <span className="mr-2 text-lg">☾</span> Moon Cycle
                </h3>
                 <div className="flex justify-between items-end mt-2">
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase">Moonrise</div>
                        <div className="text-xl font-mono text-white">{moon.moonrise}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase text-right">Moonset</div>
                        <div className="text-xl font-mono text-white text-right">{moon.moonset}</div>
                    </div>
                </div>
                <div className="mt-3 py-1 px-2 bg-slate-900/80 rounded border border-white/10 text-center flex flex-col items-center">
                    <span className="text-[#e2e8f0] font-serif text-xs font-bold uppercase">{vedic.tithi.name}</span>
                    <span className="text-gray-500 text-[10px]">{vedic.tithi.paksha} Paksha</span>
                </div>
            </div>

            {/* Zone D: Panchang Details */}
            <div className="bg-slate-800/60 backdrop-blur-md border border-[#d4af37]/40 rounded-lg p-4 flex flex-col justify-center">
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                     <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Nakshatra</span>
                         <span className="text-white font-serif text-xs font-bold truncate" title={vedic.nakshatra.name}>
                             {vedic.nakshatra.name}
                         </span>
                         <span className="text-[9px] text-[#fbbf24] font-mono">{vedic.nakshatra.percent}%</span>
                     </div>
                     <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Rashi</span>
                         <span className="text-white font-serif text-xs font-bold flex items-center">
                             <span className="mr-1">{vedic.rashi.symbol}</span> {vedic.rashi.name}
                         </span>
                     </div>
                     <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Yoga</span>
                         <span className="text-gray-200 font-mono text-xs truncate">{vedic.yoga}</span>
                     </div>
                     <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Karana</span>
                         <span className="text-gray-200 font-mono text-xs truncate">{vedic.karana}</span>
                     </div>
                 </div>
            </div>

        </div>
    </div>
  );
};

export default PanchangDashboard;
