import React from 'react';

export const GoldBucket: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`} title="Yaeger's Bucket">
      {/* SVG Container for the 3D Gold Bucket */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl filter"
        style={{ filter: "drop-shadow(0 10px 15px rgba(234, 179, 8, 0.3))" }}
      >
        <defs>
          {/* Gold Gradient for the main body */}
          <linearGradient id="goldBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A16207" />
            <stop offset="20%" stopColor="#FACC15" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="80%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
          
          {/* Inner rim gradient (darker to show depth) */}
          <linearGradient id="goldInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Handle gradient */}
          <linearGradient id="handleSilver" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Handle (Back part) */}
        <path 
          d="M 40 60 C 40 10, 160 10, 160 60" 
          stroke="url(#handleSilver)" 
          strokeWidth="12" 
          strokeLinecap="round"
          fill="none" 
        />

        {/* Bucket Back Inner Rim */}
        <ellipse cx="100" cy="60" rx="70" ry="15" fill="url(#goldInner)" />

        {/* Bucket Body */}
        <path 
          d="M 30 60 L 50 170 C 50 185, 150 185, 150 170 L 170 60 Z" 
          fill="url(#goldBody)" 
        />
        
        {/* Bucket Front Rim (The Lip) */}
        <path 
          d="M 30 60 C 30 75, 170 75, 170 60 C 170 55, 160 50, 150 48 L 50 48 C 40 50, 30 55, 30 60" 
          fill="url(#goldBody)" 
          opacity="0.9"
        />

        {/* Shine/Reflection */}
        <path 
          d="M 60 70 L 65 160 C 65 160, 80 160, 85 70" 
          fill="white" 
          fillOpacity="0.2" 
          style={{ mixBlendMode: 'overlay' }} 
        />
      </svg>
    </div>
  );
};