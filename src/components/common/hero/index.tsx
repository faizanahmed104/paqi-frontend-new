import Navbar from '../navbar';

interface HeroProps {
  title: string;
  subTitle: string;
}

function Hero({ title, subTitle }: HeroProps) {
  return (
    <div>
      <Navbar />

      {/* Hero Section with Background */}
      <div className=" h-[350px] overflow-hidden bg-[#123524E5]">
        {/* Content */}
        <div className="space-y-6 pt-20 text-left mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mt-20">
            {title}
          </h1>
          <p className="text-xl text-gray-200">{subTitle}</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
