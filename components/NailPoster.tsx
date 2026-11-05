import { useId } from "react";

/**
 * Static SVG nail. Shown while the 3D canvas loads, and as the permanent
 * visual when WebGL is unavailable or the visitor prefers reduced motion.
 * `fill` (0–1) paints the nail from the cuticle up, like the scroll moment.
 */
export function NailPoster({
  color,
  fill = 1,
  metallic = false,
  className = "",
}: {
  color: string;
  fill?: number;
  metallic?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const clipY = 160 - 160 * fill;
  return (
    <svg viewBox="0 0 100 160" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`nail-${id}`}>
          <path d="M50 2C76 22 98 62 98 104c0 31-21 54-48 54S2 135 2 104C2 62 24 22 50 2Z" />
        </clipPath>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity={metallic ? 0.35 : 0.12} />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#nail-${id})`}>
        <rect width="100" height="160" fill="#E6B4A8" />
        <rect y={clipY} width="100" height="160" fill={color} />
        <rect width="100" height="160" fill={`url(#shine-${id})`} />
        <path
          d="M30 34C24 50 21 70 21 90"
          stroke="#fff"
          strokeOpacity="0.75"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
