import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export interface WheelSegment {
  label: string;
  color: string;
}

interface WheelProps {
  segments: WheelSegment[];
  /** Index du segment sur lequel la roue doit s'arrêter. null = pas encore lancée. */
  target: number | null;
  onFinish?: (index: number) => void;
  size?: number;
}

const TURNS = 6; // tours complets avant de ralentir

/**
 * Roue de la fortune en SVG. Le résultat est décidé par l'appelant :
 * l'animation ne fait que s'arrêter au bon endroit, jamais l'inverse.
 */
const Wheel: React.FC<WheelProps> = ({ segments, target, onFinish, size = 300 }) => {
  const controls = useAnimationControls();
  const [spun, setSpun] = useState(false);
  const finished = useRef(false);

  const count = segments.length;
  const arc = 360 / count;
  const radius = size / 2;

  useEffect(() => {
    if (target === null || spun) return;
    setSpun(true);
    finished.current = false;

    // On amène le centre du segment visé sous le pointeur (en haut).
    const centre = target * arc + arc / 2;
    const angle = TURNS * 360 - centre;

    controls
      .start({
        rotate: angle,
        transition: { duration: 4.4, ease: [0.15, 0.85, 0.2, 1] },
      })
      .then(() => {
        if (!finished.current) {
          finished.current = true;
          onFinish?.(target);
        }
      });
  }, [target, spun, arc, controls, onFinish]);

  /** Coordonnées d'un point du cercle, en degrés. */
  const point = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [radius + r * Math.cos(rad), radius + r * Math.sin(rad)];
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Pointeur */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '13px solid transparent',
          borderRight: '13px solid transparent',
          borderTop: '24px solid #14432C',
        }}
        aria-hidden="true"
      />

      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        animate={controls}
        style={{ originX: '50%', originY: '50%' }}
        role="img"
        aria-label="Roue du tirage"
      >
        {segments.map((segment, i) => {
          const start = i * arc;
          const end = start + arc;
          const [x1, y1] = point(start, radius - 6);
          const [x2, y2] = point(end, radius - 6);
          const large = arc > 180 ? 1 : 0;
          const mid = start + arc / 2;
          const [tx, ty] = point(mid, radius * 0.62);
          // Dans la moitié basse, on retourne le texte pour qu'il reste lisible.
          const flip = mid > 90 && mid < 270;

          return (
            <g key={`${segment.label}-${i}`}>
              <path
                d={`M ${radius} ${radius} L ${x1} ${y1} A ${radius - 6} ${radius - 6} 0 ${large} 1 ${x2} ${y2} Z`}
                fill={segment.color}
                stroke="#FFFDF7"
                strokeWidth={3}
              />
              <text
                x={tx}
                y={ty}
                fill="#FFFFFF"
                fontSize={count > 8 ? 11 : 13}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${flip ? mid + 180 : mid}, ${tx}, ${ty})`}
                style={{ pointerEvents: 'none' }}
              >
                {segment.label.length > 14 ? `${segment.label.slice(0, 13)}…` : segment.label}
              </text>
            </g>
          );
        })}

        <circle cx={radius} cy={radius} r={radius - 3} fill="none" stroke="#14432C" strokeWidth={6} />
        <circle cx={radius} cy={radius} r={26} fill="#FFFDF7" stroke="#14432C" strokeWidth={5} />
      </motion.svg>
    </div>
  );
};

export default Wheel;
