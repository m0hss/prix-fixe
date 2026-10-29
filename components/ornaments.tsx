/* Decorative SVGs and icons. Colors come from currentColor or theme utilities. */

type SvgProps = { className?: string };

/** Monogram crest: a double ring, a laurel and the house initials. */
export function Crest({ monogram, className }: { monogram: string } & SvgProps) {
  // Laurel: leaves along the lower arc, tilted toward the top of the crest.
  const r = 32.5;
  const leaves = (side: 1 | -1) =>
    Array.from({ length: 7 }, (_, i) => {
      const phi = 100 + i * 12; // degrees along the circle; 90 is the bottom
      const out = i % 2 === 0 ? 1 : -1; // alternate leaves either side of the stem
      const rad = (phi * Math.PI) / 180;
      const rr = r + out * 2.2;
      const x = 48 - side * Math.cos(rad) * rr;
      const y = 48 + Math.sin(rad) * rr;
      const along = 90 - phi; // direction the stem grows, in screen degrees
      const tilt = along + out * 32;
      const rot = side === 1 ? tilt : 180 - tilt;
      return (
        <ellipse
          key={`${side}-${i}`}
          cx={x.toFixed(2)}
          cy={y.toFixed(2)}
          rx="3.6"
          ry="1.4"
          transform={`rotate(${rot.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})`}
        />
      );
    });
  const arc = (side: 1 | -1) => {
    const a = (95 * Math.PI) / 180;
    const b = (180 * Math.PI) / 180;
    const p = (t: number) => [48 - side * Math.cos(t) * r, 48 + Math.sin(t) * r].map((n) => n.toFixed(2)).join(" ");
    return `M${p(a)} A${r} ${r} 0 0 ${side === 1 ? 0 : 1} ${p(b)}`;
  };

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke="currentColor" className="text-rule">
        <circle cx="48" cy="48" r="45" strokeWidth="1.5" />
        <circle cx="48" cy="48" r="40.5" strokeWidth="0.75" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="0.6" className="text-rule">
        <path d={arc(1)} />
        <path d={arc(-1)} />
      </g>
      <g className="fill-rule">
        {leaves(1)}
        {leaves(-1)}
      </g>
      <path className="fill-rule" d="M48 10.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
      <text
        x="48"
        y="60"
        textAnchor="middle"
        className="fill-ink"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, fontSize: 36 }}
      >
        {monogram}
      </text>
    </svg>
  );
}

/** Section ornament: two rules around a lozenge. */
export function Ornament({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" focusable="false" className={className}>
      <g className="text-rule">
        <path d="M2 6h44M74 6h44" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="51.5" cy="6" r="1.4" fill="currentColor" />
        <circle cx="68.5" cy="6" r="1.4" fill="currentColor" />
        <path d="M60 1.2 64.8 6 60 10.8 55.2 6Z" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Chef's toque, used for the recommendation mark. */
export function Toque({ className }: SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M7 14.5c-2.3-.4-3.8-2.3-3.5-4.5.3-2.1 2.3-3.6 4.4-3.3C8.6 4.6 10.2 3.5 12 3.5s3.4 1.1 4.1 3.2c2.1-.3 4.1 1.2 4.4 3.3.3 2.2-1.2 4.1-3.5 4.5" />
      <path d="M7 12.5V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6.5" />
      <path d="M7 16.5h10" />
    </svg>
  );
}

function Icon({ d, className }: { d: string } & SvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

export const PlusIcon = ({ className }: SvgProps) => <Icon d="M12 5v14M5 12h14" className={className} />;
export const MinusIcon = ({ className }: SvgProps) => <Icon d="M5 12h14" className={className} />;
export const CloseIcon = ({ className }: SvgProps) => <Icon d="M6 6l12 12M18 6 6 18" className={className} />;
export const CheckIcon = ({ className }: SvgProps) => <Icon d="M5 12.5l4.5 4.5L19 7.5" className={className} />;
export const ArrowIcon = ({ className }: SvgProps) => <Icon d="M5 12h14M13 6l6 6-6 6" className={className} />;
