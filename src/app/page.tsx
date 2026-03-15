"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center animate-pulse bg-slate-50 rounded-full">
      <div className="w-32 h-32 rounded-full border-2 border-dashed border-blue-200" />
    </div>
  ),
});

// ── Brand tokens (from colors.md + screenshots) ───────────────────────────────
const BG      = "#021E43"; // hero, about, footer
const MID     = "#0C3F78"; // stats+members section, events card
const BRAND   = "#134D91"; // buttons, purpose cards, empresas text
const CYAN    = "#74FAFD"; // accent highlights

// ── Purpose cards ─────────────────────────────────────────────────────────────
const purposes = [
  { icon: "/proposito-01.png", title: "Crear",         desc: "la más importante comunidad tech primero en Bolivia y luego en Latam." },
  { icon: "/proposito-02.png", title: "Conectar",      desc: "con los emprendedores e inversores que están liderando la innovación." },
  { icon: "/proposito-03.png", title: "Educar",        desc: "al talento para que esté en el estado del arte de la tecnología." },
  { icon: "/proposito-04.png", title: "Crear startups",desc: "y productos que compitan internacionalmente." },
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
  const { ref: statsRef, inView: statsInView } = useInView();
  const count = useCounter(3000, 2200, statsInView);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Load Unicorn Studio SDK and init scene only on the hero element
  useEffect(() => {
    let scene: any = null;
    const SDK_URL = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js";

    const initScene = async () => {
      const US = (window as any).UnicornStudio;
      if (!US) return;
      scene = await US.addScene({
        elementId: "unicorn-hero",
        projectId: "vVUEJx71ofSTVB8IjTSt",
        scale: 1,
        dpi: 1.5,
        fps: 60,
        lazyLoad: false,
      });
    };

    if ((window as any).UnicornStudio) {
      initScene();
    } else {
      const s = document.createElement("script");
      s.src = SDK_URL;
      s.onload = () => initScene();
      document.head.appendChild(s);
    }

    return () => { scene?.destroy(); };
  }, []);

  // Strip Unicorn Studio watermark — CSS fires synchronously, observer handles late injections
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `a[href*="unicorn.studio"], [class*="unicorn-badge"], [id*="unicorn-badge"] { display: none !important; }`;
    document.head.appendChild(style);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a[href*="unicorn.studio"]').forEach(el => el.remove());
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      style.remove();
    };
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
          <div className="flex items-center gap-8">
            {(["Comunidad", "Empresa"] as const).map((label, i) => (
              <a
                key={label}
                href={i === 0 ? "#comunidad" : "#empresas"}
                className="text-sm font-medium cursor-pointer transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.75)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1 — HERO
          Background: #021E43, dot grid overlay
          Ends with ÚNETE button that overlaps into screen 2
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24"
        style={{ backgroundColor: BG, paddingBottom: "72px", overflow: "visible" }}
      >
        {/* Unicorn Studio WebGL background */}
        <div id="unicorn-hero" className="pointer-events-none absolute inset-0" style={{ width: "100%", height: "100%" }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Hero logo — larger size */}
          <Image
            src="/logo.svg"
            alt="Dev Remoto Simple"
            width={340}
            height={69}
            priority
            className="mb-10"
          />

          {/* Headline */}
          <h1
            className="max-w-2xl text-3xl font-bold leading-snug text-white sm:text-4xl"
            style={{ fontFamily: fH }}
          >
            <strong>No importa quién eres</strong>{" "}
            <span className="font-normal">ni de dónde vengas,</span>
            <br />
            <span className="font-normal">tú también </span>
            <strong>puedes crear </strong>
            <strong style={{ color: CYAN }}>cosas globales.</strong>
          </h1>
        </div>


        {/* ÚNETE — straddles hero + purpose (overlaps downward) */}
        <a
          href="#comunidad"
          className="absolute left-1/2 cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
          style={{
            bottom: "-28px",
            transform: "translateX(-50%)",
            zIndex: 10000,
            display: "inline-block",
            borderRadius: "9999px",
            backgroundColor: BRAND,
            color: "#fff",
            fontFamily: fH,
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "0.18em",
            padding: "28px 72px",
            boxShadow: `0 4px 24px rgba(19,77,145,0.5)`,
          }}
        >
          ÚNETE
        </a>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
    SECTION 2 — PURPOSE (REFINED)
══════════════════════════════════════════════════════════════════════ */}
<section
  id="comunidad"
  className="relative overflow-hidden px-6 pb-24 pt-32 lg:pt-48"
  style={{ 
    backgroundColor: "#FFFFFF",
    backgroundImage: `radial-gradient(circle at 15% 50%, #f0f9ff 0%, #ffffff 100%)` 
  }}
>
  <div className="relative z-10 mx-auto max-w-7xl">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4">

      {/* GLOBE CONTAINER — Optimized for screen scaling */}
      <div className="relative w-full max-w-[500px] aspect-square flex-shrink-0 lg:w-[45%] lg:max-w-none xl:scale-110 lg:-ml-12">
        {/* Glow effect slightly more transparent for better blending */}
        <div className="absolute inset-0 z-0 bg-blue-400/5 blur-[120px] rounded-full scale-110" />
        
        <div className="relative z-10 w-full h-full">
          <World
            globeConfig={{
              pointSize: 4,
              globeColor: "#062056",
              showAtmosphere: true,
              atmosphereColor: CYAN,
              atmosphereAltitude: 0.15,
              emissive: "#062056",
              emissiveIntensity: 0.1,
              shininess: 0.9,
              polygonColor: "rgba(255,255,255,0.7)",
              ambientLight: "#38bdf8",
              directionalLeftLight: "#ffffff",
              directionalTopLight: "#ffffff",
              pointLight: "#ffffff",
              arcTime: 2000,
              arcLength: 0.9,
              rings: 2,
              maxRings: 4,
              initialPosition: { lat: -16.5, lng: -68.15 },
              autoRotate: true,
              autoRotateSpeed: 0.4,
            }}
            data={[
              { order: 1, startLat: -16.5, startLng: -68.15, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.5, color: CYAN },
              { order: 2, startLat: -16.5, startLng: -68.15, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.4, color: "#3b82f6" },
              { order: 3, startLat: -16.5, startLng: -68.15, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.7, color: CYAN },
              { order: 4, startLat: -16.5, startLng: -68.15, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.8, color: "#6366f1" },
              { order: 5, startLat: -16.5, startLng: -68.15, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.6, color: CYAN },
              { order: 6, startLat: -16.5, startLng: -68.15, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.5, color: "#3b82f6" },
              { order: 7, startLat: -16.5, startLng: -68.15, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.4, color: "#6366f1" },
              { order: 8, startLat: -16.5, startLng: -68.15, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.2, color: CYAN },
            ]}
          />
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className="flex-1 text-center lg:text-left z-20 lg:max-w-[50%]">
        <header className="mb-12">
          <h2
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]"
            style={{ color: BRAND, fontFamily: fH }}
          >
            En el mundo de hoy <br />
            <span className="text-blue-500">no existen barreras.</span>
          </h2>
          <p className="mt-8 text-xl lg:text-2xl leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0">
            Por eso sabemos que podemos competir{" "}
            <strong className="text-slate-900" style={{ borderBottom: `3px solid ${CYAN}` }}>a nivel global.</strong>
          </p>
          <p className="text-lg font-medium text-slate-400 uppercase tracking-widest">
              Por eso,<span className="font-bold text-slate-900 px-1">nuestro propósito es :</span> 
            </p>
        </header>

        {/* 4 Purpose cards — 2x2 Grid with Refined Styling */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {purposes.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-start rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] bg-white border border-slate-100"
            >
              {/* Subtle Top Accent */}
              <div className="absolute top-0 left-8 right-8 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: BRAND }} />
              
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors duration-500">
                <Image src={icon} alt={title} width={36} height={36} className="object-contain" />
              </div>
              
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-700 transition-colors">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3 — STATS + MEMBERS
          Background: #0C3F78, white text, cyan accent
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-24" style={{ backgroundColor: MID }}>
        {/* Stats */}
        <div className="mx-auto max-w-3xl text-center" ref={statsRef}>
          <div
            className="text-[6rem] font-bold leading-none sm:text-[8rem] md:text-[10rem]"
            style={{ color: CYAN, fontFamily: fH }}
          >
            {count.toLocaleString()}
          </div>
          <p className="mt-6 text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: fH }}>
            Personas de todos los perfiles tienen algo en común:
          </p>
          <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
            <strong className="text-white">Están aprendiendo</strong> y creando productos{" "}
            <strong style={{ color: CYAN }}>globales.</strong>
          </p>
        </div>

        {/* Member cards */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {Array(5).fill(null).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-52 snap-start rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                style={{ backgroundColor: BRAND }}
              >
                <div
                  className="mb-4 h-32 w-full rounded-xl"
                  style={{ background: `linear-gradient(160deg, #1A5AAE 0%, #0E3D78 100%)` }}
                  aria-hidden
                />
                <div className="mb-1 text-xs font-bold tracking-widest" style={{ color: CYAN }}>
                  TÍTULO
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Cuerpo de texto, descripción de foto o frase explicativa.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 (top) — EVENTOS SEMANALES
          Background: white, card: #0C3F78 rounded
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-3xl p-10 text-center md:p-14"
            style={{
              backgroundColor: MID,
              boxShadow: "0 8px 40px rgba(12,63,120,0.25)",
            }}
          >
            <h2
              className="text-5xl font-bold italic text-white sm:text-6xl"
              style={{ fontFamily: fH }}
            >
              Eventos<br />semanales
            </h2>
            <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed" style={{ color: CYAN }}>
              Tenemos sesiones de{" "}
              <strong>Building</strong> y práctica de inglés cada{" "}
              <strong>semana</strong>, un evento presencial y una masterclass{" "}
              <strong>cada mes.</strong>
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="inline-block cursor-pointer transition-all duration-200 hover:bg-gray-50"
                style={{
                  borderRadius: "9999px",
                  backgroundColor: "#FFFFFF",
                  color: BRAND,
                  border: `1px solid ${BRAND}`,
                  fontFamily: fB,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "12px 32px",
                }}
              >
                Únete a los eventos{" "}
                <strong>ahora</strong>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 (bottom) — EMPRESAS
          Background: white + ascii bg at low opacity
          Ends with CONOCE MÁS button overlapping into about
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="empresas"
        className="relative overflow-visible px-6 pb-20 text-center"
        style={{ backgroundColor: "#FFFFFF", paddingTop: "64px" }}
      >
        {/* ASCII background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/ascii-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.06,
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Blue logo */}
          <div className="flex justify-center mb-3">
            <Image src="/logo-blue.svg" alt="Dev Remoto Simple" width={200} height={44} />
          </div>

          <h2
            className="mt-4 text-2xl font-bold tracking-[0.18em]"
            style={{ color: BRAND, fontFamily: fH }}
          >
            EN EMPRESAS
          </h2>

          <p className="mx-auto mt-7 max-w-lg text-base leading-relaxed" style={{ color: BRAND }}>
            <strong>Apoyamos a las organizaciones en su contratación</strong> de talento tecnológico
            mediante servicios de <strong>staffing boutique</strong>, y el desarrollo de su
            estrategia tecnológica desde los primeros pasos{" "}
            <strong>hasta su implementación.</strong>
          </p>
        </div>

        {/* CONOCE MÁS — straddles empresas + about */}
        <a
          href="#nosotros"
          className="absolute left-1/2 cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
          style={{
            bottom: "-28px",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "inline-block",
            borderRadius: "9999px",
            backgroundColor: BRAND,
            color: "#fff",
            fontFamily: fH,
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.18em",
            padding: "14px 44px",
            boxShadow: `0 4px 24px rgba(19,77,145,0.45)`,
            whiteSpace: "nowrap",
          }}
        >
          CONOCE MÁS
        </a>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 5 (top) — SOBRE NOSOTROS
          Background: #021E43 + circles bg
          Top padding accommodates CONOCE MÁS overlap
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="nosotros"
        className="relative overflow-hidden px-6 pb-24 text-center"
        style={{ backgroundColor: BG, paddingTop: "80px" }}
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

        <div className="relative z-10 mx-auto max-w-sm">
          <h2
            className="text-5xl font-bold leading-tight text-white md:text-6xl"
            style={{ fontFamily: fH }}
          >
            Sobre<br />nosotros
          </h2>

          <div className="mt-12 flex flex-col items-center">
            {/* Avatar */}
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full text-3xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${CYAN}55 0%, #2A5A7C 100%)`,
                border: `3px solid ${CYAN}`,
                boxShadow: `0 0 30px ${CYAN}35`,
              }}
              aria-label="Foto de Mateo Puña"
            >
              M
            </div>
            <p className="mt-5 text-xl font-bold text-white" style={{ fontFamily: fH }}>
              Mateo Puña
            </p>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Senior Founding Engineer
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Founder Dev Remoto Simple
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
          Background: #021E43
      ══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="px-6 py-10"
        style={{ backgroundColor: BG, borderTop: `1px solid rgba(116,250,253,0.12)` }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo + tagline */}
          <div>
            <Image src="/logo.svg" alt="Dev Remoto Simple" width={140} height={29} />
            <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              You can build{" "}
              <strong style={{ color: "rgba(255,255,255,0.65)" }}>global</strong> things.
            </p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Redes Sociales
            </span>
            {/* LinkedIn */}
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: `${CYAN}18`, border: `1px solid ${CYAN}40` }}
              aria-label="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: `${CYAN}18`, border: `1px solid ${CYAN}40` }}
              aria-label="WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>

          {/* CTA */}
          <a
            href="#"
            className="inline-block cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-105"
            style={{
              borderRadius: "9999px",
              backgroundColor: BRAND,
              color: "#fff",
              fontFamily: fH,
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              padding: "12px 36px",
              boxShadow: `0 4px 20px rgba(19,77,145,0.4)`,
            }}
          >
            ÚNETE AHORA
          </a>
        </div>
      </footer>
    </div>
  );
}
