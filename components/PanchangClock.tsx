import React from 'react';
import { NAKSHATRAS, RASHIS, MONTHS, TITHIS } from '../constants';

interface PanchangClockProps {
  sunAngle: number;
  moonAngle: number;
  lagnaAngle: number;
  width?: number;
}

const PanchangClock: React.FC<PanchangClockProps> = ({ sunAngle, moonAngle, lagnaAngle, width = 400 }) => {
  const cx = 500;
  const cy = 500;
  
  // Adjusted radii for solid bands
  const rOuterRim = 480;
  const rNakshatraOuter = 470;
  const rNakshatraInner = 410;
  const rRashiOuter = 410;
  const rRashiInner = 320;
  const rMonthOuter = 320;
  const rMonthInner = 260;
  const rTithiOuter = 260;
  const rTithiInner = 180;
  const rCenter = 180;

  // Helper to polar coordinates
  // Input angle: 0 = Top, 90 = Right, 180 = Bottom, 270 = Left (Clockwise)
  // Standard Math: 0 = Right, 90 = Bottom (if y down), etc.
  // Our system: 0 is Top.
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    // Subtract 90 to align 0 degrees to Top (SVG 12 o'clock)
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  // Readable Radial Text Logic
  // Aligns text tangent to the circle (along the rim)
  // Flips text at the bottom half so it's readable
  const getReadableRotation = (angle: number) => {
      // Normalize angle to 0-360
      let normalized = angle % 360;
      if (normalized < 0) normalized += 360;
      
      // If angle is between 90 (3 o'clock) and 270 (9 o'clock), flip 180
      if (normalized > 90 && normalized < 270) {
          return normalized + 180;
      }
      return normalized;
  };

  const createSegment = (
      items: any[], 
      rOuter: number, 
      rInner: number, 
      fillColor: string, 
      strokeColor: string, 
      textColor: string,
      fontSize: number,
      keyPrefix: string,
      isRashi: boolean = false
    ) => {
    const step = 360 / items.length;
    
    return items.map((item, index) => {
        const startAngle = index * step;
        const endAngle = (index + 1) * step;
        const midAngle = (startAngle + endAngle) / 2;
        
        const p1 = polarToCartesian(cx, cy, rOuter, endAngle);
        const p2 = polarToCartesian(cx, cy, rOuter, startAngle);
        const p3 = polarToCartesian(cx, cy, rInner, startAngle);
        const p4 = polarToCartesian(cx, cy, rInner, endAngle);
        
        // Large arc flag: if angle > 180
        const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
        
        const pathData = `
            M ${p1.x} ${p1.y}
            A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${rInner} ${rInner} 0 ${largeArc} 1 ${p4.x} ${p4.y}
            Z
        `;
        
        const textPos = polarToCartesian(cx, cy, (rOuter + rInner) / 2, midAngle);
        
        // Text Logic
        const rotation = getReadableRotation(midAngle);
        
        // For Nakshatra/Rashi we want tangential text usually for compasses
        // 0 deg (Top) -> Text is Horizontal (0 rotation)
        // This matches `getReadableRotation` logic perfectly if 0 is top.
        // Wait, standard radial spokes:
        // Top (0) -> Vertical spoke. Text should be vertical?
        // User requested: "Text at 12 is upright. Text at 6 is flipped."
        // "Upright" usually means horizontal for reading.
        // Let's stick to Tangential (Rim) alignment.
        
        const content = isRashi ? item.name : item;
        const symbol = isRashi ? item.symbol : null;
        
        return (
            <g key={`${keyPrefix}-${index}`}>
                <path d={pathData} fill={fillColor} stroke={strokeColor} strokeWidth="1" />
                <text
                    x={textPos.x}
                    y={textPos.y}
                    fill={textColor}
                    fontSize={fontSize}
                    fontFamily="Cinzel, serif"
                    fontWeight={isRashi ? "bold" : "normal"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${rotation}, ${textPos.x}, ${textPos.y})`}
                    className="select-none tracking-widest"
                >
                    {content}
                </text>
                {symbol && (
                     <text
                     x={textPos.x}
                     y={textPos.y + 16} // Offset 'down' relative to rotated text? No, absolute.
                     // Actually, we need to move relative to the rotation.
                     // Easier: Tspan or separate text with same transform but dy
                     fill={textColor}
                     fontSize={fontSize - 2}
                     textAnchor="middle"
                     dominantBaseline="middle"
                     transform={`rotate(${rotation}, ${textPos.x}, ${textPos.y}) translate(0, 14)`}
                     opacity="0.7"
                 >
                     {symbol}
                 </text>
                )}
            </g>
        );
    });
  };

  // -----------------------------------------------------------
  // RENDERERS
  // -----------------------------------------------------------

  const renderBackgroundPlate = () => (
      <circle cx={cx} cy={cy} r={rOuterRim} fill="#0f172a" stroke="#fbbf24" strokeWidth="6" />
  );

  const renderNakshatraRing = () => {
    return createSegment(NAKSHATRAS, rNakshatraOuter, rNakshatraInner, "#1e293b", "#fbbf24", "#e2e8f0", 10, "nakshatra");
  };

  const renderRashiRing = () => {
    return createSegment(RASHIS, rRashiOuter, rRashiInner, "#0f172a", "#fbbf24", "#fbbf24", 20, "rashi", true);
  };
  
  const renderMonthRing = () => {
    // Use darker fill
    return createSegment(MONTHS, rMonthOuter, rMonthInner, "#1e293b", "#fbbf24", "#94a3b8", 12, "month");
  };

  const renderTithiRing = () => {
      // Tithis are 30.
      return createSegment(
          Array.from({length: 30}, (_, i) => i + 1), 
          rTithiOuter, 
          rTithiInner, 
          "#0f172a", 
          "#334155", 
          "#64748b", 
          10, 
          "tithi"
      );
  }

  const renderCenterCompass = () => {
      return (
          <g>
              {/* Inner Dark Void */}
              <circle cx={cx} cy={cy} r={rCenter} fill="#0B1026" stroke="#fbbf24" strokeWidth="2" />
              
              {/* Degree Marks */}
              {Array.from({length: 72}).map((_, i) => {
                  const angle = i * 5;
                  const isMajor = i % 2 === 0; // Every 10 degrees
                  const r1 = rCenter - 5;
                  const r2 = isMajor ? rCenter - 15 : rCenter - 10;
                  const p1 = polarToCartesian(cx, cy, r1, angle);
                  const p2 = polarToCartesian(cx, cy, r2, angle);
                  return (
                      <line 
                        key={`tick-${i}`} 
                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                        stroke="#fbbf24" 
                        strokeWidth={isMajor ? 1.5 : 0.5} 
                        opacity="0.6" 
                      />
                  );
              })}

              {/* Decorative Star */}
              <g transform={`translate(${cx}, ${cy})`}>
                   {/* 4 Point Star */}
                   <path d="M 0 -60 L 15 -15 L 60 0 L 15 15 L 0 60 L -15 15 L -60 0 L -15 -15 Z" fill="#fbbf24" opacity="0.8" />
                   {/* 4 Minor Points */}
                   <path d="M 0 -40 L 10 -10 L 40 0 L 10 10 L 0 40 L -10 10 L -40 0 L -10 -10 Z" fill="#b45309" transform="rotate(45)" opacity="0.8" />
                   <circle r="5" fill="#fff" />
              </g>

              {/* Labels */}
              <text x={cx} y={cy - 80} textAnchor="middle" fill="#38bdf8" fontSize="14" fontFamily="Cinzel" fontWeight="bold" letterSpacing="2px">SKY</text>
              <text x={cx} y={cy + 95} textAnchor="middle" fill="#38bdf8" fontSize="14" fontFamily="Cinzel" fontWeight="bold" letterSpacing="2px">EARTH</text>
          </g>
      )
  };

  // -----------------------------------------------------------
  // HANDS
  // -----------------------------------------------------------

  const renderSunHand = () => {
      // A "Captain's Compass" Needle
      return (
          <g transform={`rotate(${sunAngle}, ${cx}, ${cy})`} style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))" }}>
               {/* Main Shaft (Invisible helper for rotation visual) */}
               {/* Tail */}
               <path d={`M ${cx} ${cy + 40} L ${cx - 5} ${cy} L ${cx + 5} ${cy} Z`} fill="#fbbf24" />
               
               {/* Long Shaft */}
               <rect x={cx - 2} y={cy - 360} width="4" height="360" fill="#fbbf24" />
               
               {/* Head - The "Arrow" */}
               <path d={`M ${cx} ${cy - 400} L ${cx + 15} ${cy - 350} L ${cx} ${cy - 360} L ${cx - 15} ${cy - 350} Z`} fill="#fbbf24" stroke="#fff" strokeWidth="1" />
               
               {/* Sun Emblem on Shaft */}
               <g transform={`translate(${cx}, ${cy - 280})`}>
                   <circle r="12" fill="#0B1026" stroke="#fbbf24" strokeWidth="2" />
                   <circle r="6" fill="#fbbf24" />
                   {/* Rays */}
                   {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
                       <line key={d} x1="0" y1="-14" x2="0" y2="-18" stroke="#fbbf24" strokeWidth="2" transform={`rotate(${d})`} />
                   ))}
               </g>
          </g>
      );
  };

  const renderMoonHand = () => {
    // Silver, thinner, distinct
    const length = 440; // Reaches Nakshatra
    return (
        <g transform={`rotate(${moonAngle}, ${cx}, ${cy})`} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}>
            <line x1={cx} y1={cy} x2={cx} y2={cy - length} stroke="#e2e8f0" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="6" fill="#e2e8f0" />
            
            {/* Moon Icon at Tip */}
            <g transform={`translate(${cx}, ${cy - 380})`}>
                <circle r="12" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" />
                <path d="M -4 -6 Q 4 0 -4 6 A 6 6 0 0 1 -4 -6" fill="#e2e8f0" transform="scale(1.2)" />
            </g>
            
            {/* Pointer Tip */}
            <path d={`M ${cx} ${cy - length} L ${cx + 4} ${cy - length + 10} L ${cx - 4} ${cy - length + 10} Z`} fill="#e2e8f0" />
        </g>
    );
  };

  const renderLagnaHand = () => {
      // Green Triangle, distinct
      const length = rRashiInner + 10;
      return (
          <g transform={`rotate(${lagnaAngle}, ${cx}, ${cy})`}>
              <line x1={cx} y1={cy} x2={cx} y2={cy - length} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.8" />
              <path d={`M ${cx} ${cy - length} L ${cx + 8} ${cy - length + 15} L ${cx - 8} ${cy - length + 15} Z`} fill="#4ade80" stroke="#064e3b" strokeWidth="1" />
              <text x={cx} y={cy - length + 25} textAnchor="middle" fill="#4ade80" fontSize="10" fontFamily="sans-serif" fontWeight="bold">LAGNA</text>
          </g>
      );
  };

  return (
    <div className="w-full flex justify-center items-center">
        <svg
            viewBox="0 0 1000 1000"
            width={width}
            height={width}
            className="w-full h-auto max-w-[650px] select-none"
            style={{ 
                background: 'radial-gradient(circle, #1e293b 0%, #0B1026 70%)',
                borderRadius: '50%',
                boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 0 10px #1e293b'
            }}
        >
            <defs>
                {/* Glow Filter for Text */}
                <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Base Plate */}
            {renderBackgroundPlate()}

            {/* Rings */}
            {renderNakshatraRing()}
            {renderRashiRing()}
            {renderMonthRing()}
            {renderTithiRing()}
            
            {/* Center */}
            {renderCenterCompass()}
            
            {/* Hands - Order matters for layering */}
            {renderLagnaHand()}
            {renderMoonHand()}
            {renderSunHand()}
            
            {/* Center Cap */}
            <circle cx={cx} cy={cy} r="8" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
        </svg>
    </div>
  );
};

export default PanchangClock;
