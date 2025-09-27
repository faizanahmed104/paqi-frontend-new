'use client';

export default function CityTabContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: City Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-start">Lahore</h2>
            <p className="text-start">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry&apos;s
              standard dummy text. Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text. Lorem Ipsum is simply dummy
              text of the printing and typesetting industry. Lorem Ipsum has
              been the industry&apos;s standard dummy text. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry&apos;s standard dummy text. Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text.
            </p>
          </div>

          {/* Right: Heatmap */}
          <div className="w-full h-[500px] flex items-center justify-center bg-green-500 rounded-lg">
            Image here
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: City Info */}
          <div className="w-full h-[500px] flex items-center justify-center bg-green-500 rounded-lg">
            Image here
          </div>

          {/* Right: Heatmap */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-start">Lahore</h2>
            <p className="text-start">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry&apos;s
              standard dummy text. Lorem Ipsum is simply dummy text of the
              printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text. Lorem Ipsum is simply dummy
              text of the printing and typesetting industry. Lorem Ipsum has
              been the industry&apos;s standard dummy text. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry&apos;s standard dummy text. Lorem
              Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
