import React, { useState, useEffect } from 'react';
import PanchangClock from './components/PanchangClock';
import PanchangDashboard from './components/PanchangDashboard';
import { getSiderealSunLongitude, getMoonLongitude, getLagnaAngle } from './utils/astronomy';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Angles
  // Note: These calculations are simplified simulations.
  const siderealSunLong = getSiderealSunLongitude(now);
  const tropicalMoonLong = getMoonLongitude(now); 
  
  // Mapping angles for visual clock
  // 0 deg (Aries) -> Top (-90 in SVG)
  const mapLongitudeToSvgAngle = (long: number) => {
      return long - 90; 
  };

  const sunAngle = mapLongitudeToSvgAngle(siderealSunLong);
  const moonAngle = mapLongitudeToSvgAngle(tropicalMoonLong);
  const lagnaAngle = mapLongitudeToSvgAngle(getLagnaAngle(now));
  
  return (
    <div className="min-h-screen bg-[#0f1219] flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
         <h1 className="text-2xl font-bold text-[#fbbf24] font-serif tracking-widest drop-shadow-md">ASTROTIME</h1>
         <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto mt-1"></div>
      </header>
      
      <div className="relative z-10">
          {/* Main Clock */}
          <PanchangClock 
            sunAngle={sunAngle}
            moonAngle={moonAngle}
            lagnaAngle={lagnaAngle}
            width={window.innerWidth > 600 ? 550 : window.innerWidth - 32}
          />
      </div>

      {/* New Unified Dashboard */}
      <PanchangDashboard date={now} />
      
    </div>
  );
};

export default App;
