'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';

export interface Tab {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}

export default function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  // Animate tab buttons on mount
  useEffect(() => {
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current.children,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  // Animate tab content on change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }
      );
    }
  }, [activeIndex]);

  return (
    <div>
      {/* Tab Headers */}
      <div
        ref={buttonsRef}
        className="flex overflow-x-auto md:overflow-visible gap-3 md:gap-6 justify-start pb-2 md:pb-0 scrollbar-hide"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={clsx(
              'whitespace-nowrap px-4 sm:px-6 py-2 rounded-md border border-gray-300 text-green-600 font-medium transition-colors duration-200 flex-shrink-0',
              activeIndex === index
                ? 'bg-green-50 font-bold shadow-sm border-green-500'
                : 'bg-white hover:bg-gray-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div ref={contentRef} className="mt-4 md:mt-6 p-3 md:p-4">
        {tabs[activeIndex] && <div>{tabs[activeIndex].content}</div>}
      </div>
    </div>
  );
}
