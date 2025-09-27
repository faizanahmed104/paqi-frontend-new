import React from 'react';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
}> = ({ title, value, subtitle }) => (
  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white/90">
    <p className="text-center text-lg font-medium opacity-90">{title}</p>
    <div className="mt-3 text-center">
      <div className="inline-flex items-baseline gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4">
        <span className="text-5xl font-extrabold text-white">{value}</span>
      </div>
      {subtitle && <p className="mt-2 text-xs opacity-80">{subtitle}</p>}
    </div>
  </div>
);

const MiniBarChart: React.FC = () => {
  // Static bars to visually match the mock
  const bars = [
    4, 5, 8, 12, 18, 24, 28, 26, 22, 16, 10, 6, 4, 3, 3, 4, 5, 6, 6, 5, 4, 4, 5,
    7,
  ];
  return (
    <div className="relative w-full rounded-2xl border border-black/5 bg-white p-4 text-zinc-900">
      {/* top controls */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="font-medium">21.5 μg/m³</span>
          <span className="text-zinc-500">Moderate</span>
          <span className="text-zinc-500">• 08:00 Aug 26</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button className="rounded-full px-3 py-1 text-zinc-700">
            Hourly
          </button>
          <button className="rounded-full px-3 py-1 text-zinc-400">
            Daily
          </button>
          <select className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-700">
            <option>PM2.5</option>
            <option>PM10</option>
          </select>
        </div>
      </div>

      {/* bars */}
      <div className="mt-2 flex h-40 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`${h > 20 ? 'bg-orange-400' : h > 10 ? 'bg-yellow-400' : 'bg-green-400'} flex-1 rounded-sm`}
            style={{ height: `${h * 2}px` }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
        <span>11:00</span>
        <span>17:00</span>
        <span>23:00</span>
        <span>05:00</span>
      </div>

      <div className="mt-3 flex justify-end">
        <button className="rounded-md bg-emerald-900 px-4 py-2 text-xs text-white">
          Request Data
        </button>
      </div>
    </div>
  );
};

const EmissionTile: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white/90">
    <p className="text-sm opacity-90">{label}</p>
    <p className="mt-2 text-4xl font-bold text-white">{value}</p>
    <p className="text-xs opacity-80">kilotons</p>
  </div>
);

const EmissionsPanel: React.FC = () => (
  <div className="rounded-3xl bg-emerald-800/40 p-6">
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="text-xl font-semibold text-white">Emissions Inventory</p>
        <p className="text-sm opacity-80">
          Select Year: <span className="font-medium">2021</span>
        </p>
      </div>
      <button className="rounded-full bg-black/20 px-4 py-2 text-sm text-white">
        See details
      </button>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
      <EmissionTile label="Total Emissions" value={394} />
      <EmissionTile label="Transport" value={150} />
      <EmissionTile label="Industry" value={100} />
      <EmissionTile label="Power" value={50} />
      <EmissionTile label="Brick Kilns" value={94} />
    </div>
  </div>
);

const CityDetailSlide: React.FC = () => (
  <div className="space-y-6">
    {/* City name pill */}
    <div className="inline-block rounded-full bg-white/15 px-6 py-2 text-lg font-semibold text-white/90">
      Lahore
    </div>

    {/* Top stats */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        title="City Rank"
        value={1}
        subtitle="Most polluted in Pakistan"
      />
      <StatCard title="AQI" value={1} subtitle="Most polluted in Pakistan" />
      <StatCard
        title="Top Polluted Station"
        value="Mall Road"
        subtitle="Most polluted area in Lahore"
      />
    </div>

    {/* Chart */}
    <MiniBarChart />

    {/* Emissions */}
    <EmissionsPanel />
  </div>
);

export default CityDetailSlide;
