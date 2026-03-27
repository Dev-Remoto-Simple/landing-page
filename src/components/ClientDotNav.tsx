"use client";

import { useState, useEffect, useRef } from "react";

const CYAN = "#74FAFD";

export function ClientDotNav({ sectionCount }: { sectionCount: number }) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Collect all sections by data attribute
    const sections = document.querySelectorAll<HTMLElement>("[data-section-index]");
    sectionRefs.current = Array.from(sections);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.sectionIndex);
            if (!isNaN(index)) setActiveSection(index);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
      {Array.from({ length: sectionCount }).map((_, i) => {
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
  );
}
