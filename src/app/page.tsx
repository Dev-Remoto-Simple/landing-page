"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import UnicornScene from "unicornstudio-react/next";
import { motion } from "framer-motion";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ShinyButton } from "@/components/ui/shiny-button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SparklesCore } from "@/components/ui/sparkles";
import { Vortex } from "@/components/ui/vortex";
import { MessageCircle, Globe2, Home as HomeIcon, Users, Calendar } from "lucide-react";

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
        <div className="pointer-events-none absolute inset-0" style={{ width: "100%", height: "100%" }}>
          <UnicornScene
            projectId="xmLNahDvbQYSdqYWiluJ"
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js"
            width="100%"
            height="100%"
          />
        </div>

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
          SCREEN 2 — PURPOSE
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="comunidad"
        className="relative overflow-hidden px-6 pb-24 pt-32 lg:pt-44"
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
          }}
          animate={{ scale: [1, 1.04, 1], x: [0, 8, -8, 0], y: [0, -6, 6, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        />

        {/* Subtle radial glow — top center */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${CYAN}18 0%, transparent 70%)` }}
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-snug"
            style={{ color: BRAND, fontFamily: fH }}
          >
            En el mundo de hoy no existen barreras.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-5 text-lg leading-relaxed underline underline-offset-4 decoration-1"
            style={{ color: "#4A5A72" }}
          >
            Por eso sabemos que podemos competir{" "}
            <strong style={{ color: BRAND }}>a nivel global.</strong>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
            className="mt-4 text-xl font-medium"
            style={{ color: "#4A5A72", fontFamily: fH }}
          >
            Por eso, <strong style={{ color: BRAND }}>nuestro propósito es:</strong>
          </motion.p>

          {/* 4 horizontal cards */}
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {purposes.map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.12 * i, ease: "easeOut" }}
                whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(19,77,145,0.35), 0 0 0 1px ${CYAN}44` }}
                className="flex flex-col items-start rounded-2xl p-5 text-left cursor-default"
                style={{ backgroundColor: BRAND, transition: "background 0.3s ease" }}
              >
                {/* Star marker */}
                <span className="mb-3 text-xs font-bold" style={{ color: `${CYAN}99` }}>✦</span>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <Image src={icon} alt={title} width={40} height={40} className="object-contain" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.92)", fontFamily: fB }}>
                  <strong style={{ color: "#ffffff", fontFamily: fH }}>{title} </strong>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3 — STATS + MEMBERS
          Background: #0C3F78, white text, cyan accent
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative px-6 py-24 overflow-hidden" style={{ backgroundColor: MID }}>
        <BackgroundBeams />
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

        {/* Member draggable cards */}
        <DraggableCardContainer className="relative mt-16 min-h-[28rem] w-full">
          {[
            {
              name: "Ana Gutierrez",
              role: "Frontend Dev · Cochabamba",
              quote: "Conseguí mi primer cliente internacional a los 3 meses de unirme.",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
              className: "absolute top-4 left-[8%] rotate-[-4deg]",
            },
            {
              name: "Carlos Mamani",
              role: "Full Stack · La Paz",
              quote: "El network me abrió puertas que no sabía que existían.",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
              className: "absolute top-16 left-[28%] rotate-[5deg]",
            },
            {
              name: "Valeria Torrez",
              role: "Product Designer · Santa Cruz",
              quote: "Las masterclasses semanales cambiaron mi nivel completamente.",
              img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
              className: "absolute top-2 left-[50%] rotate-[-6deg]",
            },
            {
              name: "Diego Flores",
              role: "Backend Dev · Sucre",
              quote: "Pasé de freelancer local a trabajar con equipos en Europa.",
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
              className: "absolute top-20 left-[68%] rotate-[4deg]",
            },
          ].map((member) => (
            <DraggableCardBody key={member.name} className={member.className}>
              <img
                src={member.img}
                alt={member.name}
                className="pointer-events-none relative z-10 h-48 w-full rounded-xl object-cover"
              />
              <div className="mt-4">
                <p className="text-sm font-bold text-neutral-800">{member.name}</p>
                <p className="text-xs text-neutral-500 mb-2">{member.role}</p>
                <p className="text-sm italic text-neutral-600">"{member.quote}"</p>
              </div>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 (top) — EVENTOS SEMANALES
          Background: white, card: #0C3F78 rounded
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-2xl">
          <BackgroundGradient containerClassName="rounded-3xl" className="rounded-3xl">
            <div className="p-10 text-center md:p-14" style={{ backgroundColor: MID, borderRadius: "inherit" }}>
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
            <div className="mt-8 flex justify-center">
              <a
                href="#"
                className="inline-block cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  borderRadius: "9999px",
                  border: `2px solid ${CYAN}`,
                  color: CYAN,
                  fontFamily: fH,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  padding: "14px 44px",
                  letterSpacing: "0.04em",
                  boxShadow: `0 0 24px ${CYAN}22`,
                }}
              >
                Únete a los eventos <strong>ahora</strong>
              </a>
            </div>
            </div>
          </BackgroundGradient>
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
            backgroundImage: "url('/background2.png')",
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

          <TextGenerateEffect
            words="Apoyamos a las organizaciones en su contratación de talento tecnológico mediante servicios de staffing boutique, y el desarrollo de su estrategia tecnológica desde los primeros pasos hasta su implementación."
            className="mx-auto mt-7 max-w-lg text-base leading-relaxed font-normal"
            filter={true}
            duration={0.3}
            style={{ color: BRAND } as any}
          />
        </div>

        {/* CONOCE MÁS — straddles empresas + about */}
        <div
          className="absolute left-1/2"
          style={{ bottom: "-28px", transform: "translateX(-50%)", zIndex: 20 }}
        >
          <ShinyButton
            onClick={() => { window.location.href = "#nosotros"; }}
            className="cursor-pointer"
            style={{
              "--shine-color": "#fff",
              backgroundColor: BRAND,
              color: "#fff",
              fontFamily: fH,
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.18em",
              padding: "14px 44px",
              boxShadow: `0 4px 24px rgba(19,77,145,0.45)`,
              whiteSpace: "nowrap",
            } as any}
          >
            CONOCE MÁS
          </ShinyButton>
        </div>
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
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: BG }}>
        {/* Vortex CTA strip */}
        <Vortex
          containerClassName="w-full"
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          particleCount={300}
          baseHue={185}
          backgroundColor="transparent"
        >
          <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: `${CYAN}99` }}>
            Empieza hoy
          </p>
          <h3 className="mb-6 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: fH }}>
            You can build <span style={{ color: CYAN }}>global</span> things.
          </h3>
          <a
            href="#comunidad"
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
        </Vortex>

        {/* Bottom bar with logo + floating dock */}
        <BackgroundBeamsWithCollision className="min-h-0 py-10 px-6">
          <div className="relative z-10 mx-auto w-full max-w-5xl flex flex-col items-center gap-6">
            {/* Logo */}
            <Image src="/logo.svg" alt="Dev Remoto Simple" width={120} height={25} />

            {/* Floating Dock */}
            <FloatingDock
              items={[
                { title: "Inicio", icon: <HomeIcon className="w-full h-full text-white/70" />, href: "#" },
                { title: "Comunidad", icon: <Users className="w-full h-full text-white/70" />, href: "#comunidad" },
                { title: "Eventos", icon: <Calendar className="w-full h-full text-white/70" />, href: "#" },
                { title: "LinkedIn", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white/70"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, href: "#" },
                { title: "WhatsApp", icon: <MessageCircle className="w-full h-full text-white/70" />, href: "#" },
                { title: "Web", icon: <Globe2 className="w-full h-full text-white/70" />, href: "#" },
              ]}
              desktopClassName="border-white/10"
            />

            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              © {new Date().getFullYear()} Dev Remoto Simple
            </p>

            {/* Sparkles strip — bottom of footer */}
            <div className="w-72 h-10 relative">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={60}
                particleColor={CYAN}
                speed={0.8}
                className="w-full h-full"
              />
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </footer>
    </div>
  );
}
