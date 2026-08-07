import React from 'react';

interface InceptionLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showVersion?: boolean;
}

export const InceptionLogo: React.FC<InceptionLogoProps> = ({
  className = '',
  size = 'lg',
  showSubtitle = true,
  showVersion = true,
}) => {
  // Height options for the graphic symbol
  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-7 sm:h-8',
    lg: 'h-8 sm:h-11 lg:h-14',
    xl: 'h-11 sm:h-18 lg:h-22',
  }[size];

  // Font size options for the title
  const titleClasses = {
    sm: 'text-sm sm:text-lg',
    md: 'text-base sm:text-xl',
    lg: 'text-base sm:text-2xl lg:text-3xl',
    xl: 'text-xl sm:text-3xl lg:text-4xl',
  }[size];

  // Stylized E bar height options
  const eBarClasses = {
    sm: 'h-[12px] w-[8px]',
    md: 'h-[14px] w-[10px]',
    lg: 'h-[14px] sm:h-[20px] lg:h-[24px] w-[10px] sm:w-[14px] lg:w-[16px]',
    xl: 'h-[20px] sm:h-[26px] lg:h-[30px] w-[14px] sm:w-[18px] lg:w-[20px]',
  }[size];

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 select-none ${className}`}>
      {/* SVG Icon Graphic matching uploaded logo */}
      <svg
        viewBox="0 0 200 200"
        className={`${sizeClasses} w-auto drop-shadow-[0_0_14px_rgba(56,189,248,0.35)] shrink-0 transition-transform duration-300 hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="60%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="circuitGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="circuitGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Top Glowing Apex Dot */}
        <circle cx="100" cy="20" r="12" fill="url(#blueCyanGrad)" />
        <circle cx="100" cy="20" r="16" fill="url(#glowGrad)" opacity="0.6" />

        {/* Outer Chevron Frame (Letter A / I hybrid) */}
        {/* Right Wing (Blue Gradient) */}
        <path
          d="M104 36 L164 142 H128 L100 85 V56 Z"
          fill="url(#blueCyanGrad)"
        />

        {/* Left Wing (Purple/Blue Gradient) */}
        <path
          d="M96 36 L36 142 H72 L100 85 V56 Z"
          fill="url(#purpleBlueGrad)"
        />

        {/* Center Upward Arrow Shadow / Cutout */}
        <path
          d="M100 48 L116 88 H104 V108 H96 V88 H84 Z"
          fill="#0F172A"
          opacity="0.9"
        />
        <path
          d="M100 52 L112 84 H102 V104 H98 V84 H88 Z"
          fill="url(#blueCyanGrad)"
        />

        {/* Circuit Board Traces extending to the Left */}
        {/* Line 1 - Top */}
        <path d="M52 82 H32 L18 68 H8" stroke="url(#circuitGrad1)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="68" r="4" fill="#C084FC" />

        {/* Line 2 */}
        <path d="M46 96 H26 L14 84 H6" stroke="url(#circuitGrad1)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5" cy="84" r="4" fill="#A855F7" />

        {/* Line 3 */}
        <path d="M42 110 H22 L12 102 H4" stroke="url(#circuitGrad2)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="102" r="4" fill="#818CF8" />

        {/* Line 4 - Bottom */}
        <path d="M38 124 H18 L10 120 H4" stroke="url(#circuitGrad2)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="4" cy="120" r="4" fill="#38BDF8" />

        {/* Center Gear and Microchip Assembly */}
        <g transform="translate(100, 122)">
          {/* Outer Gear Ring */}
          <path
            d="M -18 0 A 18 18 0 1 0 18 0 A 18 18 0 1 0 -18 0"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            fill="none"
          />
          {/* Gear Teeth accents */}
          <rect x="-2" y="-21" width="4" height="4" fill="#38BDF8" rx="1" />
          <rect x="-2" y="17" width="4" height="4" fill="#38BDF8" rx="1" />
          <rect x="-21" y="-2" width="4" height="4" fill="#38BDF8" rx="1" />
          <rect x="17" y="-2" width="4" height="4" fill="#38BDF8" rx="1" />

          {/* Microchip Square */}
          <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#090D16" stroke="#38BDF8" strokeWidth="2" />
          <rect x="-5" y="-5" width="10" height="10" rx="1.5" fill="url(#blueCyanGrad)" />

          {/* Microchip Connector Pins */}
          <path d="M-7 -13 V-10 M0 -13 V-10 M7 -13 V-10" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-7 10 V13 M0 10 V13 M7 10 V13" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-13 -7 H-10 M-13 0 H-10 M-13 7 H-10" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 -7 H13 M10 0 H13 M10 7 H13" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>

      {/* Brand Typography & Subtitles */}
      <div className="flex flex-col justify-center">
        {/* Main Title: INCEPTION */}
        <div className="flex items-center">
          <span className={`${titleClasses} font-black tracking-[0.18em] text-white uppercase font-sans drop-shadow-md leading-none flex items-center`}>
            INCEPT
            {/* Stylized 'E' with 3 glowing cyan/purple horizontal bars */}
            <span className={`inline-flex flex-col justify-between ${eBarClasses} mx-[1.5px]`}>
              <span className="h-[25%] w-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.8)]"></span>
              <span className="h-[25%] w-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-[0_0_6px_rgba(99,102,241,0.8)]"></span>
              <span className="h-[25%] w-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.8)]"></span>
            </span>
            ION
          </span>
        </div>

        {/* Subtitle Line: IDEA TO INNOVATION */}
        {showSubtitle && (
          <div className="mt-0.5 w-full">
            <div className="flex items-center space-x-1.5 w-full">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-purple-500/80 to-blue-500/80"></div>
              <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-[0.24em] uppercase whitespace-nowrap drop-shadow-sm">
                IDEA TO INNOVATION
              </span>
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-blue-500/80 to-cyan-500/80"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
