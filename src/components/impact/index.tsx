'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function Impact() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const els = root.current.querySelectorAll('[data-animate]');
    gsap.set(els, { opacity: '0', y: 40 });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(e.target, { opacity: '1', y: 0, duration: 0.8 });
            io.unobserve(e.target as Element);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="impact" ref={root} className="container py-24">
      <h2
        className="section-headline mx-auto mb-12 max-w-4xl text-center text-2xl font-semibold"
        data-animate
      >
        Our Data-Driven Impact
      </h2>

      <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-3">
        {[
          { n: '150+', t: 'Monitoring Stations' },
          { n: '2M+', t: 'People Reached' },
          { n: '7.5K+', t: 'Social Media Followers' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex h-full flex-col items-center justify-center rounded-xl bg-brand-ink p-10 text-white shadow-sm"
            data-animate
          >
            <div className="font-mont text-4xl">{item.n}</div>
            <p className="mt-2">{item.t}</p>
          </div>
        ))}
      </div>

      <h2
        className="mt-20 text-center text-lg font-light text-brand-text-dark hover:text-brand-ink transition"
        data-animate
      >
        More monitors coming soon...
      </h2>
    </section>
  );
}
