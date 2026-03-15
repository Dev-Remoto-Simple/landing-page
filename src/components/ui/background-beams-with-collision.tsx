"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    { initialX: 80,   translateX: 80,   duration: 7,  repeatDelay: 3, delay: 2 },
    { initialX: 200,  translateX: 200,  duration: 5,  repeatDelay: 5, delay: 1 },
    { initialX: 380,  translateX: 380,  duration: 9,  repeatDelay: 4, className: "h-10" },
    { initialX: 560,  translateX: 560,  duration: 6,  repeatDelay: 8, delay: 3 },
    { initialX: 740,  translateX: 740,  duration: 8,  repeatDelay: 2, className: "h-16" },
    { initialX: 920,  translateX: 920,  duration: 5,  repeatDelay: 6, className: "h-8" },
    { initialX: 1100, translateX: 1100, duration: 11, repeatDelay: 3, delay: 1, className: "h-6" },
    { initialX: 1300, translateX: 1300, duration: 7,  repeatDelay: 5, delay: 2 },
  ];

  return (
    <div
      ref={parentRef}
      className={cn("relative flex items-center w-full justify-center overflow-hidden", className)}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 w-full inset-x-0 pointer-events-none"
        style={{ height: "1px", backgroundColor: "rgba(116,250,253,0.1)" }}
      />
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    beamOptions?: {
      initialX?: number; translateX?: number; initialY?: number; translateY?: number;
      rotate?: number; className?: string; duration?: number; delay?: number; repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{ detected: boolean; coordinates: { x: number; y: number } | null }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();
        if (beamRect.bottom >= containerRect.top) {
          setCollision({ detected: true, coordinates: { x: beamRect.left - parentRect.left + beamRect.width / 2, y: beamRect.bottom - parentRect.top } });
          setCycleCollisionDetected(true);
        }
      }
    };
    const id = setInterval(checkCollision, 50);
    return () => clearInterval(id);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => { setCollision({ detected: false, coordinates: null }); setCycleCollisionDetected(false); }, 2000);
      setTimeout(() => setBeamKey((k) => k + 1), 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{ translateY: beamOptions.initialY ?? "-200px", translateX: beamOptions.initialX ?? "0px", rotate: beamOptions.rotate ?? 0 }}
        variants={{ animate: { translateY: beamOptions.translateY ?? "800px", translateX: beamOptions.translateX ?? "0px", rotate: beamOptions.rotate ?? 0 } }}
        transition={{ duration: beamOptions.duration ?? 8, repeat: Infinity, repeatType: "loop", ease: "linear", delay: beamOptions.delay ?? 0, repeatDelay: beamOptions.repeatDelay ?? 0 }}
        className={cn("absolute left-0 top-10 m-auto h-12 w-px rounded-full bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent", beamOptions.className)}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion key={`${collision.coordinates.x}-${collision.coordinates.y}`} style={{ left: `${collision.coordinates.x}px`, top: `${collision.coordinates.y}px`, transform: "translate(-50%,-50%)" }} />
        )}
      </AnimatePresence>
    </>
  );
});
CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));
  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-1 w-10 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.2 + 0.4, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"
        />
      ))}
    </div>
  );
};
