import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showWordmark = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#101629] to-[#080B14] p-0.5 border border-white/10 shadow-lg shadow-[#287BFF]/10 flex items-center justify-center overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#287BFF]/20 to-[#8955FF]/20 opacity-80 group-hover:opacity-100 transition-opacity" />
        <svg viewBox="0 0 32 32" fill="none" className="w-5/6 h-5/6 relative z-10">
          <path
            d="M8 24V8L24 24V8"
            stroke="url(#nexora-n-gradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="8" r="2.2" fill="#287BFF" />
          <circle cx="24" cy="24" r="2.2" fill="#8955FF" />
          <defs>
            <linearGradient id="nexora-n-gradient" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#287BFF" />
              <stop offset="1" stopColor="#8955FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showWordmark && (
        <span className={`font-bold tracking-tight text-white dark:text-white text-slate-900 ${textSizes[size]} whitespace-nowrap`}>
          NEXORA <span className="font-medium text-[#287BFF]">Intelligence</span>
        </span>
      )}
    </div>
  );
};
