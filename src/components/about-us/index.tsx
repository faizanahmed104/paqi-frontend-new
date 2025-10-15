'use client';

import React from 'react';
import Who from './Who';
import MissionVision from './MissionVision';
import Counter from '../home/counter';
import Partners from '../home/partners';
import Footer from '../footer';
import Hero from '../common/hero';

function AboutUs() {
  return (
    <>
      <Hero
        title="About Us"
        subTitle="Learn more about our mission and values."
      />
      <Who />
      <MissionVision />
      <Counter />
      <Partners />
      <Footer />
    </>
  );
}

export default AboutUs;
