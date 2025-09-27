import Navbar from '../navbar';

interface HeroProps {
  title: string;
  subTitle: string;
}

function Hero({ title, subTitle }: HeroProps) {
  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section with Background */}
      <div className="relative h-[500px] overflow-hidden bg-[#123524E5]">
        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="space-y-6 text-center mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mt-20">
              {title}
            </h1>
            <p className="text-xl text-gray-200">{subTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
