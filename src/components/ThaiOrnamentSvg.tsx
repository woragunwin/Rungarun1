import React from 'react';

export const ThaiKanokCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = 'w-14 h-14 text-[#B47B1A]' }) => {
  const transforms: Record<typeof position, string> = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  };

  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g transform={transforms[position]} style={{ transformOrigin: '40px 40px' }}>
        {/* Outer L-frame lines */}
        <path
          d="M6 74 L6 10 Q6 6 10 6 L74 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M11 66 L11 13 Q11 11 13 11 L66 11"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.7"
        />
        {/* Traditional Lai Kanok flame scroll */}
        <path
          d="M14 48 C14 34, 21 26, 28 24 C22 30, 22 38, 26 42 C19 42, 16 45, 14 48 Z"
          fill="currentColor"
          opacity="0.82"
        />
        <path
          d="M48 14 C34 14, 26 21, 24 28 C30 22, 38 22, 42 26 C42 19, 45 16, 48 14 Z"
          fill="currentColor"
          opacity="0.82"
        />
        <path
          d="M15 26 C18 18, 26 15, 34 15 C27 18, 22 23, 21 31 C18 29, 16 28, 15 26 Z"
          fill="currentColor"
          opacity="0.55"
        />
        {/* Corner Pracham Yam diamond */}
        <path
          d="M16 11 L21 16 L16 21 L11 16 Z"
          fill="#8C2D19"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <circle cx="16" cy="16" r="1.6" fill="#FBF8F1" />
      </g>
    </svg>
  );
};

export const ThaiPrachamYamDivider: React.FC<{ className?: string }> = ({
  className = 'w-full max-w-md mx-auto h-7 text-[#B47B1A]',
}) => {
  return (
    <svg
      viewBox="0 0 420 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* Left filigree line */}
      <line x1="8" y1="16" x2="148" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M120 16 C128 11, 136 11, 144 16 C136 21, 128 21, 120 16 Z" fill="currentColor" opacity="0.35" />

      {/* Center Lai Pracham Yam & Krachang lotus motif */}
      <g transform="translate(210, 16)">
        {/* Side petals */}
        <path
          d="M-54 0 C-44 -7, -34 -7, -26 0 C-34 7, -44 7, -54 0 Z"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M54 0 C44 -7, 34 -7, 26 0 C34 7, 44 7, 54 0 Z"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Kanok curls */}
        <path
          d="M-24 0 C-20 -10, -10 -12, -5 -6 C-11 -6, -15 -3, -16 0 C-15 3, -11 6, -5 6 C-10 12, -20 10, -24 0 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M24 0 C20 -10, 10 -12, 5 -6 C11 -6, 15 -3, 16 0 C15 3, 11 6, 5 6 C10 12, 20 10, 24 0 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Central diamond lotus */}
        <path
          d="M0 -11 L10 0 L0 11 L-10 0 Z"
          fill="#FBF8F1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M0 -6 L6 0 L0 6 L-6 0 Z" fill="#8C2D19" />
        <circle cx="0" cy="0" r="1.8" fill="#F2D078" />
      </g>

      {/* Right filigree line */}
      <path d="M300 16 C292 11, 284 11, 276 16 C284 21, 292 21, 300 16 Z" fill="currentColor" opacity="0.35" />
      <line x1="272" y1="16" x2="412" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    </svg>
  );
};

export const ThaiPhraPhromHalo: React.FC<{ className?: string }> = ({
  className = 'w-56 h-56 sm:w-60 sm:h-60 text-[#C99B3B]',
}) => {
  const petals = Array.from({ length: 16 }, (_, idx) => idx * 22.5);
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="120" cy="120" r="112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
      <circle cx="120" cy="120" r="102" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      {petals.map((deg) => (
        <g key={deg} transform={`translate(120, 120) rotate(${deg})`}>
          <path
            d="M0 -114 C4 -108, 5 -104, 0 -101 C-5 -104, -4 -108, 0 -114 Z"
            fill="currentColor"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
};
