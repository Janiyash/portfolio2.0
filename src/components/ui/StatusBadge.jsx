export default function StatusBadge({ children, color = "var(--brass)", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 border font-mono-label text-[10px] tracking-[0.2em] uppercase ${className}`}
      style={{ borderColor: color, color }}
    >
      <span className="w-1.5 h-1.5 animate-pulse" style={{ background: color }} />
      {children}
    </span>
  );
}
