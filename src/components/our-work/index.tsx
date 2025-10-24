'use client';

import React from 'react';
import ResearchReports from './ResearchReports';
import Hero from '../common/hero';

function OurWork() {
  return (
    <div>
      <Hero
        title={'Our Work'}
        subTitle={
          'Lorem Ipsum is simply dummy text of the printing and typesetting'
        }
      />
      <ResearchReports />
    </div>
  );
}

export default OurWork;
