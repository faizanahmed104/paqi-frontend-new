'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Partners() {
  const logos = [
    '/assets/partners/bank-alfalah.png',
    '/assets/partners/breathepak.png',
    '/assets/partners/cfp.png',
    '/assets/partners/epic.png',
    '/assets/partners/iba.png',
    '/assets/partners/iqair.png',
    '/assets/partners/uol.png',
    '/assets/partners/kul.png',
    '/assets/partners/lei.png',
    '/assets/partners/lums.png',
    '/assets/partners/pcaa.png',
    '/assets/partners/umt.png',
    '/assets/partners/wwf.png',
  ];

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

      <div className="overflow-hidden relative w-full h-[100px]">
        {/* Track 1 */}
        <div
          className="flex items-center absolute left-0 top-0"
          ref={trackRef1}
        >
          {logos.map((src, i) => (
            <div
              key={`track1-${i}`}
              className="flex h-[100px] items-center justify-center shrink-0 sm:px-10"
            >
              <div className="relative w-[120px] flex items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  src={src}
                  alt="Partner Logo"
                  style={{ objectFit: 'contain' }}
                  className="max-w-[100px] max-h-[40px] sm:max-h-[45px] lg:max-h-[50px] w-auto opacity-70 grayscale transition hover:scale-110 hover:opacity-100 hover:grayscale-0"
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
          {logos.map((src, i) => (
            <div
              key={`track2-${i}`}
              className="flex h-[100px] items-center justify-center shrink-0 sm:px-10"
            >
              <div className="relative w-[120px] flex items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  src={src}
                  alt="Partner Logo"
                  style={{ objectFit: 'contain' }}
                  className="max-w-[100px] max-h-[40px] sm:max-h-[45px] lg:max-h-[50px] w-auto opacity-70 grayscale transition hover:scale-110 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
