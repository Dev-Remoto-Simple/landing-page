"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const BRAND = "#134D91";
const CYAN = "#74FAFD";
const fH = "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif";
const fB = "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif";

interface Purpose {
  icon: string;
  title: string;
  desc: string;
}

export function ClientPurposeCards({ purposes }: { purposes: Purpose[] }) {
  return (
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
  );
}
