export const NAKSHATRAS = [
  "ASHWINI", "BHARANI", "KRITTIKA", "ROHINI", "MRIGASHIRA", "ARDRA", 
  "PUNARVASU", "PUSHYA", "ASHLESHA", "MAGHA", "PURVA PHALGUNI", "UTTARA PHALGUNI", 
  "HASTA", "CHITRA", "SWATI", "VISHAKHA", "ANURADHA", "JYESHTA", 
  "MOOLA", "PURVA ASHADA", "UTTARA ASHADA", "SHRAVANA", "DHANISHTA", 
  "SHATABISHA", "PURVA BHADRA", "UTTARA BHADRA", "REVATI"
];

export const RASHIS = [
  { name: "MESHA", symbol: "♈︎" },
  { name: "VRISHABHA", symbol: "♉︎" },
  { name: "MITHUNA", symbol: "♊︎" },
  { name: "KATAKA", symbol: "♋︎" },
  { name: "SIMHA", symbol: "♌︎" },
  { name: "KANYA", symbol: "♍︎" },
  { name: "TULA", symbol: "♎︎" },
  { name: "VRISHCHIKA", symbol: "♏︎" },
  { name: "DHANU", symbol: "♐︎" },
  { name: "MAKARA", symbol: "♑︎" },
  { name: "KUMBHA", symbol: "♒︎" },
  { name: "MEENA", symbol: "♓︎" }
];

export const MONTHS = [
  "CHAITRA", "VAISHAKHA", "JYESHTA", "AASHADA", 
  "SHRAVANA", "BHADRAPADA", "ASHWAYUJA", "KARTIKA", 
  "MARGASHIRA", "PUSHYA", "MAGHA", "PHALGUNA"
];

export const TITHIS = [
  "Pratipada", "Dwitiya", "tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
];

export const DIRECTIONS = ["East", "South", "West", "North"]; // Order for clockwise 90deg rotation starting from right? No, typically North is up. 
// However, in Indian charts, East is often top or distinct. 
// Looking at the image: East is RIGHT, West is LEFT, North is BOTTOM, South is TOP (This is South Indian style chart orientation typically, but the image has North pointer).
// Wait, looking at image: 
// "East" label is near right. "West" is near left. 
// "Sky" label is near top. "Lagna" is near East.
// We will follow standard map: North Up (0 deg), East Right (90 deg), South Down (180 deg), West Left (270 deg).
// BUT the image might be rotated. The image shows Mesha at top (approx 12 o'clock). Mesha is usually East in chart, but Aries is 0 degrees celestial longitude.
// Let's stick to: Top = 0 degrees = Start of Mesha.
