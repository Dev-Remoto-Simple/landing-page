"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const BG = "#021E43";
const BRAND = "#134D91";
const CYAN = "#74FAFD";
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(end: number, duration = 2200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, active]);
  return count;
}

interface Member {
  name: string;
  role: string;
  quote: string;
  linkedin: string;
}

export function ClientStatsSection({ members }: { members: Member[] }) {
  const { ref: statsRef, inView: statsInView } = useInView();
  const count = useCounter(1000, 2200, statsInView);
  const allMembers = [...members, ...members];

  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 py-24 overflow-hidden" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-3xl text-center" ref={statsRef}>
        <div
          className="text-[6rem] font-bold leading-none sm:text-[8rem] md:text-[10rem]"
          style={{ color: CYAN, fontFamily: fH }}
        >
          <span>+</span><span>{count.toLocaleString()}</span>
        </div>
        <p className="mt-6 text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: fH }}>
          En la comunidad. Porque el talento está en todas partes. Y ahora, las oportunidades también:
        </p>
      </div>

      <div
        className="mx-auto mt-16 max-w-3xl overflow-hidden"
        style={{
          maxHeight: "340px",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex flex-col gap-4"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {allMembers.map((member, i) => (
            <div
              key={`${member.name}-${i}`}
              className="rounded-xl p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white">{member.name}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{member.role}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                &ldquo;{member.quote}&rdquo;
              </p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs hover:underline" style={{ color: CYAN }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
