import React from 'react';
import { RASHIS, NAKSHATRAS, TITHIS } from '../constants';

interface DigitalPanelProps {
  date: Date;
  tithi: { paksha: string; tithiIndex: number; tithiNumber: number };
  nakshatraIndex: number;
  rashiIndex: number;
}

const DigitalPanel: React.FC<DigitalPanelProps> = ({ date, tithi, nakshatraIndex, rashiIndex }) => {
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Safe access
  const safeNakshatra = NAKSHATRAS[Math.floor(nakshatraIndex) % NAKSHATRAS.length] || "Unknown";
  const safeRashi = RASHIS[Math.floor(rashiIndex) % RASHIS.length]?.name || "Unknown";
  const safeTithi = TITHIS[tithi.tithiIndex] || "Unknown";

  return (
    <div className="w-full max-w-[600px] mt-4 flex flex-col md:flex-row gap-2 text-xs md:text-sm font-sans">
      
      {/* Branding Left (Optional, maybe merged) */}
      <div className="hidden md:flex flex-col justify-center items-start text-gray-400 w-1/4 p-2">
        <h2 className="text-xl font-bold text-red-500 font-serif">Shri Astrotime</h2>
        <p>Panchanga Clock</p>
        <p className="text-[10px]">Model: Galaxy-1</p>
      </div>

      {/* Digital Display Center */}
      <div className="flex-1 bg-slate-900 border-2 border-slate-600 rounded p-2 shadow-inner">
        <div className="flex justify-between items-baseline border-b border-slate-700 pb-1 mb-1">
          <span className="text-2xl font-bold text-blue-300 font-mono">{formatTime(date)}</span>
          <span className="text-lg text-blue-200">{formatDate(date)}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-blue-100">
            <div className="text-gray-400">Location</div>
            <div className="text-right">Bengaluru</div> {/* Static for demo */}
            
            <div className="text-gray-400">Tithi</div>
            <div className="text-right truncate">{safeTithi} ({tithi.paksha})</div>
            
            <div className="text-gray-400">Nakshatra</div>
            <div className="text-right truncate">{safeNakshatra}</div>
            
            <div className="text-gray-400">Rashi</div>
            <div className="text-right truncate">{safeRashi}</div>
            
            <div className="text-gray-400">Yoga/Karana</div>
            <div className="text-right text-[10px]">Simulated Data</div>
        </div>
      </div>

      {/* Legend Right */}
      <div className="w-full md:w-1/3 bg-slate-900 border border-slate-600 p-2 text-[10px] md:text-[11px] leading-tight text-gray-300 rounded">
        <div className="grid grid-cols-[1fr_2fr] gap-1 border-b border-slate-700 pb-1 mb-1">
          <span className="font-bold text-white">HAND</span>
          <span className="font-bold text-white text-right">INDICATES</span>
        </div>
        
        <div className="grid grid-cols-[1fr_2fr] gap-1 py-1 border-b border-slate-800">
            <span className="font-bold">CHANDRA</span>
            <div className="flex flex-col text-right">
                <span>NAKSHATRA</span>
                <span>RASHI</span>
                <span>TITHI</span>
            </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 py-1 border-b border-slate-800">
            <span className="font-bold">SURYA</span>
            <div className="flex flex-col text-right">
                <span>MASA</span>
                <span>RASHI</span>
                <span>SANKRAMANA</span>
            </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 py-1">
            <span className="font-bold">SKY</span>
            <div className="flex flex-col text-right">
                <span>LAGNA</span>
                <span>SURYODAYA</span>
                <span>CHANDRODAYA</span>
            </div>
        </div>
      </div>

    </div>
  );
};

export default DigitalPanel;
