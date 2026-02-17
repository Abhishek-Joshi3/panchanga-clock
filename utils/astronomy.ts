import { NAKSHATRAS, RASHIS, TITHIS } from '../constants';

export const degreesToRadians = (deg: number) => (deg * Math.PI) / 180;
export const radiansToDegrees = (rad: number) => (rad * 180) / Math.PI;

const normalizeAngle = (deg: number) => {
    let res = deg % 360;
    if (res < 0) res += 360;
    return res;
};

// --- High Precision Calculations (Simplified VSOP87/Meeus) ---

const getJulianDay = (date: Date) => {
    return (date.getTime() / 86400000) + 2440587.5;
};

// Returns Tropical (Sayana) Sun Longitude
export const getTropicalSunLongitude = (date: Date): number => {
    const jd = getJulianDay(date);
    const D = jd - 2451545.0; // Days since J2000

    // Mean Longitude (L)
    const L = 280.46646 + 0.9856474 * D;
    // Mean Anomaly (g)
    const g = 357.52911 + 0.98560028 * D;

    const gRad = degreesToRadians(g);

    // Equation of Center
    const C = (1.914602 - 0.004817 * (D/36525)) * Math.sin(gRad) 
            + (0.019993 - 0.000101 * (D/36525)) * Math.sin(2 * gRad)
            + 0.000289 * Math.sin(3 * gRad);

    return normalizeAngle(L + C);
};

// Returns Sidereal (Nirayana) Sun Longitude
export const getSiderealSunLongitude = (date: Date): number => {
    const tropical = getTropicalSunLongitude(date);
    // Lahiri Ayanamsa approx for 2025 is ~24.11 degrees
    // Ayanamsa increases ~0.0139 deg/year
    const jd = getJulianDay(date);
    const t = (jd - 2451545.0) / 36525;
    const ayanamsa = 23.85 + 1.4 * t; // Approx formula
    return normalizeAngle(tropical - ayanamsa);
};

// Returns Sidereal Moon Longitude with major perturbations
export const getMoonLongitude = (date: Date): number => {
    const jd = getJulianDay(date);
    const D_days = jd - 2451545.0;

    // Mean Longitude (L)
    const L = 218.3164477 + 13.17639615 * D_days;
    // Mean Anomaly (Mm)
    const Mm = 134.96298 + 13.064993 * D_days;
    // Mean Anomaly of Sun (M) - approximate from Sun calc
    const M = 357.52911 + 0.98560028 * D_days;
    // Mean Elongation (D)
    const D = 297.85019 + 12.190749 * D_days;
    // Argument of Latitude (F)
    const F = 93.27209 + 13.229350 * D_days;

    const rad = degreesToRadians;
    
    // Major perturbations (Evection, Variation, Annual Eq)
    let Long = L 
             + 6.289 * Math.sin(rad(Mm))       // Equation of Center
             - 1.274 * Math.sin(rad(Mm - 2*D)) // Evection
             + 0.658 * Math.sin(rad(2*D))      // Variation
             - 0.185 * Math.sin(rad(M))        // Annual Equation
             - 0.114 * Math.sin(rad(2*F))      // Reduction to Ecliptic
             + 0.214 * Math.sin(rad(2*Mm));    // Term 2 Eq Center

    const tropicalMoon = normalizeAngle(Long);

    // Subtract Ayanamsa for Sidereal
    const t = (jd - 2451545.0) / 36525;
    const ayanamsa = 23.85 + 1.4 * t; 

    return normalizeAngle(tropicalMoon - ayanamsa);
};

export const getLagnaAngle = (date: Date): number => {
    // Sidereal Time approximation
    const jd = getJulianDay(date);
    const D = jd - 2451545.0;
    const GMST = 18.697374558 + 24.06570982441908 * D;
    
    // Convert GMST to local Sidereal Time (LST) for Mumbai (72.87 E)
    // Longitude is degrees East. 1 hr = 15 deg.
    // LST = GMST + Longitude/15
    const lng = 72.8777;
    const LST_hours = normalizeAngle(GMST * 15 + lng) / 15;
    
    // Ascendant (Lagna) ~ LST * 15 + 90 (very rough visual approximation)
    // Accurate Lagna requires solving tan(lambda) = cos(e) * tan(RAMC)... too complex for pure JS without library
    // We will use the traditional approximation: Sun Rise = Sun Longitude. 
    // Lagna moves 1 degree per 4 minutes.
    
    // Visual Alignment:
    // If it is 6 AM (Sunrise), Lagna should equal Sun Longitude.
    // If it is 12 PM (Noon), Lagna should be Sun + 90.
    
    const sunLong = getSiderealSunLongitude(date);
    const now = date;
    const midnight = new Date(now);
    midnight.setHours(0,0,0,0);
    const minsPassed = (now.getTime() - midnight.getTime()) / 60000;
    
    // Approx sunrise at 6:40 AM in Feb for Mumbai?
    // Let's assume Sunrise is at lagna = Sun.
    // Movement is 360 degrees in 24 hours = 0.25 deg per min.
    // Offset so Lagna == Sun at ~6:45 AM (405 mins)
    const rotation = (minsPassed - 405) * 0.25; 
    
    return normalizeAngle(sunLong + rotation);
};

