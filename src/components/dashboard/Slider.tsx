'use client';

import React, { useEffect, useRef, useState, Children } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Dot: React.FC<{
  active?: boolean;
  onClick?: () => void;
  label?: string;
}> = ({ active, onClick, label }) => (
  <button
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`h-4 w-8 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
      active ? 'bg-white/90 shadow' : 'bg-white/30 hover:bg-white/50'
    }`}
  />
);

const Slider: React.FC<Props> = ({ children, className }) => {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = Children.count(children);

  useEffect(() => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        xPercent: -100 * index,
        duration: 0.7,
        ease: 'power3.inOut',
      });
    }
  }, [index]);

  // Touch swipe
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // use item(0) as a safe accessor; returns Touch | null
    const first = e.touches.item(0);
    if (!first) return;
    startX.current = first.clientX;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = startX.current;
    const first = e.changedTouches.item(0);
    if (start === null || !first) return;

    const delta = first.clientX - start;
    if (Math.abs(delta) > 48) {
      setIndex((i) => Math.min(count - 1, Math.max(0, i + (delta < 0 ? 1 : -1))));
    }
    startX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') setIndex((i) => Math.min(count - 1, i + 1));
    if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div className={`relative overflow-hidden${className ?? ''}`}>
      <div
        className="relative focus:outline-none"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div ref={trackRef} className="flex">
          {Children.map(children, (child, i) => (
            <section
              key={i}
              className="w-full shrink-0"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${count}`}
            >
              {child}
            </section>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <Dot
            key={i}
            label={`Go to slide ${i + 1}`}
            active={index === i}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
