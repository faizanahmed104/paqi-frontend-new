'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { LOGOS } from './constant';

export default function Partners() {
  const trackRef1 = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pos1 = 0;
    let pos2 = 0;
    const width = trackRef1.current?.scrollWidth || 0;
    let animationFrame: number;

    // Start track2 exactly after track1
    pos2 = width;

    const step = () => {
      pos1 -= 1; // speed
      pos2 -= 1;

      if (pos1 <= -width) {
        pos1 = pos2 + width;
      }
      if (pos2 <= -width) {
        pos2 = pos1 + width;
      }

      if (trackRef1.current && trackRef2.current) {
        trackRef1.current.style.transform = `translateX(${pos1}px)`;
        trackRef2.current.style.transform = `translateX(${pos2}px)`;
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section id="partners" className="py-20 text-center">
      <h2 className="section-headline mb-5 text-4xl lg:text-5xl font-bold text-gray-900">
        Partnerships
      </h2>
      <p className="mb-8">
        We collaborate with leading organizations to maximize our impact and
        drive systemic change.
      </p>

      <div className="overflow-hidden relative w-full h-[140px] sm:h-[120px]">
        {/* Track 1 */}
        <div
          className="flex items-center absolute left-0 top-0"
          ref={trackRef1}
        >
          {LOGOS.map((src, i) => (
            <div
              key={`track1-${i}`}
              className="flex h-[140px] sm:h-[120px] items-center justify-center shrink-0 sm:px-10"
            >
              <div className="relative w-[160px] flex items-center justify-center">
                <Image
                  width={140}
                  height={140}
                  src={src}
                  alt="Partner Logo"
                  style={{ objectFit: 'contain' }}
                  className="max-w-[140px] max-h-[60px] sm:max-h-[70px] lg:max-h-[80px] w-auto opacity-70 grayscale transition hover:scale-110 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Track 2 */}
        <div
          className="flex items-center absolute left-0 top-0"
          ref={trackRef2}
        >
          {LOGOS.map((src, i) => (
            <div
              key={`track2-${i}`}
              className="flex h-[140px] sm:h-[120px] items-center justify-center shrink-0 sm:px-10"
            >
              <div className="relative w-[160px] flex items-center justify-center">
                <Image
                  width={140}
                  height={140}
                  src={src}
                  alt="Partner Logo"
                  style={{ objectFit: 'contain' }}
                  className="max-w-[140px] max-h-[60px] sm:max-h-[70px] lg:max-h-[80px] w-auto opacity-70 grayscale transition hover:scale-110 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
