import React, { useState, useEffect } from 'react';

interface NotificationSystemProps {
  tithiIndex: number;
  paksha: string;
  rashiName: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ tithiIndex, paksha, rashiName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  
  // Preferences State
  const [prefs, setPrefs] = useState({
      ekadashi: false,
      purnima: false,
      amavasya: false,
      sankranti: false
  });

  // Load prefs on mount
  useEffect(() => {
      const saved = localStorage.getItem('astrotime_notify_prefs');
      if (saved) setPrefs(JSON.parse(saved));
  }, []);

  // Save prefs
  const togglePref = (key: keyof typeof prefs) => {
      const newPrefs = { ...prefs, [key]: !prefs[key] };
      setPrefs(newPrefs);
      localStorage.setItem('astrotime_notify_prefs', JSON.stringify(newPrefs));
      
      if (newPrefs[key] && permission === 'default') {
          Notification.requestPermission().then(setPermission);
      }
  };

  // Check for events logic
  useEffect(() => {
    if (permission !== 'granted') return;

    // Logic to prevent spam: check if notification for today was already sent
    const todayStr = new Date().toDateString();
    const lastSent = localStorage.getItem('astrotime_last_notified');
    
    if (lastSent === todayStr) return;

    let message = "";

    // Tithi Index 0-14. 
    // Ekadashi is 11th tithi (index 10).
    if (prefs.ekadashi && tithiIndex === 10) {
        message = `Today is Ekadashi (${paksha} Paksha). Auspicious time for fasting.`;
    }
    
    // Purnima is 15th (index 14) of Shukla
    if (prefs.purnima && tithiIndex === 14 && paksha === "Shukla") {
        message = "Today is Purnima (Full Moon).";
    }

    // Amavasya is 15th (index 14) of Krishna
    if (prefs.amavasya && tithiIndex === 14 && paksha === "Krishna") {
        message = "Today is Amavasya (New Moon).";
    }

    // Sankranti check is harder without previous state, simulating purely on user action or if date is ~14th-17th
    // We'll skip complex sankranti logic for this simulation, or just use a placeholder
    
    if (message) {
        new Notification("Astrotime Reminder", {
            body: message,
            icon: '/favicon.ico' // Assuming standard favicon or fallback
        });
        localStorage.setItem('astrotime_last_notified', todayStr);
    }

  }, [tithiIndex, paksha, prefs, permission]);

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-800 text-yellow-400 rounded-full shadow-lg border border-slate-600 hover:bg-slate-700 transition-transform hover:scale-105"
        title="Notification Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-serif font-bold text-yellow-500">Event Reminders</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="p-6 space-y-4">
                    {permission === 'denied' && (
                         <div className="bg-red-900/30 border border-red-800 text-red-200 text-xs p-2 rounded">
                            Notifications are blocked in browser settings.
                         </div>
                    )}
                    
                    <p className="text-sm text-gray-300">Select events to receive push notifications:</p>
                    
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${prefs.ekadashi ? 'bg-yellow-600 border-yellow-600' : 'border-gray-500'}`}>
                                {prefs.ekadashi && <span className="text-white text-xs">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={prefs.ekadashi} onChange={() => togglePref('ekadashi')} />
                            <span className="text-gray-200 group-hover:text-yellow-400">Ekadashi</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${prefs.purnima ? 'bg-yellow-600 border-yellow-600' : 'border-gray-500'}`}>
                                {prefs.purnima && <span className="text-white text-xs">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={prefs.purnima} onChange={() => togglePref('purnima')} />
                            <span className="text-gray-200 group-hover:text-yellow-400">Purnima (Full Moon)</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${prefs.amavasya ? 'bg-yellow-600 border-yellow-600' : 'border-gray-500'}`}>
                                {prefs.amavasya && <span className="text-white text-xs">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={prefs.amavasya} onChange={() => togglePref('amavasya')} />
                            <span className="text-gray-200 group-hover:text-yellow-400">Amavasya (New Moon)</span>
                        </label>
                    </div>

                    <button 
                        onClick={() => {
                            Notification.requestPermission().then(setPermission);
                        }}
                        className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm transition-colors"
                    >
                        {permission === 'granted' ? 'Notifications Enabled' : 'Enable Permissions'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
