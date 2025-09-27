'use client';

import React from 'react';
import Hero from '../common/hero';
import Form from './Form';
import Footer from '../footer';

function ContactUs() {
  return (
    <div className="relative bg-gray-100">
      <Hero
        title={"Let's Talk"}
        subTitle="Please help us know what requirements you have. Our team will contact you very soon."
      />
      <div className="relative z-30 -mt-32">
        <Form />
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
