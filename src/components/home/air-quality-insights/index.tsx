'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type CityConfig = { city: string; state: string; country: string };
type CityCard = {
  city: string;
  aqi: string;
  status: string;
  color: string;
  icon?: JSX.Element;
};

// ---- AQI helpers ----
function aqiInfo(aqiNum?: number | null): {
  status: CityCard['status'];
  Icon?: any;
  color: string;
} {
  const aqi = typeof aqiNum === 'number' ? aqiNum : -1;

  if (aqi >= 0 && aqi <= 50)
    return { status: 'Good', color: '#56AF7E' };
  if (aqi <= 100) return { status: 'Moderate', color: '#DDAE5B' };
  if (aqi <= 150) return { status: 'USG', color: '#E97E3C' }; // Unhealthy for Sensitive Groups
  if (aqi <= 200)
    return { status: 'Unhealthy', color: '#CA5C58' };
  if (aqi <= 300)
    return { status: 'Very Unhealthy', color: '#A070B6' };
  if (aqi > 300) return { status: 'Hazardous', color: '#A52A2A' };

  return { status: '—', color: '#9CA3AF' }; // default gray
}

function getAqius(resp: any): number | null {
  return resp?.data?.current?.pollution?.aqius ?? null;
}

const CITIES: CityConfig[] = [
  { city: 'Lahore', state: 'Punjab', country: 'Pakistan' },
  { city: 'Karachi', state: 'Sindh', country: 'Pakistan' },
  { city: 'Islamabad', state: 'Islamabad', country: 'Pakistan' },
  { city: 'Peshawar', state: 'Khyber Pakhtunkhwa', country: 'Pakistan' },
];

const BASE_URL = 'https://api.airvisual.com/v2/city';
const buildUrl = (c: CityConfig, key: string) =>
  `${BASE_URL}?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state)}&country=${encodeURIComponent(c.country)}&key=${encodeURIComponent(key)}`;

// ---- Loader ----
function AirLoader() {
  return (
    <div className="relative w-12 h-12" aria-label="Loading air quality">
      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-[spin_2s_linear_infinite]" />
      <div className="absolute inset-2 rounded-full border-2 border-white/20 animate-[spin_3s_linear_infinite_reverse]" />
      <span className="absolute left-1 top-1 w-2 h-2 bg-white/70 rounded-full animate-ping" />
      <span className="absolute right-2 top-3 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping [animation-delay:200ms]" />
      <span className="absolute left-4 bottom-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping [animation-delay:400ms]" />
    </div>
  );
}

function AirQualityInsights() {
  const API_KEY = process.env.NEXT_PUBLIC_AIRVISUAL_KEY || '';

  const [cityData, setCityData] = useState<CityCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!!API_KEY);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!cardsRef.current) return;

    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });

    gsap.to('.air-icon', {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 5,
      ease: 'sine.inOut',
      stagger: 0.3,
    });
  }, []);

  useEffect(() => {
    if (!API_KEY) {
      // fallback static demo data
      setCityData([
        {
          city: 'Lahore',
          aqi: '150',
          status: 'USG',
          color: '#E97E3C',
          // icon: <Frown size={35} />,
        },
        {
          city: 'Karachi',
          aqi: '80',
          status: 'Moderate',
          color: '#DDAE5B',
          // icon: <Meh size={35} />,
        },
        {
          city: 'Islamabad',
          aqi: '30',
          status: 'Good',
          color: '#56AF7E',
          // icon: <Smile size={35} />,
        },
        {
          city: 'Peshawar',
          aqi: '180',
          status: 'Unhealthy',
          color: '#CA5C58',
          // icon: <AlertTriangle size={35} />,
        },
      ]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    (async () => {
      try {
        const results = await Promise.all(
          CITIES.map(async (cfg) => {
            const res = await fetch(buildUrl(cfg, API_KEY), {
              signal: controller.signal,
              cache: 'no-store',
            });
            if (!res.ok)
              throw new Error(`${cfg.city} fetch failed: ${res.status}`);
            const json = await res.json();
            const aqius = getAqius(json);
            const { status, Icon, color } = aqiInfo(aqius);

            return {
              city: cfg.city,
              aqi: typeof aqius === 'number' ? String(aqius) : '—',
              status,
              color,
              icon: <Icon size={28} />,
            };
          })
        );

        setCityData(results);
      } catch (_err) {
        // fallback if error
        setCityData([]);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [API_KEY]);

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-4 space-y-6">
            <span className="bg-[#12352480] text-white px-4 py-2 rounded-full text-sm font-medium">
              Real-time Air Quality Data
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold leading-[125%]">
              <span className="text-[#13A94B]">Air Quality</span>
              <br />
              <span className="text-gray-900">Insights In</span>
              <br />
              <span className="text-gray-900">Pakistan's</span>
              <br />
              <span className="text-gray-900">Cities</span>
            </h2>
          </div>

          {/* Right Content - AQI Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            {cityData.map((city, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                style={{ backgroundColor: city.color }}
                className="rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 text-white relative overflow-hidden w-full shadow-lg"
              >
                {/* AQI Badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4">
                  <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                    AQI
                  </span>
                </div>

                {/* City Name */}
                <h3 className="text-sm sm:text-lg font-semibold mb-2">
                  {city.city}
                </h3>

                {/* AQI Value or Loader */}
                <div className="min-h-[48px] relative">
                  {isLoading ? (
                    <AirLoader />
                  ) : (
                    <>
                      <div className="text-3xl sm:text-4xl lg:text-[48px] font-bold">
                        {city.aqi}
                      </div>
                      {/* <div className="air-icon absolute -right-2 sm:right-0 bottom-[5px]">
                        {city.icon}
                      </div> */}
                    </>
                  )}
                </div>

                {/* Status */}
                <p className="text-white/90 text-xs sm:text-sm lg:text-base font-medium mt-2">
                  {isLoading
                    ? 'Fetching latest AQI…'
                    : city.status === 'USG'
                      ? 'Unhealthy for Sensitive Groups'
                      : city.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQualityInsights;
