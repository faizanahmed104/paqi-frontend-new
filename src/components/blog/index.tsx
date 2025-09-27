'use client';

import Button from '@/ui-elements/Button';
import { CARDS } from './constant';
import Image from 'next/image';

function Blog() {
  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Latest Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with our research, policy recommendations, and
            practical guides for cleaner air
          </p>
        </div>

        {/* Blog Cards */}
        <div>
          {/* Mobile & Tablet Slider - up to desktop */}
          <div className="flex lg:hidden space-x-4 md:space-x-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4 md:px-6">
            {CARDS.map((card, index) => (
              <article
                key={index}
                className="flex-shrink-0 snap-center w-80 md:w-96 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 md:h-52 overflow-hidden rounded-t-lg">
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
                  <div className="text-red-500 text-xs font-semibold uppercase tracking-wide mb-3">
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
              {CARDS.map((card, index) => (
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
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-red-500 text-xs font-semibold uppercase tracking-wide mb-3">
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
                  {index < CARDS.length - 1 && (
                    <div className="w-px bg-gray-300 self-stretch" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outlined"
            size="lg"
            shape="square"
            iconRight="→"
            className="text-black border-black hover:bg-[#123524] hover:text-white"
          >
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Blog;
