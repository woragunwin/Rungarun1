import React from 'react';
import { motion } from 'motion/react';
import { BEAD_COUNT, FlowerType, GARLAND_STYLES, GarlandStyleId } from '../types';

interface FlowerNodeProps {
  type: FlowerType;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}

export const FlowerBeadNode: React.FC<FlowerNodeProps> = ({
  type,
  x = 0,
  y = 0,
  scale = 1,
  rotation = 0,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {type === 'jasmine_double' && (
        <g>
          <circle r="13.5" fill="#EDE4CE" opacity="0.55" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-6.5"
              rx="4.2"
              ry="6.6"
              transform={`rotate(${deg})`}
              fill="#FFFFFF"
              stroke="#DFD4BE"
              strokeWidth="0.7"
            />
          ))}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-4.2"
              rx="3.1"
              ry="4.8"
              transform={`rotate(${deg})`}
              fill="#FFFDF8"
              stroke="#EAE0CA"
              strokeWidth="0.6"
            />
          ))}
          <circle r="3.2" fill="#F2DF9F" stroke="#D1B25D" strokeWidth="0.6" />
          <circle r="1.3" fill="#FFF8E1" />
        </g>
      )}

      {type === 'jasmine_bud' && (
        <g>
          <path
            d="M0,-14 C5.5,-7 6.5,2 0,8 C-6.5,2 -5.5,-7 0,-14 Z"
            fill="#FFFFFF"
            stroke="#D6CEB8"
            strokeWidth="0.8"
          />
          <path
            d="M0,-12 C3,-6 3.5,1 0,6 C-3.5,1 -3,-6 0,-12 Z"
            fill="#F9F6EE"
          />
          <path
            d="M-4.5,5.5 Q0,11 4.5,5.5 Q2,8 0,11.5 Q-2,8 -4.5,5.5 Z"
            fill="#5D8751"
            stroke="#3E5F35"
            strokeWidth="0.6"
          />
        </g>
      )}

      {type === 'crown_white' && (
        <g>
          <circle r="12" fill="#E8E1F0" opacity="0.4" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0,-12.5 L3.3,-4 L0,-1 L-3.3,-4 Z"
              transform={`rotate(${deg})`}
              fill="#FAF7FD"
              stroke="#CFC2DE"
              strokeWidth="0.75"
            />
          ))}
          <circle r="4.2" fill="#ECE4F5" stroke="#B7A3CE" strokeWidth="0.7" />
          <circle r="1.8" fill="#D5C4EA" />
        </g>
      )}

      {type === 'crown_purple' && (
        <g>
          <circle r="12" fill="#9E7BBF" opacity="0.25" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <path
              key={deg}
              d="M0,-12.5 L3.6,-4 L0,-1 L-3.6,-4 Z"
              transform={`rotate(${deg})`}
              fill="#BA9AE0"
              stroke="#7B55A8"
              strokeWidth="0.75"
            />
          ))}
          <circle r="4.3" fill="#8C67BA" stroke="#644191" strokeWidth="0.7" />
          <circle r="1.8" fill="#E7D8F9" />
        </g>
      )}

      {type === 'rose_petal' && (
        <g>
          <circle r="13" fill="#A52A3B" opacity="0.2" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-6"
              rx="6.2"
              ry="6.6"
              transform={`rotate(${deg})`}
              fill="#CF4B5D"
              stroke="#912636"
              strokeWidth="0.7"
            />
          ))}
          {[30, 102, 174, 246, 318].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-3.6"
              rx="4.4"
              ry="4.8"
              transform={`rotate(${deg})`}
              fill="#DF6474"
              stroke="#9D2D3D"
              strokeWidth="0.6"
            />
          ))}
          <circle r="3.2" fill="#8C2332" />
          <path d="M-2,0 Q0,-2.5 2,0 Q0,2 -2,0 Z" fill="#F29AA6" opacity="0.6" />
        </g>
      )}

      {type === 'marigold' && (
        <g>
          <circle r="13.5" fill="#D98218" opacity="0.22" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-7"
              rx="3.4"
              ry="6.4"
              transform={`rotate(${deg})`}
              fill="#F2A922"
              stroke="#BD720B"
              strokeWidth="0.6"
            />
          ))}
          {[15, 60, 105, 150, 195, 240, 285, 330].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-4.2"
              rx="2.8"
              ry="4.8"
              transform={`rotate(${deg})`}
              fill="#FAC748"
              stroke="#C97E10"
              strokeWidth="0.5"
            />
          ))}
          <circle r="3.4" fill="#B86209" />
          <circle r="1.4" fill="#FDE08D" />
        </g>
      )}
    </g>
  );
};

