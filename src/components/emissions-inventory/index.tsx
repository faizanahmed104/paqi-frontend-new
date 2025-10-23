'use client';

import React from 'react';
import Hero from './Hero';
import Info from './Info';
import CitiesInfo from './CitiesInfo';
import Footer from '../common/footer';

function EmissionsInventory() {
  return (
    <>
      <Hero />
      <Info />
      <CitiesInfo />
      <Footer />
    </>
  );
}

export default EmissionsInventory;
