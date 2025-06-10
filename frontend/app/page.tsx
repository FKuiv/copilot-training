"use client";
import { useEffect, useRef, useState } from "react";
import FlightDelayPredictor from "./FlightDelayPredictor";

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMouse({ x, y });
      if (bgRef.current) {
        bgRef.current.style.setProperty("--mouse-x", `${x}%`);
        bgRef.current.style.setProperty("--mouse-y", `${y}%`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(800px circle at var(--mouse-x,50%) var(--mouse-y,50%), #232a47 0%, #232a47 40%, #1a1f38 100%)",
        transition: "background 0.2s",
      }}
    >
      {/* Surreal color overlay following mouse */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(0,212,255,0.18) 0%, rgba(88,28,135,0.14) 60%, rgba(26,31,56,0.8) 100%)",
          transition: "background 0.2s",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center gradient-text drop-shadow-lg z-10 relative animate-gradient-smooth">
          Flight Delay Predictor
        </h1>
        <p className="text-gray-300 mb-10 text-center max-w-xl opacity-80">
          Predict your flight delays with our advanced AI model powered by
          machine learning technology
        </p>
        <FlightDelayPredictor />
      </div>
    </div>
  );
}
