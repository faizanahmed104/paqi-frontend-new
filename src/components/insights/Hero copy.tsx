import React from 'react';
import Navbar from '../common/navbar';
import Button from '@/ui-elements/Button';
import Footer from '../common/footer';
// import { insightsData } from '@/app/insights/data/InsightsData';
// import Link from 'next/link';
import Image from 'next/image';

function Hero() {
  return (
    <div className="">
      <Navbar variant="white" />
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section>
          <div className="flex flex-col lg:flex-row mt-28">
            {/* Left Content */}
            <div className="lg:w-1/2 flex flex-col justify-center pr-6 md:pr-10 lg:px-6 py-12 lg:py-20">
              <h1 className="text-5xl mt-[1.2rem]">
                Working with visionaries on the frontlines of social change
                worldwide
              </h1>

              <p className="text-xl text-gray-800 mb-10 leading-relaxed">
                We’re building a world where everyone has the power to shape
                their lives.
              </p>

              <Button
                variant="outlined"
                size="sm"
                shape="square"
                iconRight="→"
                className="text-black border-black hover:bg-[#123524] hover:text-white min-w-[200px] w-5"
              >
                About Us
              </Button>

              {/* Full-width horizontal divider */}
              <div className="w-full border-b-2 border-gray-900 mt-8" />
            </div>

            {/* Right Media */}
            <div className="lg:w-1/2 min-h-[260px] md:min-h-[340px] lg:min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80"
                alt="Performance on stage"
              />
            </div>
          </div>
        </section>

        {/* Three Column Cards Section - no top spacing */}
        <section className="relative bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* FIRST BLOCK */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
              {/* Left – collage */}
              <div className="relative flex flex-col gap-4">
                {/* Background tint */}
                <div className="absolute -left-6 -top-6 w-[60%] h-[70%] bg-green-100 -z-10" />
                <div className="flex gap-4">
                  <div className="w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                      alt="Protesters advocating for social justice"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* <div className="w-1/3 flex flex-col gap-4">
                    <Image
                      src="https://images.unsplash.com/photo-1596496181851-b943c1d7d8c9?w=600&q=80"
                      alt="Farmer standing with drone"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <Image
                      src="https://images.unsplash.com/photo-1581090466906-26b1efb1a4b4?w=600&q=80"
                      alt="Woman reading with accessibility device"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div> */}
                </div>
              </div>

              {/* Right – text */}
              <div className="lg:pl-12">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-gray-900">
                  We are disrupting systems to advance social justice
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  We believe in the inherent dignity of all people and that inequality is the defining challenge of our time.
                </p>
                <Button
                  variant="outlined"
                  size="md"
                  shape="square"
                  className="text-black border-black hover:bg-[#123524] hover:text-white"
                >
                  How We Work
                </Button>
              </div>
            </div>

            {/* SECOND BLOCK */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left – text */}
              <div className="lg:pr-12 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-gray-900">
                  We invest in transformative ideas, individuals and institutions
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  We’re reimagining philanthropy to catalyze leaders and organizations driving social justice and building movements across the globe.
                </p>
                <Button
                  variant="outlined"
                  size="md"
                  shape="square"
                  className="text-black border-black hover:bg-[#123524] hover:text-white"
                >
                  Our Grants
                </Button>
              </div>

              {/* Right – collage */}
              <div className="relative flex flex-col gap-4 order-1 lg:order-2">
                <div className="absolute -right-6 -bottom-6 w-[60%] h-[70%] bg-orange-100 -z-10" />
                <div className="flex gap-4">
                  <div className="w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                      alt="Person working in a field"
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* <div className="w-1/2 flex flex-col gap-4">
                    <Image
                      src="https://images.unsplash.com/photo-1581092795360-0e505f6d3f3e?w=800&q=80"
                      alt="Woman speaking at a seminar"
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    <Image
                      src="https://images.unsplash.com/photo-1601597111529-7c27a1baf4ec?w=800&q=80"
                      alt="Group discussion around table"
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section>
          <div className="max-w-7xl mx-auto pl-4">
            <div className="flex flex-col gap-5 md:flex-row md:divide-x md:divide-gray-200">
              {insightsData.map((card) => (
                <Link
                  key={card.slug}
                  href={`/insights/${card.slug}`}
                  className="group flex-1 flex flex-col cursor-pointer"
                >
                  <div className="h-80 overflow-hidden">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-8 bg-white flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">
                      {card.category}
                    </div>
                    <h3 className="text-2xl font-serif text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{card.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </div>
  );
}

export default Hero;
