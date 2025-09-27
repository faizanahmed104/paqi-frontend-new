import Navbar from '../common/navbar'; // <- your existing navbar
import CityDetailSlide from './CityDetails';
import FooterBar from './FooterBar';
import LiveMapSlide from './LiveMap';
import OverviewSlide from './Overview';
import Slider from './Slider';

export default function Dashboard() {
  const cities = [
    { name: 'Karachi', value: 25 },
    { name: 'Lahore', value: 100 },
    { name: 'Islamabad', value: 30 },
    { name: 'Peshawar', value: 110 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-900/80 to-zinc-200 text-white flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* SLIDER */}
      <main className="mx-auto w-full max-w-7xl px-6 py-32 flex-1">
        <Slider>
          <OverviewSlide cities={cities} />
          <CityDetailSlide />
          <LiveMapSlide />
        </Slider>
      </main>

      {/* FOOTER */}
      <FooterBar />
    </div>
  );
}
