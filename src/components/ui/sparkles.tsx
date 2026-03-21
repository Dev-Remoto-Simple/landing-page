"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#4ADE80",
  particleDensity = 80,
}: SparklesCoreProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    type Particle = { x: number; y: number; size: number; opacity: number; opacityDir: number; speed: number };
    const particles: Particle[] = Array.from({ length: particleDensity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random(),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      speed: (0.2 + Math.random() * 0.6) * speed,
    }));

    const hex = particleColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (background !== "transparent") { ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height); }

      for (const p of particles) {
        p.opacity += p.opacityDir * 0.008 * speed;
        if (p.opacity >= 1) { p.opacity = 1; p.opacityDir = -1; }
        if (p.opacity <= 0) { p.opacity = 0; p.opacityDir = 1; p.x = Math.random() * canvas.width; p.y = Math.random() * canvas.height; }
        p.y -= p.speed * 0.3;
        if (p.y < -p.size) p.y = canvas.height + p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return <canvas ref={canvasRef} className={cn("w-full h-full", className)} />;
};
