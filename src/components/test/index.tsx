'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  OctagonAlert,
  Skull,
} from 'lucide-react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// AQI helpers
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

const Test = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const rotationStarted = useRef<boolean>(false);

  // City hotspots configuration
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
      coordinates: [73.0479, 33.6007],
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
      city: 'Attock',
      state: 'Punjab',
      country: 'Pakistan',
      coordinates: [72.3599, 33.7667],
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
  ];

  // Fetch AQI data
  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_AIRVISUAL_KEY || '';

    if (!API_KEY) {
      setHotspotData([
        { city: 'Lahore', aqi: 165, pm25: 95.2 },
        { city: 'Islamabad', aqi: 45, pm25: 22.1 },
        { city: 'Karachi', aqi: 88, pm25: 35.8 },
        { city: 'Faisalabad', aqi: 120, pm25: 68.4 },
        { city: 'Rawalpindi', aqi: 75, pm25: 30.5 },
        { city: 'Peshawar', aqi: 140, pm25: 82.3 },
        { city: 'Multan', aqi: 95, pm25: 45.6 },
        { city: 'Sialkot', aqi: 85, pm25: 38.2 },
        { city: 'Attock', aqi: 55, pm25: 25.8 },
        { city: 'Quetta', aqi: 70, pm25: 32.4 },
        { city: 'Hyderabad', aqi: 110, pm25: 58.7 },
        { city: 'Sukkur', aqi: 90, pm25: 42.3 },
      ]);
      return;
    }

    const controller = new AbortController();
    const BASE_URL = 'https://api.airvisual.com/v2/city';
    const buildUrl = (c: any, key: string) =>
      `${BASE_URL}?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state)}&country=${encodeURIComponent(c.country)}&key=${encodeURIComponent(key)}`;

    (async () => {
      try {
        const results = await Promise.all(
          hotspots.map(async (cfg) => {
            const res = await fetch(buildUrl(cfg, API_KEY), {
              signal: controller.signal,
              cache: 'no-store',
            });
            if (!res.ok) return { city: cfg.city, aqi: null, pm25: null };
            const json = await res.json();
            const aqius = getAqius(json);
            const pm25 = json?.data?.current?.pollution?.p2?.conc ?? null;
            return { city: cfg.city, aqi: aqius, pm25 };
          })
        );
        setHotspotData(results);
      } catch (err) {
        console.error('AQI fetch error:', err);
        setHotspotData([]);
      }
    })();

    return () => controller.abort();
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [69.3451, 30.3753], // Center of Pakistan
        zoom: 2, // Start from zoomed out
        projection: 'globe',
        pitch: 0,
      });

      mapInstance.current = map;

      // Add globe entrance animation
      setTimeout(() => {
        map.easeTo({
          zoom: 3.5,
          center: [69.3451, 30.3753],
          duration: 3000,
          easing: (t) => {
            return t * (2 - t);
          },
        });
      }, 500);

      // Add navigation controls
      mapInstance.current.addControl(new mapboxgl.NavigationControl());

      // Disable map rotation using right click + drag and touch rotation gesture
      mapInstance.current.dragRotate.disable();
      mapInstance.current.touchZoomRotate.disableRotation();

      // Add atmosphere and stars for better globe effect
      map.on('style.load', () => {
        // Set dark theme with white landmasses
        map.setFog({
          'horizon-blend': 0.02,
          'space-color': '#000000',
          'star-intensity': 0.15,
        });

        // Adjust the map style for dark theme
        map.setPaintProperty('land', 'background-color', '#ffffff');
        map.setPaintProperty('water', 'fill-color', '#000000');

        // Add Pakistan boundary data and markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
        mapInstance.current!.addSource('pakistan-boundary', {
          type: 'geojson',
          data: require('./pakistan.json'),
        });

        // Add the fill layer
        mapInstance.current!.addLayer({
          id: 'pakistan-fill',
          type: 'fill',
          source: 'pakistan-boundary',
          paint: {
            'fill-color': '#13A94B',
            'fill-opacity': 0.3,
          },
        });

        // Add the outline layer
        mapInstance.current!.addLayer({
          id: 'pakistan-outline',
          type: 'line',
          source: 'pakistan-boundary',
          paint: {
            'line-color': '#13A94B',
            'line-width': 2,
          },
        });
      });
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        rotationStarted.current = false;
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add city markers when data is available
  useEffect(() => {
    if (!mapInstance.current || !hotspotData.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    hotspots.forEach((hotspot) => {
      const data = hotspotData.find((d) => d.city === hotspot.city) || {};
      const { aqi, pm25 } = data;
      const info = aqiInfo(aqi);

      // Create marker element
      const el = document.createElement('div');
      el.className =
        'rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-125';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.backgroundColor = info.color;

      // Add popup on hover
      let popup: mapboxgl.Popup | null = null;
      el.addEventListener('mouseenter', () => {
        popup = new mapboxgl.Popup({
          offset: 15,
          closeButton: false,
          closeOnClick: false,
        })
          .setLngLat(hotspot.coordinates as [number, number])
          .setHTML(
            `
                    <div style="min-width:180px; font-family: system-ui; padding: 8px;">
                        <div style="font-weight:600; margin-bottom:8px; font-size:16px;">${hotspot.city}</div>
                        <div style="font-size:13px; color:#374151;">
                            <div style="margin-bottom:4px;">
                                <strong>AQI:</strong> 
                                <span style="color:${info.color}; font-weight:600;">${aqi || '—'}</span>
                            </div>
                            <div style="margin-bottom:4px;">
                                <strong>Status:</strong> 
                                ${info.status === 'USG' ? 'Unhealthy for Sensitive Groups' : info.status}
                            </div>
                            <div>
                                <strong>PM2.5:</strong> 
                                ${pm25 ? `${pm25.toFixed(1)} μg/m³` : '—'}
                            </div>
                        </div>
                    </div>
                `
          )
          .addTo(mapInstance.current!);
      });

      el.addEventListener('mouseleave', () => {
        if (popup) {
          popup.remove();
          popup = null;
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(hotspot.coordinates as [number, number])
        .addTo(mapInstance.current!);

      markersRef.current.push(marker);
    });
  }, [hotspotData]);

  return (
    <div className="relative w-full h-screen">
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default Test;
