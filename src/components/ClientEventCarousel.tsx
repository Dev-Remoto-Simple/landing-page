"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MID = "#0C3F78";
const BRAND = "#134D91";
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";
const fB = "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif";

interface Event {
  img: string;
  caption: string;
}

export function ClientEventCarousel({ events }: { events: Event[] }) {
  const [eventIdx, setEventIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const GAP = 20; // gap-5 = 1.25rem = 20px

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) setCardWidth(cardRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <h2
          className="text-4xl font-bold sm:text-5xl"
          style={{ color: BRAND, fontFamily: fH }}
        >
          Eventos recientes
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEventIdx(i => Math.max(i - 1, 0))}
            disabled={eventIdx === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30"
            style={{
              border: `2px solid ${BRAND}`,
              color: BRAND,
              backgroundColor: "transparent",
              cursor: eventIdx === 0 ? "default" : "pointer",
            }}
            onMouseEnter={e => { if (eventIdx > 0) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = BRAND; }}
            aria-label="Anterior"
          >
            ◀
          </button>
          <button
            onClick={() => setEventIdx(i => Math.min(i + 1, events.length - 1))}
            disabled={eventIdx === events.length - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30"
            style={{
              border: `2px solid ${BRAND}`,
              color: BRAND,
              backgroundColor: "transparent",
              cursor: eventIdx === events.length - 1 ? "default" : "pointer",
            }}
            onMouseEnter={e => { if (eventIdx < events.length - 1) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = BRAND; }}
            aria-label="Siguiente"
          >
            ▶
          </button>
        </div>
      </div>

      <div style={{ overflow: "hidden" }}>
        <motion.div
          className="flex gap-5"
          animate={{ x: cardWidth ? -eventIdx * (cardWidth + GAP) : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {events.map((ev, i) => (
            <div
              key={i}
              ref={i === 0 ? cardRef : undefined}
              className="flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: "min(32rem, calc(100vw - 3rem))", boxShadow: "0 4px 24px rgba(12,63,120,0.12)" }}
            >
              <div style={{ aspectRatio: "1 / 1", width: "100%", overflow: "hidden", position: "relative" }}>
                <Image
                  src={ev.img}
                  alt={ev.caption}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 3rem), 512px"
                  className="object-cover"
                  style={{ backgroundColor: MID }}
                />
              </div>
              <div className="px-5 py-4" style={{ backgroundColor: MID }}>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)", fontFamily: fB }}>
                  {ev.caption}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
