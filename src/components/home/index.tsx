import AirQualityInsights from './air-quality-insights';
import Counter from './counter';
import Header from './header';
import Partners from './partners';
import Map from './map';
import Blog from './blog';
import Podcast from './podcast';
import Footer from '../common/footer';

function Home() {
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

export default Home;
