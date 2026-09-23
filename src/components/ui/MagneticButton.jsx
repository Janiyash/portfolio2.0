import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ as = "a", children, className = "", strength = 0.3, cursorLabel, ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const Component = motion[as] || motion.a;

  return (
    <Component
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={className}
      data-cursor="hover"
      {...props}
    >
      {children}
    </Component>
  );
}
