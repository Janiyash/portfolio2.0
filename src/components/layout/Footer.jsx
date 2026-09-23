import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const socials = [
  {
    icon: FaGithub,
    href: "https://github.com/janiyash",
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/jani-yash001/",
    label: "LinkedIn",
  },
  {
    icon: MdEmail,
    href: "mailto:janiyash0911@gmail.com",
    label: "Email",
  },
];

function SocialIcon({ icon: Icon, href, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -3 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      className="group flex h-9 w-9 items-center justify-center border transition-all duration-200"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(180,140,70,0.5)";
        e.currentTarget.style.background = "rgba(180,140,70,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <Icon
        size={15}
        className="text-[--text-lo] transition-colors duration-200 group-hover:text-[--brass]"
      />
    </motion.a>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[--void]">
      {/* Top border — animated brass gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true }}
        className="h-px w-full origin-left"
        style={{
          background:
            "linear-gradient(90deg, var(--brass) 0%, rgba(180,140,70,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[200px] w-[500px]"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(180,140,70,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Footer content */}
      <div className="relative w-full px-6 py-10 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">

          {/* ==================== BRAND ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2"
          >
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="group flex w-fit items-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 bg-[--brass] transition-transform duration-300 group-hover:scale-125"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              />

              <span className="font-display text-2xl font-black tracking-tight text-[--text-hi]">
                YJ<span className="text-[--brass]">.DEV</span>
              </span>
            </button>

            <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-[--text-lo]">
              Full-stack developer
            </p>
          </motion.div>

          {/* ==================== COPYRIGHT ==================== */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className="font-mono-label text-center text-[12px] uppercase tracking-[0.15em] text-[--text-lo]"
          >
            © 2026{" "}
            <span className="text-[--brass]">Yash Jani</span>{" "}
            · All rights reserved
          </motion.p>

          {/* ==================== SOCIAL ICONS ==================== */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2.5 sm:justify-end"
          >
            {socials.map((social) => (
              <SocialIcon
                key={social.label}
                {...social}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </footer>
  );
}