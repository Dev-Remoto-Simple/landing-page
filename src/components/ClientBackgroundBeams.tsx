"use client";

import dynamic from "next/dynamic";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then(m => ({ default: m.BackgroundBeams })),
  { ssr: false }
);

export function ClientBackgroundBeams() {
  return <BackgroundBeams />;
}
