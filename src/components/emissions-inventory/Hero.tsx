import Navbar from '../common/navbar';

function Hero() {
  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section with Video Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/U7g2tki-a84?autoplay=1&mute=1&loop=1&playlist=U7g2tki-a84&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
            title="Background Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              transform: 'scale(1.2)',
              transformOrigin: 'center',
              filter: 'brightness(0.7)',
            }}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/60 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Emissions Inventories
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300">
                  Learn More...
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
