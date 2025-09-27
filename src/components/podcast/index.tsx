'use client';

import Button from '@/ui-elements/Button';
import React from 'react';

function Podcast() {
  return (
    <section className="relative min-h-screen flex items-center text-white overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video-1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Stronger Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content - Left Aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full space-y-8 text-left">
        <h2 className="text-lg md:text-xl font-semibold text-gray-200 uppercase tracking-wider">
          Dawar Hameed Butt, Co-Director PAQI
        </h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          <span className="text-green-500">Pakistan&apos;s</span>
          <br />
          State of
          <br />
          Air Quality
        </h1>

        <Button
          variant="outlined"
          size="lg"
          shape="square"
          iconRight="→"
          className="hover:bg-white hover:text-black transition"
        >
          Check the full podcast
        </Button>
      </div>
    </section>
  );
}

export default Podcast;
