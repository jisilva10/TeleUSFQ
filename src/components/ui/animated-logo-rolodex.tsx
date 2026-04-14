import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

if (typeof motion === 'undefined') {
  throw new Error("FATAL: 'motion' object from framer-motion is UNDEFINED. SystemJS import failed.");
}
const MotionDiv = motion.div || (typeof motion === "function" ? motion("div") : null);

if (!MotionDiv) {
  throw new Error("FATAL: 'motion.div' and 'motion(\"div\")' are both undefined. TV JS engine unsupported.");
}

const DELAY_IN_MS = 2500;
const TRANSITION_DURATION_IN_SECS = 1.5;

export const LogoRolodex = ({ items }: { items: React.ReactNode[] }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((pv) => pv + 1);
    }, DELAY_IN_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        transform: "rotateY(-20deg)",
        transformStyle: "preserve-3d",
      }}
      className="relative z-0 h-44 w-60 shrink-0 rounded-xl overflow-hidden shadow-xl bg-white border-2 border-white/20"
    >
      <AnimatePresence mode="sync">
        <MotionDiv
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            zIndex: -index,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
            backgroundColor: "#ffffff",
          }}
          key={index}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          initial={{ rotateX: "0deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "-180deg" }}
          className="absolute left-1/2 top-1/2 w-full h-full"
        >
          {items[index % items.length]}
        </MotionDiv>
        <MotionDiv
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            zIndex: index,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
            backgroundColor: "#ffffff",
          }}
          key={(index + 1) * 2}
          initial={{ rotateX: "180deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "0deg" }}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2 w-full h-full"
        >
          {items[index % items.length]}
        </MotionDiv>
      </AnimatePresence>

      <hr
        style={{
          transform: "translateZ(1px)",
        }}
        className="absolute left-0 right-0 top-1/2 z-[999999999] -translate-y-1/2 border-t border-gray-300 opacity-50"
      />
    </div>
  );
};
