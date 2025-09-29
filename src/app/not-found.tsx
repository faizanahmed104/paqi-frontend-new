'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function NotFound() {
  const cloudRefs = useRef<(SVGSVGElement | null)[]>([]);
  const fogRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const hazeRef = useRef<HTMLDivElement | null>(null);
  const earthRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    cloudRefs.current.forEach((cloud, index) => {
      if (cloud) {
        gsap.to(cloud, {
          x: index % 2 === 0 ? 150 : -150,
          duration: 25 + index * 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    if (fogRef.current) {
      gsap.to(fogRef.current, {
        opacity: 0.6,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        y: 20,
        x: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (hazeRef.current) {
      gsap.to(hazeRef.current, {
        opacity: 0.4,
        filter: 'blur(8px)',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (earthRef.current) {
      gsap.to(earthRef.current, {
        y: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#123524] via-sky-100 to-white overflow-hidden text-center px-6">
      {/* Clouds */}
      <svg
        ref={(el) => {
          cloudRefs.current[0] = el;
        }}
        className="absolute top-20 left-10 w-48 opacity-80"
        viewBox="0 0 64 32"
      >
        <ellipse cx="20" cy="20" rx="20" ry="12" fill="white" />
        <ellipse cx="40" cy="16" rx="18" ry="10" fill="white" />
      </svg>

      <svg
        ref={(el) => {
          cloudRefs.current[1] = el;
        }}
        className="absolute top-36 right-16 w-56 opacity-70"
        viewBox="0 0 64 32"
      >
        <ellipse cx="22" cy="20" rx="22" ry="14" fill="white" />
        <ellipse cx="42" cy="16" rx="20" ry="12" fill="white" />
      </svg>

      <svg
        ref={(el) => {
          cloudRefs.current[2] = el;
        }}
        className="absolute bottom-40 left-24 w-40 opacity-60"
        viewBox="0 0 64 32"
      >
        <ellipse cx="20" cy="18" rx="20" ry="12" fill="white" />
        <ellipse cx="38" cy="14" rx="16" ry="10" fill="white" />
      </svg>

      {/* 404 Text */}
      <div className="relative z-20">
        <h1
          ref={textRef}
          className="relative text-[8rem] lg:text-[10rem] font-extrabold text-[#123524] drop-shadow-xl leading-none"
        >
          404
        </h1>
      </div>

      {/* Titles */}
      <h2 className="z-20 text-2xl lg:text-3xl font-semibold text-gray-800 mb-3">
        Lost in the Smog
      </h2>
      <p className="z-20 text-gray-600 max-w-lg mx-auto mb-8">
        The page you’re looking for drifted away into the haze 🌫️ Let’s get you
        back to clear skies.
      </p>

      {/* Home Button */}
      <Link
        href="/"
        className="z-20 relative bg-gradient-to-r from-green-500 to-[#123524] hover:from-[#123524] hover:to-green-500 text-white px-8 py-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
      >
        Return Home
      </Link>


      {/* Haze Layer (BEHIND text + button but ABOVE background) */}
      <div
        ref={hazeRef}
        className="absolute inset-0 bg-white/40 pointer-events-none z-5"
      />

      {/* Fog Layer (ground fog) */}
      <div
        ref={fogRef}
        className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-700/60 via-gray-500/40 to-transparent pointer-events-none z-10"
      />

      {/* Floating particles */}
      <div className="absolute bottom-28 left-20 w-3 h-3 bg-green-400 rounded-full animate-ping z-30" />
      <div className="absolute top-28 right-32 w-4 h-4 bg-green-300 rounded-full animate-bounce z-30" />
      <div className="absolute bottom-44 right-16 w-2 h-2 bg-green-500 rounded-full animate-pulse z-30" />
    </div>
  );
}
