import Navbar from '../common/navbar';

function Hero() {
  return (
    <div className="relative">
      <Navbar variant="white" />

      {/* Hero Section with Background */}
      <div className="relative h-[300px] overflow-hidden max-w-7xl mx-auto">
        {/* Content */}
        <div className="relative z-20 h-full flex items-center border-b border-black">
          <div className="flex w-full max-w-7xl mx-auto mt-20 px-6">
            {/* Left side (Heading) */}
            <div className="w-[35%] flex items-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
                Our Work
              </h1>
            </div>

            {/* Right side (Paragraph) */}
            <div className="w-[65%] flex items-center">
              <p className="text-xl text-gray-800">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard <br />
                dummy text ever since the
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
