"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Minimal value-noise 3D (no external deps)
function makeNoise3D() {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 256; i++) p[256 + i] = p[i];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (h: number, x: number, y: number, z: number) => {
    const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z;
    const B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
    return lerp(lerp(lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
      lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(p[AB + 1], x, y - 1, z - 1), grad(p[BB + 1], x - 1, y - 1, z - 1), u), v), w);
  };
}

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise3D = makeNoise3D();
    const particleCount = props.particleCount ?? 350;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = props.rangeY ?? 80;
    const baseTTL = 50, rangeTTL = 150;
    const baseSpeed = props.baseSpeed ?? 0;
    const rangeSpeed = props.rangeSpeed ?? 1.2;
    const baseRadius = props.baseRadius ?? 1;
    const rangeRadius = props.rangeRadius ?? 2;
    const baseHue = props.baseHue ?? 185;
    const rangeHue = 50;
    const noiseSteps = 3, xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;
    const backgroundColor = props.backgroundColor ?? "transparent";
    const TAU = 2 * Math.PI;
    const rand = (n: number) => n * Math.random();
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => { const hm = 0.5 * m; return Math.abs(((t + hm) % m) - hm) / hm; };
    const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

    let tick = 0;
    let particleProps = new Float32Array(particlePropsLength);
    let center: [number, number] = [0, 0];

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      center = [canvas.width / 2, canvas.height / 2];
    };

    const initParticle = (i: number) => {
      particleProps.set([
        rand(canvas.width), center[1] + randRange(rangeY), 0, 0, 0,
        baseTTL + rand(rangeTTL), baseSpeed + rand(rangeSpeed),
        baseRadius + rand(rangeRadius), baseHue + rand(rangeHue),
      ], i);
    };

    const initParticles = () => {
      tick = 0;
      particleProps = new Float32Array(particlePropsLength);
      for (let i = 0; i < particlePropsLength; i += particlePropCount) initParticle(i);
    };

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (backgroundColor !== "transparent") { ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }

      for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        const x = particleProps[i], y = particleProps[i+1];
        const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
        const vx = lerp(particleProps[i+2], Math.cos(n), 0.5);
        const vy = lerp(particleProps[i+3], Math.sin(n), 0.5);
        const life = particleProps[i+4], ttl = particleProps[i+5];
        const speed = particleProps[i+6], radius = particleProps[i+7], hue = particleProps[i+8];
        const x2 = x + vx * speed, y2 = y + vy * speed;
        ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = radius;
        ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); ctx.closePath(); ctx.restore();
        particleProps[i] = x2; particleProps[i+1] = y2; particleProps[i+2] = vx; particleProps[i+3] = vy; particleProps[i+4] = life + 1;
        if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) initParticle(i);
      }

      ctx.save(); ctx.filter = "blur(6px) brightness(200%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(canvas, 0, 0); ctx.restore();
      ctx.save(); ctx.filter = "blur(3px) brightness(200%)"; ctx.globalCompositeOperation = "lighter"; ctx.drawImage(canvas, 0, 0); ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className={cn("relative", props.containerClassName)}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        ref={containerRef} className="absolute inset-0 z-0"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>
      <div className={cn("relative z-10", props.className)}>{props.children}</div>
    </div>
  );
};
