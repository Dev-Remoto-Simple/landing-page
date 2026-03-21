"use client";
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export function MovingBorderButton({
  borderRadius = "9999px",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 2500,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn("relative h-auto p-[2px] overflow-hidden", containerClassName)}
      style={{ borderRadius }}
      {...otherProps}
    >
      <div className="absolute inset-0" style={{ borderRadius }}>
        <MovingBorder duration={duration} rx="50%" ry="50%">
          <div
            className={cn(
              "h-16 w-16 opacity-90 bg-[radial-gradient(circle,#4ADE80_0%,#145A2E_40%,transparent_70%)]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>
      <div
        className={cn(
          "relative flex items-center justify-center w-full h-full",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} - 2px)` }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 2500,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = (pathRef.current as SVGGeometryElement | null)?.getTotalLength();
    if (length) {
      progress.set((time * (length / duration)) % length);
    }
  });

  const x = useTransform(progress, (val) =>
    (pathRef.current as SVGGeometryElement | null)?.getPointAtLength(val).x ?? 0
  );
  const y = useTransform(progress, (val) =>
    (pathRef.current as SVGGeometryElement | null)?.getPointAtLength(val).y ?? 0
  );
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>
        {children}
      </motion.div>
    </>
  );
};
