import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const svgs = [
  "/svgs/ai_1.svg",
  "/svgs/ai_2.svg",
  "/svgs/ai_3.svg",
  "/svgs/ai_4.svg",
  "/svgs/ai_5.svg",
];

const fastRandomInterval = () => Math.floor(Math.random() * 500) + 500;

const AnimatedAiLogo = ({ width = 32, height = 32, className = "" }) => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateImage = () => {
      setIndex((prev) => (prev + 1) % svgs.length);
      timeoutRef.current = setTimeout(updateImage, fastRandomInterval());
    };

    updateImage();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ width, height }} className={className}>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={svgs[index]}
          alt="Animated AI Logo"
          width={width}
          height={height}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          style={{ width, height }}
        />
      </AnimatePresence>
    </div>
  );
};

export default AnimatedAiLogo;
