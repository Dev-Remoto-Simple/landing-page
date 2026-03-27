"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MessageCircle, Globe2, Home as HomeIcon, Users, Calendar } from "lucide-react";

// Dynamic imports — loaded after hydration, reduces initial JS bundle
const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then(m => ({ default: m.BackgroundBeams })),
  { ssr: false }
);
const TextGenerateEffect = dynamic(
  () => import("@/components/ui/text-generate-effect").then(m => ({ default: m.TextGenerateEffect })),
  { ssr: false }
);
const FloatingDock = dynamic(
  () => import("@/components/ui/floating-dock").then(m => ({ default: m.FloatingDock })),
  { ssr: false }
);

// ── Brand tokens (from colors.md + screenshots) ───────────────────────────────
const BG      = "#021E43"; // hero, about, footer
const MID     = "#0C3F78"; // stats+members section, events card
const BRAND   = "#134D91"; // buttons, purpose cards, empresas text
const CYAN    = "#74FAFD"; // accent highlights

// ── Purpose cards ─────────────────────────────────────────────────────────────
const purposes = [
  { icon: "/proposito-01.png", title: "Comunidad", desc: "la más importante comunidad tech primero en Bolivia y luego en Latam." },
  { icon: "/proposito-02.png", title: "Conexión", desc: "Ser el punto de unión del ecosistema tech de Sillicon Valley los emprendedores y talento de Bolivia y luego Latam" },
  { icon: "/proposito-03.png", title: "Educación", desc: "Aprendizaje y creación constante de productos para que el talento esté en el estado del arte de la tecnología." },
  { icon: "/proposito-04.png", title: "Emprendimiento",desc: "Montar startups de tecnología avanzada con visión global. Pensamos en grande desde el minuto 0" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
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

// ── Shared font vars ──────────────────────────────────────────────────────────
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";
const fB = "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [eventIdx, setEventIdx] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const SECTION_COUNT = 6;
  const events = [
    { img: "/evento-nodejs.png", caption: "Charla con Node.JS maintainer and Committee member · Santa Cruz" },
    { img: "/evento-takenos.jpg", caption: "After office para remote workers con Takenos · Santa Cruz" },
    { img: "/evento-padel.png", caption: "Padel Semanal enfocado en longevity · Santa Cruz" },
  ];
  const { ref: statsRef, inView: statsInView } = useInView();
  const count = useCounter(1000, 2200, statsInView);

  // Combined scroll handler — rAF throttled
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30);
        const refs = sectionRefs.current.filter(Boolean);
        if (refs.length > 0) {
          const mid = window.innerHeight / 2;
          let best = 0;
          refs.forEach((el, i) => {
            if (el.getBoundingClientRect().top <= mid) best = i;
          });
          setActiveSection(best);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(onScroll, 100);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  // Strip Unicorn Studio watermark
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `a[href*="unicorn.studio"], [class*="unicorn-badge"], [id*="unicorn-badge"] { display: none !important; }`;
    document.head.appendChild(style);
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a[href*="unicorn.studio"]').forEach(el => el.remove());
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); style.remove(); };
  }, []);


  return (
    <div style={{ fontFamily: fB }}>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? "10px 0" : "16px 0",
          backgroundColor: scrolled ? `${BG}F0` : BG,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid rgba(116,250,253,0.1)` : "none",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <Image src="/logo.svg" alt="Dev Remoto Simple" width={140} height={29} priority />
          <a
            href="https://chat.whatsapp.com/I28KiCgdRv43fpNQTWpjFK?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
            style={{
              display: "inline-block",
              borderRadius: "9999px",
              backgroundColor: BRAND,
              color: "#fff",
              fontFamily: fH,
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.18em",
              padding: "10px 28px",
              boxShadow: `0 4px 24px rgba(19,77,145,0.5)`,
            }}
          >
            ÚNETE
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1 — HERO
          Background: #021E43, dot grid overlay
          Ends with ÚNETE button that overlaps into screen 2
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { if (el) sectionRefs.current[0] = el; }}
        className="relative flex min-h-screen flex-col items-center px-6 pt-24 pb-4"
        style={{ backgroundColor: BG, overflow: "visible" }}
      >
        <BackgroundBeams />

        {/* Center content grows to fill available space */}
        <div className="relative z-10 flex flex-grow flex-col items-center justify-center text-center">
          {/* Headline */}
          <h1
            className="max-w-2xl text-4xl font-bold leading-snug text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: fH }}
          >
            <strong>La comunidad tech</strong>{" "}
            <strong>de los que pensamos</strong>{" "}
            <br />

            <strong style={{ color: CYAN }}>EN GRANDE</strong>
          </h1>

          <p className="mt-6 max-w-xl text-lg sm:text-xl text-white/70">
              Eventos tech para conectar el  {" "}
            <strong>mejor talento de Latam </strong>
            con las {" "}
            <strong>mejores empresas mundo. </strong>
          </p>

          {/* ÚNETE button */}
          <a
            href="https://chat.whatsapp.com/I28KiCgdRv43fpNQTWpjFK?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
            style={{
              display: "inline-block",
              borderRadius: "9999px",
              backgroundColor: BRAND,
              color: "#fff",
              fontFamily: fH,
              fontWeight: 700,
              fontSize: "1.14rem",
              letterSpacing: "0.18em",
              padding: "21px 62px",
              boxShadow: `0 4px 24px rgba(19,77,145,0.5)`,
            }}
          >
            ÚNETE
          </a>
        </div>

        {/* Carousel — pinned to bottom via normal flow */}
        <div className="relative z-10 w-full max-w-3xl text-center">
          <p
            className="mb-4 text-sm tracking-widest uppercase text-white/40"
            style={{ fontFamily: fH }}
          >
            Hemos colaborado con:
          </p>
          <div
            className="overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          >
            <motion.div
              className="flex gap-16 items-center whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
            >
              {[
                { src: "/logo-newnodejs.png", alt: "Node.js", w: 120, h: 40 },
                { src: "/logo-takenos.avif", alt: "Takenos", w: 120, h: 40 },
                { src: "/logo-nodi.png", alt: "Nodi", w: 120, h: 40 },
              ].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="flex-shrink-0" style={{ opacity: 0.6, filter: "grayscale(100%)", ...(logo.alt === "Node.js" ? { backgroundColor: "#fff", borderRadius: "8px", padding: "4px" } : {}) }}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className="object-contain" />
                </div>
              ))}
              {[
                { src: "/logo-newnodejs.png", alt: "Node.js", w: 120, h: 40 },
                { src: "/logo-takenos.avif", alt: "Takenos", w: 120, h: 40 },
                { src: "/logo-nodi.png", alt: "Nodi", w: 120, h: 40 },
              ].map((logo, i) => (
                <div key={`dup-${logo.alt}-${i}`} className="flex-shrink-0" style={{ opacity: 0.6, filter: "grayscale(100%)", ...(logo.alt === "Node.js" ? { backgroundColor: "#fff", borderRadius: "8px", padding: "4px" } : {}) }}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className="object-contain" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 (top) — EVENTOS RECIENTES
          Background: white, cards with MID footer strip
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { if (el) sectionRefs.current[1] = el; }}
        className="relative flex min-h-screen flex-col justify-center px-6 py-20"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="mx-auto w-full max-w-6xl">

          {/* Header row */}
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

          {/* Carousel track */}
          <div style={{ overflow: "hidden" }}>
            <motion.div
              className="flex gap-5"
              animate={{ x: `calc(-${eventIdx} * (32rem + 1.25rem))` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {events.map((ev, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{ width: "min(32rem, calc(100vw - 3rem))", boxShadow: "0 4px 24px rgba(12,63,120,0.12)" }}
                >
                  {/* Square image using aspect-ratio */}
                  <div style={{ aspectRatio: "1 / 1", width: "100%", overflow: "hidden", position: "relative" }}>
                    <Image
                      src={ev.img}
                      alt={ev.caption}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 3rem), 512px"
                      className="object-cover"
                    />
                  </div>
                  <div
                    className="px-5 py-4"
                    style={{ backgroundColor: MID }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.9)", fontFamily: fB }}
                    >
                      {ev.caption}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 2 — PURPOSE
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { if (el) sectionRefs.current[2] = el; }}
        id="comunidad"
        className="relative overflow-hidden flex min-h-screen flex-col justify-center px-6 py-20"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* ASCII / code texture background */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/background2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
          animate={{ scale: [1, 1.06, 1], x: [0, 12, -12, 0], y: [0, -9, 9, 0] }}
          transition={{ duration: 13, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        />

        {/* Subtle radial glow — top center */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${CYAN}18 0%, transparent 70%)` }}
        />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-snug" style={{ fontFamily: fH, color: BRAND}}>
            You can build <span style={{ color: CYAN }}>global</span> things.
          </p>
          <p className="mt-4 text-2xl font-bold sm:text-3xl" style={{color: BRAND, fontFamily: fH}}>Nuestro propósito es:</p>

          {/* 4-column cards */}
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4 items-stretch">
            {purposes.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.12 * i, ease: "easeOut" }}
                whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(19,77,145,0.35), 0 0 0 1px ${CYAN}44` }}
                className="flex flex-col items-start rounded-2xl px-5 py-10 text-left cursor-default h-full"
                style={{ backgroundColor: BRAND, transition: "background 0.3s ease", minHeight: "360px" }}
              >
                <span className="mb-4 text-sm font-bold" style={{ color: `${CYAN}99` }}>✦</span>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl self-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <Image src={icon} alt={title} width={48} height={48} className="object-contain" />
                </div>
                <div className="w-full">
                  <strong className="text-2xl block mb-3 text-center" style={{ color: "#ffffff", fontFamily: fH }}>{title}</strong>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)", fontFamily: fB }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3 — STATS + MEMBERS
          Background: #0C3F78, white text, cyan accent
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={(el) => { if (el) sectionRefs.current[3] = el; }} className="relative flex min-h-screen flex-col justify-center px-6 py-24 overflow-hidden" style={{ backgroundColor: BG }}>
        {/* Stats */}
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

        {/* Member comments — newsfeed style, fades out at bottom */}
        {(() => {
          const members = [
            {
              name: "Weimar Torrez",
              role: "Backend Engineer · La Paz",
              quote: "Abrió mis perspectivas para conocer las oportunidades globales y trabajar en una empresa de Milano, Italia",
              linkedin: "https://www.linkedin.com/in/weimar-alexander-torres-herrera-8558b6140/",
            },
            {
              name: "Javier Soruco",
              role: "AI Engineer · Cochabamba",
              quote: "Contratado por NxtPhase AI, empresa holandesa remoto desde Bolivia",
              linkedin: "https://www.linkedin.com/in/javier-soruco-lopez-b8802a193/",
            },
            {
              name: "Max Baldiviezo",
              role: "Data Scientist · Santa Cruz",
              quote: "El networking es fundamental y la comunidad me ha ayudado a expandir mi red a nivel internacional",
              linkedin: "https://www.linkedin.com/in/maxbaldiviezo/",
            }
          ];
          const allMembers = [...members, ...members];
          return (
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
          );
        })()}
      </section>



      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 (bottom) — EMPRESAS
          Background: white + ascii bg at low opacity
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { if (el) sectionRefs.current[4] = el; }}
        id="empresas"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* ASCII background — pre-generated static image */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/ascii-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Blue logo */}
          <div className="flex justify-center mb-3">
            <Image src="/logo-blue.svg" alt="Dev Remoto Simple" width={200} height={44} />
          </div>

          <h2
            className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-snug"
            style={{ color: BRAND, fontFamily: fH }}
          >
            En empresas
          </h2>

          <p
            className="mx-auto mt-7 max-w-lg text-base leading-relaxed font-normal"
            style={{ color: BRAND }}
          >
            Apoyamos a startups en su contratación de talento tech latino remoto mediante servicios de reclutamiento y staffing boutique.
          </p>

          {/* Logo carousel */}
          <div className="mt-12 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
            <motion.div
              className="flex gap-16 items-center whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            >
              {[
                { src: "/logo-ciaoelsa.png", alt: "ciaoElsa", w: 120, h: 40 },
                { src: "/logo-nxtphaseai.png", alt: "NXtPhaseAI", w: 120, h: 40 },
              ].map((logo, i) => (
                <div key={`${logo.alt}-${i}`} className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-200" style={{ filter: "grayscale(100%)" }}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className="object-contain" />
                </div>
              ))}
              {[
                { src: "/logo-ciaoelsa.png", alt: "ciaoElsa", w: 120, h: 40 },
                { src: "/logo-nxtphaseai.png", alt: "NXtPhaseAI", w: 120, h: 40 },
              ].map((logo, i) => (
                <div key={`dup-${logo.alt}-${i}`} className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-200" style={{ filter: "grayscale(100%)" }}>
                  <Image src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} className="object-contain" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* CONOCE MÁS button */}
          <div className="mt-12">
            <a
              href="https://ywqd0p9zpc4.typeform.com/to/Ymhmy1Qy"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
              style={{
                display: "inline-block",
                borderRadius: "9999px",
                backgroundColor: BRAND,
                color: "#fff",
                fontFamily: fH,
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.18em",
                padding: "14px 44px",
                boxShadow: `0 4px 24px rgba(19,77,145,0.6), 0 0 40px ${CYAN}18`,
              }}
            >
              CONOCE MÁS
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 5 (top) — SOBRE NOSOTROS
          Background: #021E43 + circles bg
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { if (el) sectionRefs.current[5] = el; }}
        id="nosotros"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: BG }}
      >
        {/* Circles background — bottom center */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2"
          style={{
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "700px",
          }}
        >
          <Image
            src="/circles-bg.png"
            alt=""
            width={700}
            height={400}
            className="w-full opacity-20"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2
            className="text-5xl font-bold leading-tight text-white md:text-6xl"
            style={{ fontFamily: fH }}
          >
            ¿Por qué hacemos esto?
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-base leading-relaxed sm:text-lg" style={{ color: "rgba(255,255,255,0.7)", fontFamily: fB }}>
            Como decía Hegel, no existe la "autopercepción" si no es a través del <em>otro</em>. Hoy existe una demanda única de buen talento remoto, y nosotros, como latinos, queremos conocer al talento regional y ser el punto de conexión que le permita acceder a las mejores oportunidades.
          </p>

          <div className="mt-12 flex flex-col items-center">
            {/* Avatar */}
            <div
              className="h-44 w-44 overflow-hidden rounded-full"
              style={{ border: `4px solid ${CYAN}`, boxShadow: `0 0 48px ${CYAN}45` }}
            >
              <Image src="/Mateo Puña.png" alt="Mateo Puña" width={176} height={176} className="h-full w-full object-cover" />
            </div>
            <p className="mt-6 text-3xl font-bold text-white" style={{ fontFamily: fH }}>
              Mateo Puña
            </p>
            <p className="mt-2 text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
              Senior Founding Engineer
            </p>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
              Founder Dev Remoto Simple
            </p>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/punamateo"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-2 transition-all duration-200 hover:opacity-80"
              style={{ color: CYAN, fontFamily: fH, fontWeight: 600, fontSize: "0.95rem" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#0D1117" }}>
        <div className="relative mx-auto max-w-5xl px-6 py-12">
          {/* Social links — top right corner */}
          <div className="absolute top-6 right-6 flex items-center gap-4">
            {[
              { title: "LinkedIn", href: "https://www.linkedin.com/company/dev-remoto-simple/", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/50 hover:text-white/80 transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
              { title: "WhatsApp", href: "https://chat.whatsapp.com/I28KiCgdRv43fpNQTWpjFK?mode=gi_t", icon: <MessageCircle className="w-5 h-5 text-white/50 hover:text-white/80 transition-colors" /> },
            ].map((link) => (
              <a key={link.title} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.title}>
                {link.icon}
              </a>
            ))}
          </div>

          {/* CTA content */}
          <div className="flex flex-col items-center text-center">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: `${CYAN}99` }}>
              Empieza hoy
            </p>
            <h3 className="mb-6 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: fH }}>
              You can build <span style={{ color: CYAN }}>global</span> things.
            </h3>
            <a
              href="https://chat.whatsapp.com/I28KiCgdRv43fpNQTWpjFK?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
              style={{
                borderRadius: "9999px",
                backgroundColor: BRAND,
                color: "#fff",
                fontFamily: fH,
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.2em",
                padding: "16px 48px",
                boxShadow: `0 4px 24px rgba(19,77,145,0.5), 0 0 40px ${CYAN}22`,
              }}
            >
              ÚNETE AHORA
            </a>
          </div>

          {/* Copyright inline */}
          <p className="mt-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Dev Remoto Simple
          </p>
        </div>
      </footer>

      {/* ── Dot navigation ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => {
          const isActive = activeSection === i;
          return (
            <button
              key={i}
              onClick={() => {
                const target = sectionRefs.current[i];
                if (!target) return;
                setActiveSection(i);
                window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
              }}
              aria-label={`Ir a sección ${i + 1}`}
              style={{
                width: isActive ? "12px" : "8px",
                height: isActive ? "12px" : "8px",
                borderRadius: "9999px",
                backgroundColor: isActive ? CYAN : "transparent",
                border: `2px solid ${isActive ? CYAN : "#4A5A72"}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                padding: 0,
                boxShadow: isActive ? `0 0 8px ${CYAN}88` : "none",
              }}
            />
          );
        })}
      </div>

    </div>
  );
}
