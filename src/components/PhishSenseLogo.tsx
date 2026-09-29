import React from 'react';

interface PhishSenseLogoProps {
  size?: number | string;
  className?: string;
  withGlow?: boolean;
}

export const PhishSenseLogo: React.FC<PhishSenseLogoProps> = ({
  size = 36,
  className = '',
  withGlow = false,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {withGlow && (
        <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-xl pointer-events-none" />
      )}
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none transform hover:scale-105 transition-transform"
      >
        <defs>
          {/* Gradients for 3D Isometric Cards */}
          {/* Blue Card (Front) */}
          <linearGradient id="blueFront" x1="60" y1="200" x2="320" y2="460" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4364F7" />
            <stop offset="100%" stopColor="#2546D8" />
          </linearGradient>
          <linearGradient id="blueEdge" x1="280" y1="420" x2="330" y2="490" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3BB8" />
            <stop offset="100%" stopColor="#152B88" />
          </linearGradient>

          {/* Red Card (Middle) */}
          <linearGradient id="redFront" x1="120" y1="140" x2="380" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4B72" />
            <stop offset="100%" stopColor="#E62E5C" />
          </linearGradient>
          <linearGradient id="redEdge" x1="340" y1="360" x2="390" y2="430" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C41C46" />
            <stop offset="100%" stopColor="#8F1030" />
          </linearGradient>

          {/* Green Card (Back) */}
          <linearGradient id="greenFront" x1="180" y1="80" x2="440" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#2F855A" />
          </linearGradient>
          <linearGradient id="greenEdge" x1="400" y1="300" x2="450" y2="370" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#276749" />
            <stop offset="100%" stopColor="#1C4532" />
          </linearGradient>

          {/* Hook Gradient */}
          <linearGradient id="hookMetallic" x1="400" y1="20" x2="280" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="40%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="hookBarb" x1="260" y1="110" x2="310" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Gold Microchip Gradients */}
          <linearGradient id="goldChip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEE140" />
            <stop offset="50%" stopColor="#FA709A" />
            <stop offset="100%" stopColor="#F6D365" />
          </linearGradient>
          <linearGradient id="goldPure" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Global Group with shadow */}
        <g filter="url(#shadowFilter)">
          
          {/* ======================================================== */}
          {/* 1. GREEN CARD (BACK LAYER) */}
          {/* ======================================================== */}
          <g id="green-card-layer">
            {/* Green Card Edge/Depth (Right & Bottom 3D thickness) */}
            <path
              d="M 445 230 L 457 237 L 457 385 L 445 378 Z"
              fill="url(#greenEdge)"
            />
            <path
              d="M 230 405 L 242 412 L 457 385 L 445 378 Z"
              fill="#1C4532"
            />

            {/* Green Card Face */}
            <rect
              x="180"
              y="75"
              width="265"
              height="305"
              rx="24"
              transform="matrix(0.866 0.5 -0.866 0.5 285 -105)"
              fill="url(#greenFront)"
            />

            {/* Green Card Punch Hole (where hook threads through) */}
            <ellipse
              cx="326"
              cy="176"
              rx="17"
              ry="26"
              transform="rotate(30 326 176)"
              fill="#0E0E11"
              stroke="#276749"
              strokeWidth="2"
            />

            {/* Green Card Gold Chip */}
            <g transform="translate(200, 120) rotate(30) skewX(-30)">
              <rect x="0" y="0" width="36" height="28" rx="4" fill="url(#goldPure)" />
              <path d="M 0 14 L 36 14 M 18 0 L 18 28 M 9 0 L 9 14 M 27 14 L 27 28" stroke="#D97706" strokeWidth="1.5" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 2. RED CARD (MIDDLE LAYER) */}
          {/* ======================================================== */}
          <g id="red-card-layer">
            {/* Red Card Edge/Depth */}
            <path
              d="M 385 280 L 397 287 L 397 435 L 385 428 Z"
              fill="url(#redEdge)"
            />
            <path
              d="M 170 455 L 182 462 L 397 435 L 385 428 Z"
              fill="#8F1030"
            />

            {/* Red Card Face */}
            <rect
              x="120"
              y="125"
              width="265"
              height="305"
              rx="24"
              transform="matrix(0.866 0.5 -0.866 0.5 225 -55)"
              fill="url(#redFront)"
            />

            {/* Red Card Punch Hole */}
            <ellipse
              cx="266"
              cy="226"
              rx="17"
              ry="26"
              transform="rotate(30 266 226)"
              fill="#0E0E11"
              stroke="#C41C46"
              strokeWidth="2"
            />

            {/* Red Card Gold Chip */}
            <g transform="translate(140, 170) rotate(30) skewX(-30)">
              <rect x="0" y="0" width="36" height="28" rx="4" fill="url(#goldPure)" />
              <path d="M 0 14 L 36 14 M 18 0 L 18 28 M 9 0 L 9 14 M 27 14 L 27 28" stroke="#B45309" strokeWidth="1.5" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 3. BLUE CARD (FRONT LAYER) */}
          {/* ======================================================== */}
          <g id="blue-card-layer">
            {/* Blue Card 3D Depth / Bevel Edge */}
            <path
              d="M 325 330 L 337 337 L 337 485 L 325 478 Z"
              fill="url(#blueEdge)"
            />
            <path
              d="M 110 505 L 122 512 L 337 485 L 325 478 Z"
              fill="#152B88"
            />

            {/* Blue Card Face */}
            <rect
              x="60"
              y="175"
              width="265"
              height="305"
              rx="24"
              transform="matrix(0.866 0.5 -0.866 0.5 165 -5)"
              fill="url(#blueFront)"
            />

            {/* Blue Card Punch Hole */}
            <ellipse
              cx="206"
              cy="276"
              rx="17"
              ry="26"
              transform="rotate(30 206 276)"
              fill="#0E0E11"
              stroke="#1E3BB8"
              strokeWidth="2"
            />

            {/* Blue Card Gold Microchip */}
            <g transform="translate(80, 220) rotate(30) skewX(-30)">
              <rect x="0" y="0" width="38" height="30" rx="5" fill="url(#goldPure)" />
              <path d="M 0 15 L 38 15 M 19 0 L 19 30 M 9 0 L 9 15 M 29 15 L 29 30" stroke="#B45309" strokeWidth="1.5" />
            </g>

            {/* Blue Card Bottom Embossed Number Dashes */}
            <g transform="translate(70, 310) rotate(30) skewX(-30)" opacity="0.65">
              <rect x="0" y="0" width="18" height="6" rx="2" fill="#93C5FD" />
              <rect x="26" y="0" width="18" height="6" rx="2" fill="#93C5FD" />
              <rect x="52" y="0" width="18" height="6" rx="2" fill="#93C5FD" />
              <rect x="78" y="0" width="18" height="6" rx="2" fill="#93C5FD" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* 4. THE METALLIC FISHING HOOK (Hooked Through the Cards) */}
          {/* ======================================================== */}
          <g id="fishing-hook">
            {/* Upper Hook Shank (Reaching up from top-right) */}
            <path
              d="M 390 15 C 405 18, 415 28, 410 40 L 390 120 C 375 160, 350 200, 305 240 C 275 265, 245 280, 215 285"
              stroke="url(#hookMetallic)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hook Shank Highlight (Metallic 3D reflection) */}
            <path
              d="M 392 20 L 388 122 C 372 163, 348 201, 305 238"
              stroke="#94A3B8"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
            />

            {/* Hook Eyelet Top Loop */}
            <circle cx="395" cy="24" r="14" fill="#0F172A" stroke="#475569" strokeWidth="6" />

            {/* The Loop & Barb Point coming out in front of the green/red cards */}
            {/* Curve through hole */}
            <path
              d="M 215 285 C 190 290, 165 275, 160 250 C 155 220, 168 180, 195 140 C 205 125, 215 110, 220 100"
              stroke="url(#hookMetallic)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sharp Point & Barb */}
            <path
              d="M 220 100 L 235 155 L 205 130 Z"
              fill="url(#hookBarb)"
            />

            {/* Sharp Barb Tip highlight */}
            <path
              d="M 220 100 L 210 120"
              stroke="#F1F5F9"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

        </g>
      </svg>
    </div>
  );
};
