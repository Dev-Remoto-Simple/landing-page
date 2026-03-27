import Image from "next/image";
import { MessageCircle } from "lucide-react";

import { ClientNavbar } from "@/components/ClientNavbar";
import { ClientBackgroundBeams } from "@/components/ClientBackgroundBeams";
import { ClientEventCarousel } from "@/components/ClientEventCarousel";
import { ClientPurposeCards } from "@/components/ClientPurposeCards";
import { ClientStatsSection } from "@/components/ClientStatsSection";
import { ClientDotNav } from "@/components/ClientDotNav";
import { ClientLogoCarousel } from "@/components/ClientLogoCarousel";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const BG      = "#021E43";
const MID     = "#0C3F78";
const BRAND   = "#134D91";
const CYAN    = "#74FAFD";

// ── Static data ──────────────────────────────────────────────────────────────
const purposes = [
  { icon: "/proposito-01.png", title: "Comunidad", desc: "la más importante comunidad tech primero en Bolivia y luego en Latam." },
  { icon: "/proposito-02.png", title: "Conexión", desc: "Ser el punto de unión del ecosistema tech de Sillicon Valley los emprendedores y talento de Bolivia y luego Latam" },
  { icon: "/proposito-03.png", title: "Educación", desc: "Aprendizaje y creación constante de productos para que el talento esté en el estado del arte de la tecnología." },
  { icon: "/proposito-04.png", title: "Emprendimiento", desc: "Montar startups de tecnología avanzada con visión global. Pensamos en grande desde el minuto 0" },
];

const events = [
  { img: "/evento-nodejs.png", caption: "Charla con Node.JS maintainer and Committee member · Santa Cruz" },
  { img: "/evento-takenos.jpg", caption: "After office para remote workers con Takenos · Santa Cruz" },
  { img: "/evento-padel.png", caption: "Padel Semanal enfocado en longevity · Santa Cruz" },
];

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
  },
];

const heroLogos = [
  { src: "/logo-newnodejs.png", alt: "Node.js", w: 120, h: 40 },
  { src: "/logo-takenos.avif", alt: "Takenos", w: 120, h: 40 },
  { src: "/logo-nodi.png", alt: "Nodi", w: 120, h: 40 },
];

const empresasLogos = [
  { src: "/logo-ciaoelsa.png", alt: "ciaoElsa", w: 120, h: 40 },
  { src: "/logo-nxtphaseai.png", alt: "NXtPhaseAI", w: 120, h: 40 },
];

// ── Shared font vars ─────────────────────────────────────────────────────────
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";
const fB = "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif";

// ── Page (Server Component) ──────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: fB }}>

      {/* ── NAVBAR (Client Island) ── */}
      <ClientNavbar />

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        data-section-index={0}
        className="relative flex min-h-screen flex-col items-center px-6 pt-24 pb-4"
        style={{ backgroundColor: BG, overflow: "visible" }}
      >
        <ClientBackgroundBeams />

        <div className="relative z-10 flex flex-grow flex-col items-center justify-center text-center">
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
            Eventos tech para conectar el{" "}
            <strong>mejor talento de Latam </strong>
            con las{" "}
            <strong>mejores empresas mundo. </strong>
          </p>

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

        {/* Logo Carousel (Client Island) */}
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
            <ClientLogoCarousel logos={heroLogos} duration={22} variant="hero" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 2 — EVENTOS RECIENTES (Client Island)
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        data-section-index={1}
        className="relative flex min-h-screen flex-col justify-center px-6 py-20"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <ClientEventCarousel events={events} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 3 — PURPOSE
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        data-section-index={2}
        id="comunidad"
        className="relative overflow-hidden flex min-h-screen flex-col justify-center px-6 py-20"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* ASCII / code texture background (static) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/background2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />

        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${CYAN}18 0%, transparent 70%)` }}
        />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-snug" style={{ fontFamily: fH, color: BRAND }}>
            You can build <span style={{ color: CYAN }}>global</span> things.
          </p>
          <p className="mt-4 text-2xl font-bold sm:text-3xl" style={{ color: BRAND, fontFamily: fH }}>Nuestro propósito es:</p>

          {/* Purpose Cards (Client Island — for animations) */}
          <ClientPurposeCards purposes={purposes} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 4 — STATS + MEMBERS (Client Island)
      ══════════════════════════════════════════════════════════════════════ */}
      <div data-section-index={3}>
        <ClientStatsSection members={members} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SCREEN 5 — EMPRESAS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        data-section-index={4}
        id="empresas"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url('/ascii-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
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

          {/* Logo carousel (Client Island) */}
          <div className="mt-12 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
            <ClientLogoCarousel logos={empresasLogos} duration={25} variant="empresas" />
          </div>

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
          SCREEN 6 — SOBRE NOSOTROS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        data-section-index={5}
        id="nosotros"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: BG }}
      >
        <div
          className="pointer-events-none absolute bottom-0 left-1/2"
          style={{ transform: "translateX(-50%)", width: "100%", maxWidth: "700px" }}
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

          <p className="mt-6 text-base leading-relaxed sm:text-lg" style={{ color: "rgba(255,255,255,0.7)", fontFamily: fB }}>
            Como decía Hegel, no existe la &ldquo;autopercepción&rdquo; si no es a través del <em>otro</em>. Hoy existe una demanda única de buen talento remoto, y nosotros, como latinos, queremos conocer al talento regional y ser el punto de conexión que le permita acceder a las mejores oportunidades.
          </p>

          <div className="mt-12 flex flex-col items-center">
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

          <p className="mt-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2025 Dev Remoto Simple
          </p>
        </div>
      </footer>

      {/* ── Dot navigation (Client Island) ── */}
      <ClientDotNav sectionCount={6} />

    </div>
  );
}