export const FlowerBeadIcon: React.FC<{ type: FlowerType; size?: number }> = ({
  type,
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-18 -18 36 36"
      aria-hidden="true"
      className="shrink-0"
    >
      <FlowerBeadNode type={type} scale={1.08} />
    </svg>
  );
};

// Coordinates along a graceful teardrop/loop garland path (12 positions)
const LOOP_SLOTS: Array<{ x: number; y: number; rot: number }> = [
  { x: 168, y: 86, rot: -38 },
  { x: 136, y: 122, rot: -52 },
  { x: 118, y: 168, rot: -74 },
  { x: 122, y: 218, rot: -102 },
  { x: 146, y: 262, rot: -130 },
  { x: 184, y: 290, rot: -158 },
  { x: 236, y: 290, rot: 158 },
  { x: 274, y: 262, rot: 130 },
  { x: 298, y: 218, rot: 102 },
  { x: 302, y: 168, rot: 74 },
  { x: 284, y: 122, rot: 52 },
  { x: 252, y: 86, rot: 38 },
];

interface InteractiveThreadingCordProps {
  styleId: GarlandStyleId;
  flowers: FlowerType[];
  onSlotHintClick?: (index: number) => void;
}

export const InteractiveThreadingCord: React.FC<InteractiveThreadingCordProps> = ({
  styleId,
  flowers,
}) => {
  const styleInfo = GARLAND_STYLES.find((s) => s.id === styleId) || GARLAND_STYLES[0];
  const isComplete = flowers.length === BEAD_COUNT;
  const activeIndex = flowers.length < BEAD_COUNT ? flowers.length : -1;

  return (
    <svg
      viewBox="0 0 420 420"
      className="w-full max-w-[380px] h-auto mx-auto select-none"
      role="img"
      aria-label={`พวงมาลัยที่กำลังร้อย ร้อยแล้ว ${flowers.length} จาก ${BEAD_COUNT} ดอก`}
    >
      <defs>
        <radialGradient id="garlandBackdropGlow" cx="50%" cy="48%" r="48%">
          <stop offset="0%" stopColor="#F5E8C8" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#FAF4E6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FBF8F1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldSilkCord" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C775" />
          <stop offset="50%" stopColor={styleInfo.cordColor} />
          <stop offset="100%" stopColor="#8F6722" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="200" r="175" fill="url(#garlandBackdropGlow)" />

      {/* Decorative top Thai crown bow & hanging loop */}
      <path
        d="M210,18 L210,48"
        stroke="#B47B1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="210" cy="18" r="5" fill="#D4A338" stroke="#8C5F12" strokeWidth="1.2" />

      {/* Main ceremonial silk string loop */}
      <path
        d="M210,56 C160,64 114,122 116,192 C118,262 164,302 210,302 C256,302 302,262 304,192 C306,122 260,64 210,56 Z"
        fill="none"
        stroke="url(#goldSilkCord)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      {/* Subtle inner thread highlight */}
      <path
        d="M210,56 C160,64 114,122 116,192 C118,262 164,302 210,302 C256,302 302,262 304,192 C306,122 260,64 210,56 Z"
        fill="none"
        stroke="#FFF6DF"
        strokeWidth="1.1"
        strokeDasharray="4 4"
        opacity="0.7"
      />

      {/* Top floral knot (ริบบิ้นทองและโบว์ใบแก้ว) */}
      <g transform="translate(210, 56)">
        <path
          d="M-24,-10 C-14,-20 -4,-6 0,0 C4,-6 14,-20 24,-10 C18,2 8,6 0,2 C-8,6 -18,2 -24,-10 Z"
          fill="#4A7C44"
          stroke="#2E5429"
          strokeWidth="1"
        />
        <path
          d="M-16,-6 C-9,-14 -3,-4 0,0 C3,-4 9,-14 16,-6 C12,3 5,4 0,2 C-5,4 -12,3 -16,-6 Z"
          fill="#D4A037"
          stroke="#8F6516"
          strokeWidth="1"
        />
        <circle r="6" fill="#F2D078" stroke="#9B6E18" strokeWidth="1" />
      </g>

      {/* Bottom Ubaa tassels (อุบะพวงมาลัย) — faint preview until complete, lush once complete */}
      <g opacity={isComplete ? 1 : 0.28} className="transition-opacity duration-300">
        {styleId === 'song_chai' ? (
          <>
            {/* Two long ceremonial tails for Malai Song Chai */}
            {[-26, 0, 26].map((offset, idx) => (
              <g key={offset} transform={`translate(${210 + offset}, 302)`}>
                <line
                  x1="0"
                  y1="0"
                  x2={offset * 0.25}
                  y2={idx === 1 ? 82 : 68}
                  stroke="#C99B3B"
                  strokeWidth="2"
                />
                <circle cx={offset * 0.08} cy="16" r="5" fill="#FFFFFF" stroke="#DDD2BA" strokeWidth="0.7" />
                <circle cx={offset * 0.14} cy="30" r="5" fill="#CF4B5D" stroke="#912636" strokeWidth="0.7" />
                <circle cx={offset * 0.18} cy="44" r="4.8" fill="#FFFFFF" stroke="#DDD2BA" strokeWidth="0.7" />
                <path
                  d={`M${offset * 0.24 - 5},${idx === 1 ? 66 : 54} Q${offset * 0.25},${idx === 1 ? 94 : 80} ${offset * 0.26 + 5},${idx === 1 ? 66 : 54} Z`}
                  fill="#D98218"
                  stroke="#9C5708"
                  strokeWidth="0.8"
                />
              </g>
            ))}
          </>
        ) : (
          <>
            {[-16, 0, 16].map((offset, idx) => (
              <g key={offset} transform={`translate(${210 + offset}, 302)`}>
                <line
                  x1="0"
                  y1="0"
                  x2={offset * 0.15}
                  y2={idx === 1 ? 74 : 58}
                  stroke={styleInfo.cordColor}
                  strokeWidth="2"
                />
                <circle cx={offset * 0.05} cy="15" r="4.6" fill="#FFFFFF" stroke="#DDD2BA" strokeWidth="0.7" />
                <circle cx={offset * 0.1} cy="29" r="4.6" fill={styleInfo.tasselColor} stroke="#C7B99D" strokeWidth="0.7" />
                <path
                  d={`M${offset * 0.15 - 4.5},${idx === 1 ? 56 : 42} Q${offset * 0.15},${idx === 1 ? 82 : 66} ${offset * 0.15 + 4.5},${idx === 1 ? 56 : 42} Z`}
                  fill={styleId === 'dao_ruang_thong' ? '#F2A922' : '#FFFFFF'}
                  stroke="#C9B99B"
                  strokeWidth="0.8"
                />
              </g>
            ))}
          </>
        )}
        {/* Green jasmine leaf clasp at base */}
        <path
          d="M192,298 Q210,316 228,298 Q210,305 192,298 Z"
          fill="#4A7C44"
          stroke="#2E5429"
          strokeWidth="0.8"
        />
      </g>

      {/* 12 Bead Slots along the string */}
      {LOOP_SLOTS.map((slot, idx) => {
        const flower = flowers[idx];
        const isNext = idx === activeIndex;
        const entryOrigin = idx === 0 ? { x: 210, y: 56 } : LOOP_SLOTS[idx - 1];
        const slideFromX = (entryOrigin.x - slot.x) * 0.72;
        const slideFromY = (entryOrigin.y - slot.y) * 0.72;

        if (flower) {
          return (
            <g key={`bead-${idx}-${flower}`}>
              {/* Subtle golden settle halo when flower locks onto the twine */}
              <motion.circle
                cx={slot.x}
                cy={slot.y}
                r={15}
                fill="none"
                stroke="#D4A037"
                strokeWidth={1.6}
                initial={{ opacity: 0.85, scale: 0.75 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${slot.x}px ${slot.y}px` }}
              />
              {/* Flower sliding smoothly down the twine into its slot */}
              <motion.g
                initial={{ opacity: 0, x: slideFromX, y: slideFromY, scale: 0.55 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${slot.x}px ${slot.y}px` }}
              >
                <FlowerBeadNode
                  type={flower}
                  x={slot.x}
                  y={slot.y}
                  scale={1.38}
                  rotation={slot.rot * 0.18}
                />
              </motion.g>
            </g>
          );
        }

        return (
          <g key={`slot-${idx}`} transform={`translate(${slot.x}, ${slot.y})`}>
            {isNext && (
              <motion.circle
                r="17"
                fill="none"
                stroke="#B47B1A"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                initial={{ opacity: 0.5, scale: 0.92 }}
                animate={{ opacity: 0.95, scale: 1.06 }}
                transition={{ duration: 0.9, repeat: Infinity, repeatType: 'reverse' }}
              />
            )}
            <circle
              r="11"
              fill={isNext ? '#FFF8E6' : '#FBF8F1'}
              stroke={isNext ? '#B47B1A' : '#D5C9B0'}
              strokeWidth={isNext ? '1.8' : '1.1'}
              strokeDasharray={isNext ? undefined : '2.5 2.5'}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight={isNext ? '600' : '400'}
              fill={isNext ? '#8C5A0B' : '#9C8E78'}
            >
              {idx + 1}
            </text>
          </g>
        );
      })}

      {/* Golden Threading Needle gliding to active slot */}
      {activeIndex >= 0 && (
        <motion.g
          animate={{
            x: LOOP_SLOTS[activeIndex].x,
            y: LOOP_SLOTS[activeIndex].y - 26,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <line
            x1="0"
            y1="-14"
            x2="0"
            y2="8"
            stroke="#9B6E18"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <polygon points="-2.5,6 2.5,6 0,13" fill="#B47B1A" />
          <ellipse cx="0" cy="-15" rx="2.2" ry="3.2" fill="none" stroke="#9B6E18" strokeWidth="1.4" />
        </motion.g>
      )}
    </svg>
  );
};

interface MiniGarlandBadgeProps {
  styleId: GarlandStyleId;
  flowers: FlowerType[];
  size?: number;
}

export const MiniGarlandBadge: React.FC<MiniGarlandBadgeProps> = ({
  styleId,
  flowers,
  size = 86,
}) => {
  const styleInfo = GARLAND_STYLES.find((s) => s.id === styleId) || GARLAND_STYLES[0];
  const displayFlowers = flowers.length > 0 ? flowers : styleInfo.recommendedFlowers;

  return (
    <svg
      width={size}
      height={size}
      viewBox="60 25 300 365"
      aria-label={styleInfo.name}
      className="shrink-0"
    >
      <path
        d="M210,56 C160,64 114,122 116,192 C118,262 164,302 210,302 C256,302 302,262 304,192 C306,122 260,64 210,56 Z"
        fill="none"
        stroke={styleInfo.cordColor}
        strokeWidth="4"
      />
      <g transform="translate(210, 56)">
        <circle r="7" fill="#D4A037" stroke="#8F6516" strokeWidth="1" />
      </g>
      {[-14, 0, 14].map((offset, idx) => (
        <g key={offset} transform={`translate(${210 + offset}, 302)`}>
          <line
            x1="0"
            y1="0"
            x2={offset * 0.15}
            y2={idx === 1 ? 64 : 50}
            stroke={styleInfo.cordColor}
            strokeWidth="2"
          />
          <circle cx={offset * 0.08} cy="22" r="4.5" fill={styleInfo.tasselColor} stroke="#C7B99D" strokeWidth="0.6" />
          <path
            d={`M${offset * 0.15 - 4},${idx === 1 ? 48 : 36} Q${offset * 0.15},${idx === 1 ? 72 : 58} ${offset * 0.15 + 4},${idx === 1 ? 48 : 36} Z`}
            fill={styleId === 'dao_ruang_thong' ? '#F2A922' : '#D98218'}
          />
        </g>
      ))}
      {LOOP_SLOTS.map((slot, idx) => {
        const flower = displayFlowers[idx % displayFlowers.length];
        return (
          <FlowerBeadNode
            key={idx}
            type={flower}
            x={slot.x}
            y={slot.y}
            scale={1.32}
          />
        );
      })}
    </svg>
  );
};

export const HeroGarlandPair: React.FC = () => {
  const leftFlowers = GARLAND_STYLES[0].recommendedFlowers;
  const rightFlowers = GARLAND_STYLES[2].recommendedFlowers;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8" aria-hidden="true">
      <div className="transform -rotate-6 transition-transform duration-500 hover:rotate-0">
        <MiniGarlandBadge styleId="song_chai" flowers={leftFlowers} size={132} />
      </div>
      <div className="transform rotate-6 transition-transform duration-500 hover:rotate-0">
        <MiniGarlandBadge styleId="dao_ruang_thong" flowers={rightFlowers} size={132} />
      </div>
    </div>
  );
};
