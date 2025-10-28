'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Button from '@/ui-elements/Button';
import {
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  OctagonAlert,
  Skull,
} from 'lucide-react';
import { AirLoader } from '@/ui-elements/Loader';

mapboxgl.accessToken =
  (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string) || '';

/* ---------- AQI helpers ---------- */
function aqiInfo(aqiNum?: number | null) {
  const aqi = typeof aqiNum === 'number' ? aqiNum : -1;
  if (aqi >= 0 && aqi <= 50)
    return { status: 'Good', Icon: Smile, color: '#56AF7E' };
  if (aqi <= 100) return { status: 'Moderate', Icon: Meh, color: '#DDAE5B' };
  if (aqi <= 150) return { status: 'USG', Icon: Frown, color: '#E97E3C' };
  if (aqi <= 200)
    return { status: 'Unhealthy', Icon: AlertTriangle, color: '#CA5C58' };
  if (aqi <= 300)
    return { status: 'Very Unhealthy', Icon: OctagonAlert, color: '#A070B6' };
  if (aqi > 300) return { status: 'Hazardous', Icon: Skull, color: '#A52A2A' };
  return { status: '—', Icon: Meh, color: '#9CA3AF' };
}

function getAqius(resp: any): number | null {
  return resp?.data?.current?.pollution?.aqius ?? null;
}

