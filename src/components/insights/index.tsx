'use client';

import React from 'react';
import Hero from '../common/hero';
import { insightsData } from '@/app/insights/data/InsightsData';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/ui-elements/Button';
import Footer from '../common/footer';
import '../../styles/global.css';

function Insights() {
  return (
    <>
      <Hero title={'Insights'} subTitle={'This is insights subtitle'} />
      <div className="max-w-7xl mx-auto my-16">
        {/* Dynamic Insight Highlight Blocks */}
        <div className="mb-32 ml-7 flex items-center gap-6 -mt-10">
          <h2 className="text-4xl font-semibold text-black">Featured</h2>

          <div className="roller w-full">
            <span id="rolltext" className="text-lg font-normal text-gray-600">
              <span>Technical Reports</span>
              <span>Research Papers</span>
              <span>Policy Briefs</span>
            </span>
          </div>
        </div>

        <section>
          <div className="space-y-32">
            {insightsData.map((card, index) => {
              const isEven = index % 2 === 0;
              const tint = index % 2 === 0 ? 'bg-green-100' : 'bg-orange-100';

              return (
                <div
                  key={card.slug}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Image side */}
                  {isEven ? (
                    <div className="relative flex flex-col gap-4">
                      <div
                        className={`absolute -left-6 -top-6 w-[60%] h-[70%] ${tint} -z-10`}
                      />
                      <div className="flex gap-4">
                        <div className="w-full">
                          <Image
                            src={card.img}
                            alt={card.title}
                            width={1000}
                            height={700}
                            className="object-cover w-full h-[300px]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex flex-col gap-4 order-1 lg:order-2">
                      <div
                        className={`absolute -right-6 -bottom-6 w-[60%] h-[70%] ${tint} -z-10`}
                      />
                      <div className="flex gap-4">
                        <div className="w-full">
                          <Image
                            src={card.img}
                            alt={card.title}
                            width={1000}
                            height={700}
                            className="object-cover w-full h-[300px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text side */}
                  <div
                    className={
                      isEven ? 'lg:pl-12' : 'lg:pr-12 order-2 lg:order-1'
                    }
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 mb-2">
                      {card.category}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-gray-900">
                      {card.title}
                    </h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      {card.text}
                    </p>

                    <Link href={`/insights/${card.slug}`}>
                      <Button
                        variant="outlined"
                        size="md"
                        shape="square"
                        className="text-black border-black hover:bg-[#123524] hover:text-white"
                      >
                        Read Story
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <h2 className="mt-10 my-5 flex justify-center text-2xl font-semibold text-black">
          Explore All
        </h2>
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Blog Cards */}
            <div>
              {/* Mobile & Tablet Slider - up to desktop */}
              <div className="flex lg:hidden space-x-4 md:space-x-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide px-4 md:px-6">
                {insightsData.map((card, index) => (
                  <article
                    key={index}
                    className="flex-shrink-0 snap-center w-80 md:w-96 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <Image
                        src={card.img}
                        alt={card.title}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <div className="text-[#123524] text-xs font-semibold uppercase tracking-wide mb-3">
                        {card.category || 'Technology Report'}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {card.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop Layout - 3 columns with dividers */}
              <div className="hidden lg:block">
                <div className="flex justify-center items-stretch">
                  {insightsData.map((card, index) => (
                    <div key={index} className="flex">
                      <article className="group bg-white transition-all duration-300 overflow-hidden cursor-pointer w-[350px] flex flex-col mx-4">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={card.img}
                            alt={card.title}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="pt-6 flex-1 flex flex-col">
                          <div className="text-[#123524] text-xs font-semibold uppercase tracking-wide mb-3">
                            {card.category || 'Enterprise Technology'}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300 flex-1">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {card.text}
                          </p>
                        </div>
                      </article>

                      {/* Vertical Divider - Show between all cards except the last one */}
                      {index < insightsData.length - 1 && (
                        <div className="w-px bg-gray-300 self-stretch" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Insights;
