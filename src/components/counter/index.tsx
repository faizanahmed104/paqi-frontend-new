'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Dot } from 'lucide-react';

function Counter() {
  const [counters, setCounters] = useState([
    {
      current: 0,
      target: 2000000,
      suffix: 'M+',
      label: 'People Reached',
      icon: '/assets/impact/followers.svg',
    },
    {
      current: 0,
      target: 150,
      suffix: '+',
      label: 'Monitors Deployed',
      icon: '/assets/impact/reach.svg',
    },
    {
      current: 0,
      target: 7500,
      suffix: 'K+',
      label: 'Social Media Followers',
      icon: '/assets/impact/social.svg',
    },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('measuring-impact');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const intervals = [];

    counters.forEach((counter, index) => {
      const increment = counter.target / (duration / 16); // 60fps
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= counter.target) {
          current = counter.target;
          clearInterval(interval);
        }

        setCounters((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, current: Math.floor(current) } : item
          )
        );
      }, 16);

      intervals.push(interval);
    });
  };

  const formatNumber = (num: number, suffix: string) => {
    if (suffix === 'M+') {
      return `${(num / 1000000).toFixed(0)}M+`;
    }
    if (suffix === 'K+') {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num + suffix;
  };

  return (
    <div id="measuring-impact" className=" py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Measuring <span className="text-[#13A94B]">Impact</span>
          </h2>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {counters.map((counter, index) => (
            <div key={index} className="text-center group">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full flex items-center justify-center transition-colors duration-300">
                  <Image
                    src={counter.icon}
                    alt={counter.label}
                    width={52}
                    height={52}
                  />
                </div>
              </div>

              {/* Counter Number */}
              <div className="mb-3">
                <span className="text-5xl lg:text-6xl font-bold text-gray-900">
                  {formatNumber(counter.current, counter.suffix)}
                </span>
              </div>

              {/* Label */}
              <p className="text-lg font-medium text-gray-600">
                {counter.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center text-center mt-20 text-gray-500  max-w-xl mx-auto rounded-full font-bold">
        <Dot size={40} />
        <span>More Monitors Coming Soon</span>
        <Dot size={40} />
      </div>
    </div>
  );
}

export default Counter;
