'use client';

import { useEffect, useState } from 'react';

type AqiInfo = { category: string; className: string };

function getAqiInfo(aqi: number): AqiInfo {
  if (aqi <= 50) return { category: 'Good', className: 'text-aqi-good' };
  if (aqi <= 100) return { category: 'Moderate', className: 'text-aqi-moderate' };
  if (aqi <= 150) return { category: 'Unhealthy (SG)', className: 'text-aqi-usg' };
  if (aqi <= 200) return { category: 'Unhealthy', className: 'text-aqi-unhealthy' };
  if (aqi <= 300) return { category: 'Very Unhealthy', className: 'text-aqi-very' };
  return { category: 'Hazardous', className: 'text-aqi-hazardous' };
}

export default function AqiWidget() {
  const [collapsed, setCollapsed] = useState(false);
  const [aqi, setAqi] = useState<number | null>(null);
  const [city, setCity] = useState('Determining location…');
  const [cat, setCat] = useState<AqiInfo>({
    category: 'Fetching',
    className: '',
  });

  useEffect(() => {
    const fetchAqi = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`/api/aqi?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        // expects: { status:'success', data: { current:{ pollution:{ aqius:number }}, city:string, state:string } }
        const val = Number(data?.data?.current?.pollution?.aqius ?? 0);
        const c = String(data?.data?.city ?? 'Unknown');
        setAqi(val);
        setCat(getAqiInfo(val));
        setCity(c);
      } catch {
        setAqi(null);
        setCity('Lahore (fallback)');
        setCat(getAqiInfo(90));
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchAqi(p.coords.latitude, p.coords.longitude),
        () => fetchAqi(31.5204, 74.3587) // Lahore
      );
    } else {
      fetchAqi(31.5204, 74.3587);
    }
  }, []);

  return (
    <button
      id="aqi-widget"
      onClick={() => setCollapsed((v) => !v)}
      className={[
        'absolute z-20 grid transform-gpu bg-neutral-800/20 text-white backdrop-blur shadow-sm',
        'rounded-2xl px-6 py-3 transition-all duration-400',
        'md:top-36 md:right-56 md:scale-90 top-36 right-4 scale-75',
        collapsed
          ? 'w-[100px] h-[100px] min-w-[100px] rounded-full place-items-center px-0 py-0'
          : 'min-w-[340px] grid-cols-[auto_auto_1fr] gap-x-4 items-center',
      ].join(' ')}
      style={{ transformOrigin: 'top right' } as React.CSSProperties}
    >
      {/* AQI label */}
      <div className={`flex flex-col items-start ${collapsed ? 'hidden' : ''}`}>
        <span className="text-xs tracking-wide uppercase opacity-90">AQI</span>
      </div>

      {/* Numeric value */}
      <div
        className={`font-mont text-2xl font-bold leading-none ${cat.className}`}
      >
        {aqi ?? '…'}
      </div>

      {/* Category + city */}
      <div className={`flex flex-col items-start ${collapsed ? 'hidden' : ''}`}>
        <span className={`text-sm font-semibold uppercase ${cat.className}`}>
          {cat.category}
        </span>
        <span className="text-xs opacity-80">{city}</span>
      </div>
    </button>
  );
}
