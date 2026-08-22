"use client";

import { useEffect, useRef } from "react";

/**
 * A field of small glyphs riding three interfering waves.
 * `color` is an "r, g, b" triplet; `alpha` is [floor, range] so a quiet page divider
 * can run at e.g. [0.05, 0.22] while the /graphics archive keeps the original contrast.
 */
const DEFAULT_ALPHA: [number, number] = [0.15, 0.5];

export function AnimatedWave({
  color = "0, 0, 0",
  alpha = DEFAULT_ALPHA,
  fontSize = 14,
  cell = 20,
}: {
  color?: string;
  alpha?: [number, number];
  fontSize?: number;
  cell?: number;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(rect.width / cell);
      const rows = Math.floor(rect.height / cell);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (rect.width / cols);
          const py = (y + 0.5) * (rect.height / rows);

          // Multiple wave interference
          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);

          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;

          const charIndex = Math.floor(normalized * (chars.length - 1));
          const a = alpha[0] + normalized * alpha[1];

          ctx.fillStyle = `rgba(${color}, ${a})`;
          ctx.fillText(chars[charIndex], px, py);
        }
      }

      time += 0.03;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [color, alpha, fontSize, cell]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
