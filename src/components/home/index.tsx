import AirQualityInsights from './air-quality-insights';
import Counter from './counter';
import Header from './header';
import Partners from './partners';
import Map from './map';
import Blog from './blog';
import Footer from '../footer';
import Podcast from './podcast';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <AirQualityInsights />
      <Counter />
      <Map />
      <Partners />
      <Podcast />
      <Blog />
      <Footer />
    </main>
  );
}
