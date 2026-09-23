import { useEffect, useRef, useState } from "react";

/*
  A hand-laid-out circuit schematic: a central node with right-angled
  PCB-style traces running out to labeled component nodes. Paths draw
  themselves on mount (stroke-dashoffset), then small signal pulses
  travel the traces on loop via native SVG <animateMotion>. This is the
  "unique tech-related animated thing" standing in for a generic 3D
  wireframe — cheap to render, on-theme for a blueprint/schematic
  aesthetic, and legible at a glance.
*/

const NODES = [
  { id: "react", label: "REACT", x: 90, y: 90, path: "M300,300 L300,180 L90,180 L90,90" },
  { id: "node", label: "NODE.JS", x: 510, y: 90, path: "M300,300 L300,180 L510,180 L510,90" },
  { id: "api", label: "API", x: 70, y: 320, path: "M300,300 L180,300 L180,320 L70,320" },
  { id: "db", label: "MONGODB", x: 530, y: 320, path: "M300,300 L420,300 L420,320 L530,320" },
  { id: "cloud", label: "CLOUD", x: 110, y: 500, path: "M300,300 L300,420 L110,420 L110,500" },
  { id: "ai", label: "AUTOMATION", x: 490, y: 500, path: "M300,300 L300,420 L490,420 L490,500" },
];

function TracePath({ d, delay, reduced }) {
  const ref = useRef(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
  }, []);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke="var(--brass)"
      strokeWidth="1"
      opacity="0.55"
      strokeDasharray={len}
      strokeDashoffset={reduced ? 0 : len}
      style={{
        animation: reduced ? "none" : `dash-draw 1.1s ease-out ${delay}s forwards`,
      }}
    />
  );
}

export default function SystemSchematic({ mouseRef, reduced = false }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (reduced) return;
    let raf;
    const tick = () => {
      if (wrapRef.current && mouseRef?.current) {
        const { x, y } = mouseRef.current;
        wrapRef.current.style.transform = `translate(${x * 10}px, ${-y * 10}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef, reduced]);

  return (
    <div ref={wrapRef} className="w-full h-full transition-transform duration-300 ease-out">
      <svg viewBox="0 0 600 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="presentation">
        {/* faint full grid confined to schematic bounds */}
        <rect x="40" y="40" width="520" height="520" fill="none" stroke="var(--hair)" strokeWidth="1" />

        {NODES.map((n, i) => (
          <g key={n.id}>
            <TracePath d={n.path} delay={0.15 + i * 0.09} reduced={reduced} />
            {!reduced && (
              <circle r="2.4" fill="var(--brass)">
                <animateMotion dur={`${3 + (i % 3)}s`} repeatCount="indefinite" path={n.path} begin={`${1.3 + i * 0.09}s`} />
              </circle>
            )}
          </g>
        ))}

        {/* Central node */}
        <g>
          <rect x="272" y="272" width="56" height="56" fill="var(--surface)" stroke="var(--brass)" strokeWidth="1.5" transform="rotate(45 300 300)" />
          <text x="300" y="296" textAnchor="middle" fontSize="10" fill="var(--text-hi)" fontFamily="JetBrains Mono, monospace">YASH</text>
          <text x="300" y="309" textAnchor="middle" fontSize="10" fill="var(--text-lo)" fontFamily="JetBrains Mono, monospace">JANI</text>
        </g>

        {/* Component nodes */}
        {NODES.map((n, i) => (
          <g key={`node-${n.id}`} opacity={reduced ? 1 : 0} style={reduced ? {} : { animation: `fadeInNode 0.4s ease-out ${1.1 + i * 0.09}s forwards` }}>
            <circle cx={n.x} cy={n.y} r="4" fill="var(--void)" stroke="var(--brass)" strokeWidth="1.5" />
            <text
              x={n.x}
              y={n.x < 300 ? n.y - 14 : n.y - 14}
              textAnchor={n.x < 250 ? "start" : n.x > 350 ? "end" : "middle"}
              fontSize="9.5"
              letterSpacing="1"
              fill="var(--text-lo)"
              fontFamily="JetBrains Mono, monospace"
            >
              {n.label}
            </text>
          </g>
        ))}

        <style>{`
          @keyframes fadeInNode { to { opacity: 1; } }
        `}</style>
      </svg>
    </div>
  );
}
