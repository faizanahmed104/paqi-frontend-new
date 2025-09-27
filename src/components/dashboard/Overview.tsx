import React from 'react';
import { CloudSun } from 'lucide-react'; // ← lucide icon

type City = { name: string; value: number };

const Card: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur">
    <div className="text-center">
      <p className="text-lg/6 font-medium opacity-90">{title}</p>
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 px-8 py-4">
        <span className="text-5xl font-extrabold tracking-tight text-white">
          {value}
        </span>
      </div>
    </div>
  </div>
);

const WeatherPanel: React.FC = () => {
  const today = new Date();
  const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
  const date = today.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/5 p-6 text-white/90 backdrop-blur">
      <div>
        <h2 className="text-3xl font-semibold text-white">{weekday}</h2>
        <p className="mt-2 text-sm opacity-80">{date}</p>
      </div>

      <div className="flex items-center gap-4 pt-8">
        <div className="rounded-xl border border-white/15 p-3 text-white/90">
          <CloudSun className="h-10 w-10" />
        </div>
        <div>
          <p className="text-sm opacity-80">Current</p>
          <p className="text-2xl font-semibold text-white">29°C</p>
        </div>
      </div>
    </div>
  );
};

const MapCard: React.FC = () => (
  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
    <iframe
      title="Pakistan Map"
      className="h-[380px] w-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src="https://www.openstreetmap.org/export/embed.html?bbox=60.91%2C23.54%2C78.64%2C37.25&layer=mapnik"
    />
  </div>
);

const OverviewSlide: React.FC<{ cities: City[] }> = ({ cities }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
    <div className="md:col-span-5">
      <WeatherPanel />
    </div>
    <div className="md:col-span-7 h-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cities.map((c) => (
          <Card key={c.name} title={c.name} value={c.value} />
        ))}
      </div>
      <div className="mt-6">
        <MapCard />
      </div>
    </div>
  </div>
);

export default OverviewSlide;
