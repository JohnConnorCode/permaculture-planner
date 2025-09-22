import React from 'react'

// SVG pattern definitions for textures and materials
export function TexturePatterns() {
  return (
    <defs>
      {/* Soil texture for beds */}
      <pattern id="soil-texture" patternUnits="userSpaceOnUse" width="20" height="20">
        <rect width="20" height="20" fill="#8B4513" />
        <circle cx="5" cy="5" r="1" fill="#6B3410" opacity="0.3" />
        <circle cx="15" cy="8" r="1.5" fill="#A0522D" opacity="0.4" />
        <circle cx="8" cy="15" r="1" fill="#6B3410" opacity="0.3" />
        <circle cx="18" cy="18" r="0.8" fill="#5D2F0B" opacity="0.5" />
        <circle cx="2" cy="12" r="1.2" fill="#7A3F11" opacity="0.4" />
      </pattern>

      {/* Wood chips mulch texture */}
      <pattern id="mulch-texture" patternUnits="userSpaceOnUse" width="30" height="30">
        <rect width="30" height="30" fill="#D2691E" />
        <rect x="5" y="5" width="8" height="3" fill="#8B4513" opacity="0.6" transform="rotate(25 9 6.5)" />
        <rect x="15" y="10" width="7" height="2" fill="#A0522D" opacity="0.5" transform="rotate(-15 18.5 11)" />
        <rect x="8" y="18" width="6" height="3" fill="#8B4513" opacity="0.7" transform="rotate(45 11 19.5)" />
        <rect x="20" y="22" width="8" height="2" fill="#654321" opacity="0.6" transform="rotate(-30 24 23)" />
      </pattern>

      {/* Gravel texture */}
      <pattern id="gravel-texture" patternUnits="userSpaceOnUse" width="25" height="25">
        <rect width="25" height="25" fill="#808080" />
        <circle cx="5" cy="5" r="2" fill="#696969" />
        <circle cx="12" cy="8" r="1.5" fill="#A9A9A9" />
        <circle cx="20" cy="6" r="2.5" fill="#595959" />
        <circle cx="8" cy="15" r="2" fill="#7A7A7A" />
        <circle cx="18" cy="18" r="1.8" fill="#696969" />
        <circle cx="3" cy="22" r="2.2" fill="#8B8B8B" />
        <circle cx="23" cy="20" r="1.5" fill="#A0A0A0" />
      </pattern>

      {/* Grass texture */}
      <pattern id="grass-texture" patternUnits="userSpaceOnUse" width="20" height="20">
        <rect width="20" height="20" fill="#228B22" />
        <path d="M2,20 Q2,15 3,10" stroke="#32CD32" strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M5,20 Q5,14 6,8" stroke="#00FF00" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M8,20 Q8,16 9,11" stroke="#32CD32" strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M11,20 Q11,15 12,9" stroke="#00FF00" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M14,20 Q14,14 15,10" stroke="#228B22" strokeWidth="0.5" fill="none" opacity="0.7" />
        <path d="M17,20 Q17,16 18,11" stroke="#32CD32" strokeWidth="0.5" fill="none" opacity="0.6" />
      </pattern>

      {/* Water texture */}
      <pattern id="water-texture" patternUnits="userSpaceOnUse" width="40" height="40">
        <rect width="40" height="40" fill="#4682B4" />
        <path d="M0,10 Q10,5 20,10 T40,10" stroke="#5F9EA0" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M0,20 Q10,15 20,20 T40,20" stroke="#87CEEB" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M0,30 Q10,25 20,30 T40,30" stroke="#5F9EA0" strokeWidth="1" fill="none" opacity="0.5" />
      </pattern>

      {/* Wood texture for structures */}
      <pattern id="wood-texture" patternUnits="userSpaceOnUse" width="60" height="20">
        <rect width="60" height="20" fill="#8B4513" />
        <rect x="0" y="0" width="60" height="1" fill="#6B3410" opacity="0.3" />
        <rect x="0" y="4" width="60" height="1" fill="#A0522D" opacity="0.4" />
        <rect x="0" y="8" width="60" height="1.5" fill="#6B3410" opacity="0.3" />
        <rect x="0" y="12" width="60" height="1" fill="#5D2F0B" opacity="0.5" />
        <rect x="0" y="16" width="60" height="1" fill="#7A3F11" opacity="0.4" />
        <ellipse cx="15" cy="10" rx="8" ry="3" fill="#654321" opacity="0.2" />
        <ellipse cx="45" cy="5" rx="6" ry="2" fill="#654321" opacity="0.15" />
      </pattern>

      {/* Compost texture */}
      <pattern id="compost-texture" patternUnits="userSpaceOnUse" width="30" height="30">
        <rect width="30" height="30" fill="#654321" />
        <circle cx="5" cy="5" r="2" fill="#8B4513" opacity="0.6" />
        <circle cx="15" cy="8" r="1.5" fill="#228B22" opacity="0.3" />
        <circle cx="25" cy="12" r="1" fill="#8B4513" opacity="0.5" />
        <circle cx="8" cy="18" r="2.5" fill="#556B2F" opacity="0.4" />
        <circle cx="20" cy="22" r="1.8" fill="#8B7355" opacity="0.5" />
        <circle cx="12" cy="25" r="1.2" fill="#228B22" opacity="0.3" />
      </pattern>

      {/* Brick/paver texture */}
      <pattern id="brick-texture" patternUnits="userSpaceOnUse" width="40" height="20">
        <rect width="40" height="20" fill="#CD5C5C" />
        <rect x="0" y="0" width="19" height="9" fill="#B22222" stroke="#8B1A1A" strokeWidth="1" />
        <rect x="21" y="0" width="19" height="9" fill="#B22222" stroke="#8B1A1A" strokeWidth="1" />
        <rect x="10" y="11" width="19" height="9" fill="#B22222" stroke="#8B1A1A" strokeWidth="1" />
        <rect x="-10" y="11" width="19" height="9" fill="#B22222" stroke="#8B1A1A" strokeWidth="1" />
        <rect x="31" y="11" width="19" height="9" fill="#B22222" stroke="#8B1A1A" strokeWidth="1" />
      </pattern>

      {/* Shadow filters */}
      <filter id="shadow-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.2" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="shadow-medium" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
        <feOffset dx="3" dy="3" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.3" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="shadow-hard" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="4" dy="4" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.4" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Elevation shadow for raised beds */}
      <filter id="bed-elevation" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
        <feOffset dx="0" dy="6" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.25" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Plant shadow */}
      <filter id="plant-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="1" dy="1" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.15" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Glow effect for selected items */}
      <filter id="selection-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Gradient definitions */}
      <linearGradient id="bed-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#654321" stopOpacity="0.9" />
      </linearGradient>

      <radialGradient id="pond-gradient">
        <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#4682B4" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#1E90FF" stopOpacity="1" />
      </radialGradient>

      <linearGradient id="greenhouse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#E0F4FF" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  )
}