/* ---------- Component ---------- */
function Map() {
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // Hotspot definitions (keeps the original order / list)
  const hotspots = [
    {
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.3587, 31.5204],
    },
    {
      city: 'Islamabad',
      state: 'Islamabad',
      country: 'Pakistan',
      coordinates: [73.0551, 33.6844],
    },
    {
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      coordinates: [67.0099, 24.8615],
    },
    {
      city: 'Faisalabad',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.135, 31.4504],
    },
    {
      city: 'Rawalpindi',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.0479, 33.5], // Adjusted to prevent overlap
    },
    {
      city: 'Peshawar',
      state: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      coordinates: [71.5249, 34.0151],
    },
    {
      city: 'Multan',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [71.5249, 30.1575],
    },
    {
      city: 'Sialkot',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.5229, 32.4945],
    },
    {
      city: 'Quetta',
      state: 'Balochistan',
      country: 'Pakistan',
      coordinates: [67.0099, 30.1798],
    },
    {
      city: 'Hyderabad',
      state: 'Sindh',
      country: 'Pakistan',
      coordinates: [68.3738, 25.396],
    },
    {
      city: 'Sukkur',
      state: 'Sindh',
      country: 'Pakistan',
      coordinates: [68.857, 27.7052],
    },
    // --- NEW CITIES START HERE ---
    {
      city: 'Bahawalpur',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [71.7, 29.39],
    },
    {
      city: 'Bhopalwala',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.36, 32.43],
    },
    {
      city: 'Chak Jhumra',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.19, 31.56],
    },
    {
      city: 'Daska Kalan',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.35, 32.32],
    },
    {
      city: 'Eminabad',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.26, 32.04],
    },
    {
      city: 'Gujranwala',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.19, 32.1567],
    },
    {
      city: 'Hundal',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.52922, 32.42274],
    },
    {
      city: 'Jhang',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [72.33, 31.28],
    },
    {
      city: 'Jhelum',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.73, 32.94],
    },
    {
      city: 'Kahna Nau',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.369, 31.3671],
    },
    {
      city: 'Kasur',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.45, 31.1167],
    },
    {
      city: 'Kotli Loharan',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.5, 32.59],
    },
    {
      city: 'Lodhran',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [71.63, 29.55],
    },
    {
      city: 'Mandi Bahauddin',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.48, 32.58],
    },
    {
      city: 'Murree',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.39, 33.91],
    },
    {
      city: 'Pattoki',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [73.85, 31.02],
    },
    {
      city: 'Qadirpur Ran',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [71.66, 30.29],
    },
    {
      city: 'Rahim Yar Khan',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [70.3, 28.42],
    },
    {
      city: 'Raiwind',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.2169, 31.3654],
    },
    {
      city: 'Rojhan',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [70.13, 28.81],
    },
    {
      city: 'Sambrial',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.35, 32.48],
    },
    {
      city: 'Sheikhupura',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [74.0, 31.71],
    },
    {
      city: "Khairpur Mir's",
      state: 'Sindh',
      country: 'Pakistan',
      coordinates: [68.76, 27.53],
    },
    {
      city: 'Mirpur Khas',
      state: 'Sindh',
      country: 'Pakistan',
      coordinates: [69.01, 25.51],
    },
    {
      city: 'Kharan',
      state: 'Balochistan',
      country: 'Pakistan',
      coordinates: [65.42, 28.59],
    },
    {
      city: 'Abbottabad',
      state: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      coordinates: [73.2194, 34.1558],
    },
    {
      city: 'Haripur',
      state: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      coordinates: [72.93, 33.99],
    },
    {
      city: 'Malam Jabba',
      state: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      coordinates: [72.57, 34.8],
    },
  ];

  const API_KEY = process.env.NEXT_PUBLIC_AIRVISUAL_KEY || '';

  /* ---------- fetch AQI data (or fallback) ---------- */
  useEffect(() => {
    if (!API_KEY) {
      // fallback demo values if key not present
      setHotspotData([
        { city: 'Lahore', aqi: 165, pm25: 95.2 },
        { city: 'Islamabad', aqi: 45, pm25: 22.1 },
        { city: 'Karachi', aqi: 88, pm25: 35.8 },
        { city: 'Faisalabad', aqi: 120, pm25: 68.4 },
        { city: 'Rawalpindi', aqi: 75, pm25: 30.5 },
        { city: 'Peshawar', aqi: 140, pm25: 82.3 },
        { city: 'Multan', aqi: 95, pm25: 45.6 },
        { city: 'Sialkot', aqi: 85, pm25: 38.2 },
        { city: 'Quetta', aqi: 70, pm25: 32.4 },
        { city: 'Hyderabad', aqi: 110, pm25: 58.7 },
        { city: 'Sukkur', aqi: 90, pm25: 42.3 },
      ]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const BASE_URL = 'https://api.airvisual.com/v2/city';
    const buildUrl = (c: any, key: string) =>
      `${BASE_URL}?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state)}&country=${encodeURIComponent(
        c.country
      )}&key=${encodeURIComponent(key)}`;

    setLoading(true);
    (async () => {
      try {
        const results = await Promise.all(
          hotspots.map(async (cfg) => {
            const url = buildUrl(cfg, API_KEY);
            const res = await fetch(url, {
              signal: controller.signal,
              cache: 'no-store',
            });
            if (!res.ok) {
              // don't throw - return placeholder for that city
              return { city: cfg.city, aqi: null, pm25: null, timestamp: null };
            }
            const json = await res.json();
            const aqius = getAqius(json);
            // AirVisual sometimes has different naming for pm2.5; try a few options:
            const pm25 = json?.data?.current?.pollution?.p2?.conc ?? null;
            const timestamp = json?.data?.current?.pollution?.ts ?? null;
            return { city: cfg.city, aqi: aqius, pm25, timestamp };
          })
        );
        // ensure order matches hotspots list (map above returns same order)
        setHotspotData(results);
      } catch (err) {
        // on any error, fall back to safe empty array (UI will show no data)
        console.error('AQI fetch error:', err);
        setHotspotData([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [API_KEY]);

  /* ---------- init Mapbox map and add Pakistan outline ---------- */
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: [71.5, 30.2], // Center Pakistan
        zoom: 3,
      });

      // Add zoom and rotation controls
      mapInstance.current.addControl(new mapboxgl.NavigationControl());

      // Load Pakistan boundary data when map loads
      mapInstance.current.on('load', () => {
        try {
          // Add the GeoJSON source using require (same as your working version)
          mapInstance.current!.addSource('pakistan-boundary', {
            type: 'geojson',
            data: require('./pakistan.json'),
          });

          // Add the outline layer (same as your working version)
          mapInstance.current!.addLayer({
            id: 'pakistan-outline',
            type: 'line',
            source: 'pakistan-boundary',
            paint: {
              'line-color': '#13A94B',
              'line-width': 2,
              'line-opacity': 0.8,
            },
          });

          // Mark map as loaded
          setMapLoaded(true);
        } catch (error) {
          console.error('Error loading Pakistan boundary:', error);
          // Still mark as loaded even if boundary fails to load
          setMapLoaded(true);
        }
      });
    }

    // Cleanup function
    return () => {
      try {
        if (mapInstance.current) {
          if (mapInstance.current.loaded()) {
            mapInstance.current.remove();
          }
          mapInstance.current = null;
          setMapLoaded(false);
        }
      } catch (error) {
        console.log('Map cleanup warning:', error);
      }
    };
  }, []);

  /* ---------- create markers (after both map and data are ready) ---------- */
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded || !hotspotData || hotspotData.length === 0) return;

    // Remove existing layers/sources if they exist - with safety checks
    try {
      if (map.getLayer('hotspots-labels')) {
        map.removeLayer('hotspots-labels');
      }
      if (map.getLayer('hotspots-circles')) {
        map.removeLayer('hotspots-circles');
      }
      if (map.getSource('hotspots')) {
        map.removeSource('hotspots');
      }
    } catch (error) {
      console.log('Cleanup warning:', error);
    }

    // Create GeoJSON data for hotspots
    const hotspotsGeoJSON = {
      type: 'FeatureCollection',
      features: hotspots
        .map((hotspot) => {
          const data =
            hotspotData.find(
              (d) =>
                String(d.city).toLowerCase() ===
                String(hotspot.city).toLowerCase()
            ) ?? {};
          const aqi =
            typeof data.aqi === 'number' ? data.aqi : Number(data.aqi) || null;
          const pm25 = data.pm25 ?? null;
          const info = aqiInfo(aqi);
          const timestamp = data.timestamp ?? null;

          // Create a formatted label for the map
          const pm25Label = pm25 ? Number(pm25).toFixed(0) : '—';

          return {
            type: 'Feature',
            properties: {
              city: hotspot.city,
              aqi: aqi, // Pass raw aqi for filtering
              pm25: pm25 || null,
              pm25Label: pm25Label,
              status: info.status,
              color: info.color,
              timestamp: timestamp,
            },
            geometry: {
              type: 'Point',
              coordinates: hotspot.coordinates,
            },
          };
        })
        .filter((feature) => typeof feature.properties.aqi === 'number'),
    };

    // Add hotspots source
    map.addSource('hotspots', {
      type: 'geojson',
      data: hotspotsGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add circle layer
    map.addLayer({
      id: 'hotspots-circles',
      type: 'circle',
      source: 'hotspots',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5, 5,
          6, 14
        ],
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 3,
        'circle-stroke-color': ['get', 'color'],
        'circle-stroke-opacity': 0.7,
        'circle-opacity': 1,
      },
    });

    // Add layer for PM2.5 labels
    map.addLayer({
      id: 'hotspots-labels',
      type: 'symbol',
      source: 'hotspots',
      minzoom: 7,
      layout: {
        'text-field': ['get', 'pm25Label'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 11,
        // 'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: {
        'text-color': [
          'case',
          [
            'any',
            ['==', ['get', 'status'], 'Moderate'],
            ['==', ['get', 'status'], 'Good'],
          ],
          '#333333', // Dark text for light circles
          '#FFFFFF', // White text for dark circles
        ],
      },
    });

    // Add hover effect
    const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';

      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const geometry = feature.geometry as GeoJSON.Point;
        const coordinates = geometry.coordinates.slice() as [number, number];
        const properties = feature.properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Conditionally create the timestamp HTML
        let timestampHtml = '';
        
        // Only if the timestamp exists (i.e., not fallback data), create the HTML line
        if (properties?.timestamp) {
          const ts = new Date(properties.timestamp).toLocaleString(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
          });
          timestampHtml = `<div style="border-top: 1px solid #eee; margin-top: 5px; padding-top: 5px; font-size: 12px; color: #555;"><strong>Last Update:</strong> ${ts}</div>`;
        }

        new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'custom-popup',
          offset: 15,
        })
          .setLngLat(coordinates)
          .setHTML(
            `
            <div style="min-width:180px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 4px;">
              <div style="font-weight:600; margin-bottom:8px; font-size:16px; color:#111;">${properties?.city}</div>
              <div style="font-size:13px; color:#374151; line-height:1.4;">
                <div style="margin-bottom:3px;"><strong>AQI:</strong> <span style="color:${properties?.color}; font-weight:600;">${properties?.aqi ?? '—'}</span></div>
                <div style="margin-bottom:3px;"><strong>Status:</strong> ${properties?.status === 'USG' ? 'Unhealthy for Sensitive Groups' : properties?.status}</div>
                <div style="margin-bottom:3px;"><strong>PM2.5:</strong> ${properties?.pm25 ? Number(properties.pm25).toFixed(1) : '—'} μg/m³</div>
                ${timestampHtml}
              </div>
            </div>
          `
          )
          .addTo(map);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      const popups = document.getElementsByClassName('mapboxgl-popup');
      Array.from(popups).forEach((popup) => popup.remove());
    };

    // Listen on the circle layer
    map.on('mouseenter', 'hotspots-circles', handleMouseEnter);
    map.on('mouseleave', 'hotspots-circles', handleMouseLeave);

    // Cleanup function
    return () => {
      if (map && map.loaded()) {
        try {
          map.off('mouseenter', 'hotspots-circles', handleMouseEnter);
          map.off('mouseleave', 'hotspots-circles', handleMouseLeave);
          if (map.getLayer('hotspots-labels')) {
            map.removeLayer('hotspots-labels');
          }
          if (map.getLayer('hotspots-circles')) {
            map.removeLayer('hotspots-circles');
          }
          if (map.getSource('hotspots')) {
            map.removeSource('hotspots');
          }
        } catch (error) {
          console.log('Cleanup warning:', error);
        }
      }
    };
  }, [hotspotData, mapLoaded]);

  return (
    <div className="p-4">
      <div className="bg-green-100 rounded-3xl">
        <div className="max-w-7xl mx-auto rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Interactive Map */}
            <div className="relative -mx-4 -mt-4 sm:mt-0  sm:mx-0">
              <div
                ref={mapContainer}
                className="relative rounded-xl min-h-[400px] lg:min-h-[500px] overflow-hidden"
              />
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-2xl flex items-center justify-center">
                  <AirLoader />
                </div>
              )}
            </div>

            {/* Right - Content */}
            <div className="space-y-6 lg:pl-8 text-right flex flex-col items-end">
              <span className="bg-[#12352480] text-white px-4 py-2 rounded-full text-sm font-medium">
                Live Air Quality Map
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Live Air Quality
                <br />
                Insights Across
                <br />
                <span className="text-[#13A94B]">Pakistan</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Our network provides a real-time snapshot of the air quality in
                major urban centers. Explore the map to see the current annual
                average PM2.5 levels
              </p>

              <div className="pt-4">
                <Button
                  variant="outlined"
                  size="lg"
                  shape="square"
                  iconRight="→"
                  className="text-black border-black hover:bg-[#123524] hover:text-white"
                >
                  Interactive Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>
        {`
          .custom-popup .mapboxgl-popup-content {
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e7eb;
          }
          .custom-popup .mapboxgl-popup-tip {
            border-top-color: white;
          }
          .persistent-popup .mapboxgl-popup-content {
            background-color: #f9fafb;
            border: 2px solid #13a94b;
          }
        `}
      </style>
    </div>
  );
}

export default Map;
