import React, { useState } from 'react';

interface PanchangWidgetProps {
  tithiName: string;
  paksha: string;
  nakshatraName: string;
  sunrise: string;
  sunset: string;
}

const PanchangWidget: React.FC<PanchangWidgetProps> = ({ tithiName, paksha, nakshatraName, sunrise, sunset }) => {
  const [showSunrise, setShowSunrise] = useState(true);
  const [showTithi, setShowTithi] = useState(true);
  const [showNakshatra, setShowNakshatra] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Widget simulates a glassmorphism card typical of mobile home screens
  return (
    <div className="w-full max-w-[350px] md:max-w-[400px] mt-6 p-1">
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl transition-all duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-black/20 border-b border-white/5">
                <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">Daily Brief</span>
                <button 
                    onClick={() => setIsConfiguring(!isConfiguring)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>

            {/* Content View */}
            {!isConfiguring ? (
                <div className="p-4 grid grid-cols-2 gap-4">
                    {showTithi && (
                        <div className="col-span-2 flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/20">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">🌙</div>
                            <div>
                                <div className="text-[10px] text-blue-200 uppercase tracking-wider">Current Tithi</div>
                                <div className="text-lg font-bold text-white leading-tight">{tithiName}</div>
                                <div className="text-xs text-blue-300">{paksha} Paksha</div>
                            </div>
                        </div>
                    )}

                    {showNakshatra && (
                        <div className="col-span-1 p-3 rounded-xl bg-purple-900/30 border border-purple-500/20">
                            <div className="text-[10px] text-purple-200 uppercase mb-1">Nakshatra</div>
                            <div className="text-sm font-semibold text-white">{nakshatraName}</div>
                        </div>
                    )}
                    
                    {showSunrise && (
                        <div className="col-span-1 p-3 rounded-xl bg-orange-900/30 border border-orange-500/20">
                             <div className="text-[10px] text-orange-200 uppercase mb-1">Sun Cycle</div>
                             <div className="text-xs text-white flex justify-between">
                                 <span>↑ {sunrise}</span>
                                 <span>↓ {sunset}</span>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Configuration View */
                <div className="p-4 space-y-2">
                    <p className="text-xs text-gray-400 mb-3 uppercase font-bold">Customize Widget</p>
                    
                    <label className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                        <span className="text-sm text-gray-200">Show Tithi</span>
                        <input type="checkbox" checked={showTithi} onChange={e => setShowTithi(e.target.checked)} className="accent-blue-500" />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                        <span className="text-sm text-gray-200">Show Nakshatra</span>
                        <input type="checkbox" checked={showNakshatra} onChange={e => setShowNakshatra(e.target.checked)} className="accent-purple-500" />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                        <span className="text-sm text-gray-200">Show Sun Times</span>
                        <input type="checkbox" checked={showSunrise} onChange={e => setShowSunrise(e.target.checked)} className="accent-orange-500" />
                    </label>

                    <button 
                        onClick={() => setIsConfiguring(false)}
                        className="w-full mt-2 py-2 text-xs font-bold text-black bg-white rounded hover:bg-gray-200"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default PanchangWidget;
