import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, accent, subtitle, align = "left", index }) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={`flex flex-col ${alignClass} mb-16`}
    >
      <div className="flex items-center gap-3 mb-4">
        {index && <span className="font-mono-label text-xs text-[--brass]">{index}</span>}
        {eyebrow && (
          <span className="font-mono-label text-[11px] tracking-[0.25em] text-[--text-lo] uppercase">
            // {eyebrow}
          </span>
        )}
      </div>
      <h2 className="font-display font-black leading-[0.95] text-[--text-hi]" style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}>
        {title} {accent && <span className="text-[--brass] italic">{accent}</span>}
      </h2>
      {subtitle && <p className="mt-4 text-[--text-lo] max-w-xl">{subtitle}</p>}
    </motion.div>
  );
}