// --- Rise/Set Time Calculations ---

export const getSunTimes = (date: Date, lat: number, lng: number) => {
    // Simple calculation for Sunrise/Sunset
    const d = new Date(date);
    d.setHours(12, 0, 0, 0);
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Declination of Sun
    const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
    const declRad = declination * Math.PI / 180;
    const latRad = lat * Math.PI / 180;

    // Hour Angle (H)
    const cosH = -Math.tan(latRad) * Math.tan(declRad);
    
    let srMins = 6 * 60; // Default
    let ssMins = 18 * 60; // Default

    if (cosH >= -1 && cosH <= 1) {
        const H = Math.acos(cosH) * 180 / Math.PI; // Degrees
        const minutesDiff = H * 4;
        
        // Noon correction for longitude
        // LSTM = 15 * 5.5 = 82.5 (IST time meridian)
        // EoT ignored
        const timeCorrection = (4 * (82.5 - lng)); // mins
        const noonMins = 12 * 60 + timeCorrection; 
        
        srMins = noonMins - minutesDiff;
        ssMins = noonMins + minutesDiff;
    }

    const toTime = (totalMins: number) => {
        const h = Math.floor(totalMins / 60);
        const m = Math.floor(totalMins % 60);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    return {
        sunrise: toTime(srMins),
        sunset: toTime(ssMins),
        dayDuration: ssMins - srMins
    };
};

export const getMoonTimes = (date: Date, tithiIndex: number) => {
    // Mumbai specific approx
    const baseRise = 6.5; // ~6:30 AM for New Moon
    const offsetHours = tithiIndex * 0.8;
    
    let riseHour = (baseRise + offsetHours) % 24;
    let setHour = (riseHour + 12.4) % 24;
    
    const format = (h: number) => {
        const hh = Math.floor(h);
        const mm = Math.floor((h - hh) * 60);
        const ampm = hh >= 12 ? 'PM' : 'AM';
        const h12 = hh % 12 || 12;
        return `${h12}:${mm.toString().padStart(2, '0')} ${ampm}`;
    }

    return {
        moonrise: format(riseHour),
        moonset: format(setHour)
    };
};

// --- Vedic Data Simulator ---

export const calculateVedicData = (date: Date) => {
    const sun = getSiderealSunLongitude(date);
    const moon = getMoonLongitude(date);

    // Tithi Calculation
    let diff = moon - sun;
    if (diff < 0) diff += 360;
    
    const tithiNum = Math.floor(diff / 12) + 1; // 1 to 30
    const tithiIndex = tithiNum - 1;
    
    // Paksha: 1-15 Shukla, 16-30 Krishna
    const paksha = tithiNum <= 15 ? "Shukla" : "Krishna";
    
    // Map Tithi Number to Name
    // Shukla: 1-15 (Purnima is 15)
    // Krishna: 1-15 (Amavasya is 30, represented as 15th of Krishna in names usually)
    let displayIndex;
    if (tithiNum <= 15) {
        displayIndex = tithiNum - 1;
    } else {
        displayIndex = tithiNum - 16;
    }
    // Correction: TITHIS array has 15 names.
    // Index 14 is Purnima/Amavasya.
    // If tithiNum is 30, it is Amavasya.
    
    let tithiName = TITHIS[displayIndex];
    if (tithiNum === 30) tithiName = "Amavasya";
    if (tithiNum === 15) tithiName = "Purnima";

    // Nakshatra
    // 360 / 27 = 13.3333 degrees
    const nakIndex = Math.floor(moon / 13.3333);
    const nakshatra = NAKSHATRAS[nakIndex % 27];
    const nakshatraPercent = ((moon % 13.3333) / 13.3333) * 100;

    // Rashi
    const rashiIndex = Math.floor(sun / 30); // Solar Rashi generally used for Month
    const moonRashiIndex = Math.floor(moon / 30);
    const rashi = RASHIS[moonRashiIndex % 12]; // Clock shows Moon Rashi usually? Or Sun? Usually "Rashi" refers to Moon Sign.
    
    // Yoga
    const yogaSum = (sun + moon) % 360;
    const yogaIndex = Math.floor(yogaSum / 13.3333);
    const YOGAS = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
    const yoga = YOGAS[yogaIndex % 27];

    // Karana
    const karanaNum = Math.floor(diff / 6) + 1;
    // const karanaName = ... (complex mapping logic, placeholder for now)
    const karana = `Karana ${karanaNum}`;

    return {
        tithi: { name: tithiName, paksha, index: tithiIndex, number: tithiNum },
        nakshatra: { name: nakshatra, percent: nakshatraPercent.toFixed(1) },
        rashi: rashi,
        yoga: yoga,
        karana: karana
    };
};