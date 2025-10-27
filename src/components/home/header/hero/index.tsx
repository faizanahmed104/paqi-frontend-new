'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '@/ui-elements/Button';
import { SLIDE_CATEGORIES, SLIDES } from './constant';

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Function to scroll active indicator into view
  const scrollActiveIntoView = () => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeButtonRef.current;
      const containerWidth = container.offsetWidth;
      const scrollLeft = button.offsetLeft - (containerWidth / 2) + (button.offsetWidth / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Effect to handle scrolling when slide changes
  useEffect(() => {
    scrollActiveIntoView();
  }, [currentSlide]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [SLIDES.length]);

  return (
    <div
      ref={heroRef}
      className="relative h-[80vh] sm:h-[90vh] lg:h-screen overflow-hidden"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-105 pointer-events-none'
            }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
              <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                {/* Category */}
                <div
                  className={`text-sm sm:text-base font-medium text-gray-300 mb-2 sm:mb-4 transform transition-all duration-1000 delay-200 ${index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                    }`}
                >
                  {slide.category}
                </div>

                {/* Title */}
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-snug sm:leading-tight transform transition-all duration-1000 delay-400 ${index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                    }`}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p
                  className={`text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl transform transition-all duration-1000 delay-600 leading-relaxed ${index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                    }`}
                >
                  {slide.subtitle}
                </p>

                {/* CTA */}
                <div
                  className={`transition-all duration-1000 delay-800 ${index === currentSlide
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                    }`}
                >
                  <Button
                    variant="link"
                    size="md"
                    className="p-0 text-sm sm:text-base"
                    shape="square"
                    iconRight="→"
                    href="#"
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 lg:bottom-8 left-0 right-0">
        <div className="w-full sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
          <div className="flex justify-center lg:justify-between items-center">
            {/* Mobile scrollable categories */}
            <div ref={scrollContainerRef} className="lg:hidden w-full overflow-x-auto scrollbar-hide">
              <div className="flex space-x-6 px-4 min-w-max pb-3">
                {SLIDE_CATEGORIES.map((category, index) => (
                  <button
                    key={index}
                    ref={index === currentSlide ? activeButtonRef : null}
                    onClick={() => goToSlide(index)}
                    className={`relative whitespace-nowrap font-semibold transition-all duration-300 text-sm sm:text-base pb-2 ${index === currentSlide
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                      }`}
                  >
                    {category}
                    {index === currentSlide && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-[#13A94B]"
                        style={{
                          animation: 'progressBar 5000ms linear',
                          width: '100%',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop category labels */}
            <div className="hidden lg:flex w-full justify-between">
              {SLIDE_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative whitespace-nowrap font-semibold transition-all duration-300 text-base lg:text-lg ${index === currentSlide
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  {category}
                  {index === currentSlide && (
                    <div
                      className="absolute -bottom-2 left-0 h-1 bg-[#13A94B]"
                      style={{
                        animation: 'progressBar 5000ms linear',
                        width: '100%',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          @keyframes progressBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          /* Hide scrollbar but keep functionality */
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        `}
      </style>
    </div>
  );
}

export default Hero;
