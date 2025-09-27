import React from 'react';
import { Search, MapPin } from 'lucide-react';

type Pollutant = { label: string; value: number; unit?: string };

const StatRow: React.FC<Pollutant> = ({ label, value, unit = 'µg/m³' }) => {
  // simple progress 0–100 visual; clamp for safety
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <div className="text-xs text-white/80">{label}</div>
      <div className="flex-1">
        <div className="h-1.5 w-full rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-white/60"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="min-w-[72px] text-right text-xs text-white/80">
        {value.toFixed(1)} <span className="opacity-70">{unit}</span>
      </div>
    </div>
  );
};

const Badge: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex items-center gap-3">
    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 ring-1 ring-white/20">
      <span className="text-3xl font-extrabold text-white leading-none">
        {value}
      </span>
      <span className="rounded-md bg-amber-400/90 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
        {label}
      </span>
    </div>
  </div>
);

const LiveMapSlide: React.FC = () => {
  const pollutants: Pollutant[] = [
    { label: 'PM2.5', value: 57.5 },
    { label: 'PM10', value: 74.8 },
    { label: 'PM1', value: 35.1 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 h-full">
      {/* Left sidebar */}
      <aside className="md:col-span-4">
        <div className="rounded-2xl bg-emerald-950/40 p-4 h-full">
          {/* Search */}
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ">
            <Search className="h-4 w-4 text-white/70" />
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
              placeholder="Search"
              aria-label="Search"
            />
          </div>

          {/* Title */}
          <p className="text-sm font-semibold text-white/90">
            Live Air Quality Map
          </p>

          {/* City */}
          <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            <span>Lahore</span>
          </div>

          {/* AQI */}
          <div className="mt-5">
            <p className="text-xs text-white/70">Air Quality Index (AQI)</p>
            <div className="mt-2">
              <Badge value={95} label="Moderate" />
            </div>
          </div>

          {/* Pollutants */}
          <div className="mt-5 space-y-2">
            {pollutants.map((p) => (
              <StatRow key={p.label} {...p} />
            ))}
          </div>
        </div>
      </aside>

      {/* Right: big map */}
      <section className="md:col-span-8">
        <div className="relative overflow-hidden rounded-3xl bg-white h-full">
          <iframe
            title="Live Air Quality Map"
            className="h-[100%] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=60.91%2C23.54%2C78.64%2C37.25&layer=mapnik"
          />
        </div>
      </section>
    </div>
  );
};

export default LiveMapSlide;
