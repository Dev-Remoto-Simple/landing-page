"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BG = "#021E43";
const BRAND = "#134D91";
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";

export function ClientNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
  );
}
