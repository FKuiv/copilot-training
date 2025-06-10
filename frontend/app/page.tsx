"use client";
import { useEffect, useRef, useState } from "react";
import FlightDelayPredictor from "./FlightDelayPredictor";

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 }); // actual mouse
  const [animMouse, setAnimMouse] = useState({ x: 50, y: 50 }); // animated mouse
  const [bubbleScale, setBubbleScale] = useState(1);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate the background position with a delay (~500ms lag)
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setAnimMouse((prev) => {
        const alpha = 0.1;
        const newX = prev.x + (mouse.x - prev.x) * alpha;
        const newY = prev.y + (mouse.y - prev.y) * alpha;
        if (bgRef.current) {
          bgRef.current.style.setProperty("--mouse-x", `${newX}%`);
          bgRef.current.style.setProperty("--mouse-y", `${newY}%`);
          bgRef.current.style.setProperty("--mouse-x-opposite", `${100 - newX}%`);
          bgRef.current.style.setProperty("--mouse-y-opposite", `${100 - newY}%`);
        }
        return { x: newX, y: newY };
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [mouse.x, mouse.y]);

  // Handle click to animate bubble scale
  useEffect(() => {
    const handleClick = () => {
      setBubbleScale(1.25);
      setTimeout(() => setBubbleScale(1), 250);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
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
          transform: `scale(${bubbleScale})`,
          transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
          background:
            "radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(0,212,255,0.18) 0%, rgba(88,28,135,0.14) 60%, rgba(26,31,56,0.8) 100%)",
        }}
      />
      {/* Second bubble at the opposite side */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
          transform: `scale(${bubbleScale})`,
          transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
          background:
            "radial-gradient(500px circle at var(--mouse-x-opposite,50%) var(--mouse-y-opposite,50%), rgba(255,0,128,0.14) 0%, rgba(0,0,0,0.08) 60%, rgba(26,31,56,0.0) 100%)",
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
