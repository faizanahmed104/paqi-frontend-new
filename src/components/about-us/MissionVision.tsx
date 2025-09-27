import React from 'react';

function MissionVision() {
  return (
    <section className="p-4">
      <div className="bg-green-100 py-16 lg:py-24 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Our Mission */}
            <div className="space-y-6 pr-0 lg:pr-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our <span className="text-green-600">Mission</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our mission in PAQI is to empower everyone to take control of
                their air quality. For it, we provide real-time, user-friendly
                access to air quality data. Our main goal is to transform
                complex data into actionable insights that help you in saving
                your families and loved ones. It includes health advice and
                actionable solutions as per the air quality conditions in your
                area.
              </p>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 transform -translate-x-1/2" />

            {/* Our Vision */}
            <div className="space-y-6 pl-0 lg:pl-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our <span className="text-green-600">Vision</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                We envision a future where everyone is aware of the air they are
                breathing. We aim to form a community where everyone can breathe
                freely and where clean air is a fundamental right and not a
                luxury. For it, we are continuously developing innovative air
                quality monitoring solutions. Besides, we also suggest top and
                possible options for cleaner air.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionVision;
