"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Logo {
  src: string;
  alt: string;
  w: number;
  h: number;
}

interface ClientLogoCarouselProps {
  logos: Logo[];
  duration?: number;
  variant?: "hero" | "empresas";
}

export function ClientLogoCarousel({ logos, duration = 22, variant = "hero" }: ClientLogoCarouselProps) {
  const allLogos = [...logos, ...logos];

  return (
    <motion.div
      className="flex gap-16 items-center whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, ease: "linear", duration }}
    >
      {allLogos.map((logo, i) => (
        <div
          key={`${logo.alt}-${i}`}
          className={`flex-shrink-0 ${variant === "empresas" ? "opacity-40 hover:opacity-70 transition-opacity duration-200" : ""}`}
          style={{
            opacity: variant === "hero" ? 0.6 : undefined,
            filter: "grayscale(100%)",
          }}
        >
          <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className="object-contain" />
        </div>
      ))}
    </motion.div>
  );
}
