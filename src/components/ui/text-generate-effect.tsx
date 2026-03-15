"use client";
import React, { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.4,
  style,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  style?: React.CSSProperties;
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.3 });
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!isInView) return;
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.08) }
    );
  }, [isInView]);

  return (
    <div className={cn(className)} style={style}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{ filter: filter ? "blur(8px)" : "none" }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
