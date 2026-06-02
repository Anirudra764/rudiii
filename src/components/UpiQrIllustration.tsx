import React from 'react';

export default function UpiQrIllustration() {
  return (
    <svg 
      viewBox="0 0 340 380" 
      className="w-full h-full max-w-[280px] mx-auto select-none" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rounded dark container card (visual style matches your uploaded image) */}
      <rect width="340" height="380" rx="20" fill="#181524" filter="drop-shadow(0 10px 25px rgba(0,0,0,0.5))" />
      <rect width="340" height="380" rx="20" stroke="#8A2BE2" strokeWidth="1.5" strokeOpacity="0.25" />

      {/* Main white QR code boundary rectangle */}
      <rect x="30" y="30" width="280" height="280" rx="16" fill="#F4F4F5" />

      {/* --- FINDER PATTERNS (The three large corner scanner bounds) --- */}
      {/* Top Left Finder Pattern */}
      <rect x="50" y="50" width="48" height="48" rx="6" fill="#181524" />
      <rect x="58" y="58" width="32" height="32" rx="3" fill="#F4F4F5" />
      <rect x="66" y="66" width="16" height="16" rx="1.5" fill="#181524" />

      {/* Top Right Finder Pattern */}
      <rect x="242" y="50" width="48" height="48" rx="6" fill="#181524" />
      <rect x="250" y="58" width="32" height="32" rx="3" fill="#F4F4F5" />
      <rect x="258" y="66" width="16" height="16" rx="1.5" fill="#181524" />

      {/* Bottom Left Finder Pattern */}
      <rect x="50" y="242" width="48" height="48" rx="6" fill="#181524" />
      <rect x="58" y="250" width="32" height="32" rx="3" fill="#F4F4F5" />
      <rect x="66" y="258" width="16" height="16" rx="1.5" fill="#181524" />

      {/* --- HIGH-FIDELITY FAUX QR CODE MATRIX PIXELS GRID --- */}
      <g fill="#181524">
        {/* Row 1 Y=50 - scattered data blocks */}
        <rect x="114" y="50" width="8" height="16" rx="1" />
        <rect x="130" y="50" width="16" height="8" rx="1" />
        <rect x="154" y="50" width="8" height="8" rx="1" />
        <rect x="178" y="50" width="8" height="16" rx="1" />
        <rect x="202" y="50" width="16" height="8" rx="1" />
        <rect x="226" y="50" width="8" height="8" rx="1" />

        {/* Row 2 Y=66 */}
        <rect x="110" y="66" width="8" height="8" rx="1" />
        <rect x="138" y="66" width="24" height="8" rx="1" />
        <rect x="170" y="70" width="8" height="16" rx="1" />
        <rect x="194" y="66" width="16" height="8" rx="1" />
        <rect x="218" y="62" width="16" height="16" rx="1" />

        {/* Row 3 Y=82 */}
        <rect x="114" y="82" width="12" height="12" rx="1" />
        <rect x="134" y="86" width="8" height="16" rx="1" />
        <rect x="150" y="82" width="24" height="8" rx="1" />
        <rect x="182" y="82" width="16" height="8" rx="1" />
        <rect x="210" y="82" width="8" height="16" rx="1" />
        <rect x="226" y="86" width="12" height="8" rx="1" />

        {/* Column Y=106 to Y=138 (Outer middle blocks) */}
        <rect x="50" y="114" width="16" height="8" rx="1" />
        <rect x="74" y="110" width="8" height="16" rx="1" />
        <rect x="90" y="114" width="8" height="8" rx="1" />
        <rect x="106" y="110" width="24" height="8" rx="1" />
        <rect x="138" y="114" width="16" height="16" rx="1" />
        <rect x="162" y="110" width="8" height="8" rx="1" />
        <rect x="178" y="114" width="16" height="8" rx="1" />
        <rect x="202" y="110" width="8" height="16" rx="1" />
        <rect x="218" y="114" width="24" height="8" rx="1" />
        <rect x="250" y="110" width="8" height="24" rx="1" />
        <rect x="266" y="114" width="16" height="8" rx="1" />
        <rect x="282" y="110" width="8" height="16" rx="1" />

        {/* Middle Left Blocks Y=130 */}
        <rect x="50" y="130" width="8" height="16" rx="1" />
        <rect x="66" y="138" width="16" height="8" rx="1" />
        <rect x="90" y="130" width="12" height="12" rx="1" />
        <rect x="110" y="134" width="8" height="16" rx="1" />
        <rect x="126" y="130" width="24" height="8" rx="1" />
        <rect x="158" y="130" width="16" height="16" rx="1" />
        <rect x="182" y="134" width="8" height="8" rx="1" />
        <rect x="202" y="130" width="16" height="8" rx="1" />
        <rect x="226" y="130" width="8" height="24" rx="1" />
        <rect x="242" y="138" width="16" height="8" rx="1" />
        <rect x="274" y="134" width="24" height="8" rx="1" />

        {/* Central Core grid Y=154 */}
        <rect x="50" y="154" width="16" height="8" rx="1" />
        <rect x="74" y="150" width="8" height="16" rx="1" />
        <rect x="90" y="154" width="16" height="8" rx="1" />
        <rect x="114" y="154" width="8" height="16" rx="1" />
        <rect x="130" y="150" width="16" height="8" rx="1" />
        <rect x="154" y="154" width="8" height="8" rx="1" />
        <rect x="178" y="154" width="16" height="8" rx="1" />
        <rect x="210" y="150" width="24" height="12" rx="1" />
        <rect x="242" y="154" width="12" height="16" rx="1" />
        <rect x="262" y="150" width="8" height="16" rx="1" />
        <rect x="278" y="154" width="16" height="8" rx="1" />

        {/* Row Y=178 */}
        <rect x="50" y="178" width="8" height="16" rx="1" />
        <rect x="66" y="178" width="16" height="8" rx="1" />
        <rect x="90" y="174" width="8" height="16" rx="1" />
        <rect x="106" y="178" width="24" height="8" rx="1" />
        <rect x="218" y="178" width="8" height="16" rx="1" />
        <rect x="234" y="174" width="16" height="8" rx="1" />
        <rect x="254" y="178" width="12" height="12" rx="1" />
        <rect x="274" y="178" width="24" height="8" rx="1" />

        {/* Row Y=198 */}
        <rect x="50" y="198" width="16" height="8" rx="1" />
        <rect x="74" y="194" width="8" height="16" rx="1" />
        <rect x="90" y="198" width="16" height="8" rx="1" />
        <rect x="114" y="198" width="8" height="16" rx="1" />
        <rect x="202" y="198" width="16" height="8" rx="1" />
        <rect x="226" y="194" width="8" height="16" rx="1" />
        <rect x="242" y="198" width="16" height="16" rx="1" />
        <rect x="266" y="194" width="8" height="8" rx="1" />
        <rect x="282" y="198" width="16" height="8" rx="1" />

        {/* Southern Blocks Y=214 */}
        <rect x="114" y="214" width="16" height="16" rx="1" />
        <rect x="138" y="210" width="8" height="16" rx="1" />
        <rect x="154" y="214" width="16" height="8" rx="1" />
        <rect x="178" y="210" width="24" height="8" rx="1" />
        <rect x="210" y="214" width="8" height="16" rx="1" />
        <rect x="226" y="214" width="16" height="8" rx="1" />
        <rect x="250" y="210" width="8" height="16" rx="1" />
        <rect x="266" y="214" width="24" height="8" rx="1" />

        {/* Bottom Core Blocks Y=242 */}
        <rect x="114" y="242" width="8" height="16" rx="1" />
        <rect x="130" y="242" width="16" height="8" rx="1" />
        <rect x="154" y="238" width="24" height="12" rx="1" />
        <rect x="186" y="242" width="8" height="16" rx="1" />
        <rect x="202" y="242" width="16" height="8" rx="1" />
        <rect x="226" y="238" width="8" height="8" rx="1" />
        <rect x="242" y="242" width="12" height="12" rx="1" />
        <rect x="262" y="242" width="16" height="8" rx="1" />
        <rect x="282" y="238" width="8" height="16" rx="1" />

        {/* Row Y=266 */}
        <rect x="110" y="266" width="16" height="8" rx="1" />
        <rect x="134" y="262" width="8" height="16" rx="1" />
        <rect x="150" y="266" width="16" height="16" rx="1" />
        <rect x="174" y="266" width="32" height="8" rx="1" />
        <rect x="214" y="262" width="8" height="16" rx="1" />
        <rect x="230" y="266" width="12" height="8" rx="1" />
        <rect x="250" y="262" width="8" height="16" rx="1" />
        <rect x="266" y="266" width="16" height="8" rx="1" />
        <rect x="286" y="266" width="12" height="12" rx="1" />

        {/* Row Y=282 */}
        <rect x="114" y="282" width="8" height="8" rx="1" />
        <rect x="130" y="282" width="16" height="16" rx="1" />
        <rect x="154" y="286" width="8" height="8" rx="1" />
        <rect x="170" y="282" width="24" height="8" rx="1" />
        <rect x="202" y="282" width="16" height="12" rx="1" />
        <rect x="226" y="286" width="8" height="8" rx="1" />
        <rect x="242" y="282" width="32" height="8" rx="1" />
        <rect x="282" y="282" width="16" height="16" rx="1" />
      </g>

      {/* --- CENTRAL GOOGLE PAY BRAND EMBLEM BADGE --- */}
      {/* Pristine white circle to isolate the emblem shield */}
      <circle cx="170" cy="170" r="32" fill="#FFFFFF" />
      <circle cx="170" cy="170" r="32" stroke="#E4E4E7" strokeWidth="1" />

      {/* High precision reproduction of the multi-colored Google Pay brand ribbons logo */}
      <g transform="translate(148, 148) scale(1.1)">
        {/* Blue loop segment */}
        <path 
          d="M 17.5 10 C 13.5 10, 10 13.5, 10 17.5 C 10 19.5, 11 21.5, 12.5 22.5 L 17.5 17.5 L 17.5 10 Z" 
          fill="#4285F4" 
        />
        {/* Red loop segment */}
        <path 
          d="M 17.5 10 L 17.5 17.5 L 22.5 22.5 C 24 21.5, 25 19.5, 25 17.5 C 25 13.5, 21.5 10, 17.5 10 Z" 
          fill="#EA4335" 
        />
        {/* Yellow loop segment */}
        <path 
          d="M 12.5 22.5 C 13.5 23.5, 15.5 24, 17.5 24 L 17.5 17.5 L 12.5 22.5 Z" 
          fill="#FBBC05" 
        />
        {/* Green loop segment */}
        <path 
          d="M 17.5 17.5 L 17.5 24 C 19.5 24, 21.5 23.5, 22.5 22.5 L 17.5 17.5 Z" 
          fill="#34A853" 
        />
        
        {/* Inner brand ribbon loops overlapping overlay to make it look identical to GPay colorful logo */}
        <path 
          d="M 23 18 L 27 22" 
          stroke="#EA4335" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <path 
          d="M 17 23 L 13 27" 
          stroke="#FBBC05" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <path 
          d="M 11 18 L 7 22" 
          stroke="#4285F4" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <path 
          d="M 23 23 L 27 27" 
          stroke="#34A853" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
      </g>

      {/* --- BOTTOM SCANNABLE FOOTER TEXT --- */}
      <text 
        x="170" 
        y="346" 
        textAnchor="middle" 
        fill="#FFFFFF" 
        fontFamily="sans-serif" 
        fontSize="12.5" 
        fontWeight="bold"
        className="tracking-tight antialiased"
      >
        Scan to pay with any UPI app
      </text>
    </svg>
  );
}
