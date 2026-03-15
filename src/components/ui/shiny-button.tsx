"use client";
import React from "react";
import { motion, type AnimationProps } from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: { type: "spring", stiffness: 200, damping: 5, mass: 0.5 },
  },
} as AnimationProps;

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({ children, className, ...props }) => {
  return (
    <motion.button
      {...animationProps}
      {...(props as any)}
      className={cn(
        "relative rounded-full px-8 py-3 font-bold backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-lg",
        className
      )}
    >
      <span
        className="relative block text-sm uppercase tracking-widest"
        style={{
          maskImage:
            "linear-gradient(-75deg, var(--shine-color) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), var(--shine-color) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(116,250,253,0.1)_calc(var(--x)+20%),rgba(116,250,253,0.5)_calc(var(--x)+25%),rgba(116,250,253,0.1)_calc(var(--x)+100%))] p-px"
      />
    </motion.button>
  );
};
