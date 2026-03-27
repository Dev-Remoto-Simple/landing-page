"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then(m => ({ default: m.BackgroundBeams })),
  { ssr: false }
);

export function ClientBackgroundBeams() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return null;

  // 48 original beams * 0.8 = ~38 beams (20% fewer)
  return <BackgroundBeams beamCount={38} />;
}
