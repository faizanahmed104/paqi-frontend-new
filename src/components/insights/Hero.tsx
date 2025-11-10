import Navbar from '../common/navbar';
import Image from 'next/image';

function Hero() {
  return (
    <div className="relative">
      <Navbar variant="white" />

      {/* Hero Section - left text, right image */}
      <div className="relative max-w-7xl mx-auto mt-8 px-6">
        <div className="flex flex-col lg:flex-row items-center border-b border-black overflow-hidden">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 py-12 lg:py-20 pr-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight mb-6">
              Working with visionaries on the frontlines of social change worldwide
            </h1>
            <p className="text-lg text-gray-800 mb-6 max-w-xl">
              We’re building a world where everyone has the power to shape their lives. Learn about our research, partnerships and impact.
            </p>

            <div className="flex items-center space-x-4">
              <div>
                <a href="/about-us" className="inline-block px-5 py-2 border rounded-md text-sm font-medium">About Us</a>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 relative h-64 lg:h-[420px]">
            {/* Use a local image as placeholder; replace with a proper hero image when available */}
            <div className="absolute inset-0">
              <Image
                src="/hero/slide-1.webp"
                alt="Hero"
                fill
                className="object-cover w-full h-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
