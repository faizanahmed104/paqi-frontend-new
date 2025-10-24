'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { aqiInfo, getAqius } from '@/utils/helpers';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

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
        style: 'mapbox://styles/mapbox/standard',
        center: [69.3451, 30.3753], // Center of Pakistan
        zoom: 3, // Start from zoomed out
        projection: 'globe',
        pitch: 0,
        antialias: true, // Enable antialiasing for smoother rendering
      });

      mapInstance.current = map;

      // Add globe entrance animation
      setTimeout(() => {
        map.easeTo({
          zoom: 5,
          center: [69.3451, 30.3753],
          duration: 3000,
          easing: (t) => {
            return t * (2 - t);
          },
        });
      }, 500);

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add custom home button control
      class HomeControl {
        _map: mapboxgl.Map | null = null;
        _container: HTMLDivElement | null = null;

        onAdd(map: mapboxgl.Map) {
          this._map = map;
          this._container = document.createElement('div');
          this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
          this._container.innerHTML = `
            <button class="home-button" type="button" title="Go to home">
              <span class="home-icon"></span>
            </button>
          `;

          this._container.addEventListener('click', () => {
            window.location.href = '/';
          });

          return this._container;
        }

        onRemove() {
          this._container?.parentNode?.removeChild(this._container);
          this._map = null;
        }
      }

      map.addControl(new HomeControl(), 'top-right');

      // Disable map rotation using right click + drag and touch rotation gesture
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      // Add atmosphere and stars for better globe effect
      map.on('style.load', () => {
        // Set dark theme with white landmasses
        map.setFog({
          'horizon-blend': 0.02,
          'space-color': '#000000',
          'star-intensity': 0.15,
        });

        // Add Pakistan boundary data
        try {
          map.addSource('pakistan-boundary', {
            type: 'geojson',
            data: require('./pakistan.json'),
          });

          // Add the fill layer
          map.addLayer({
            id: 'pakistan-fill',
            type: 'fill',
            source: 'pakistan-boundary',
            paint: {
              'fill-color': '#13A94B',
              'fill-opacity': 0.1,
            },
          });

          // Add the outline layer
          map.addLayer({
            id: 'pakistan-outline',
            type: 'line',
            source: 'pakistan-boundary',
            paint: {
              'line-color': '#13A94B',
              'line-width': 2,
            },
          });
        } catch (error) {
          console.error('Error loading Pakistan boundary:', error);
        }

        // Mark map as loaded
        setMapLoaded(true);
      });
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Add city markers when data is available and map is loaded
  useEffect(() => {
    if (!mapInstance.current || !mapLoaded || !hotspotData.length) return;

    const map = mapInstance.current;

    // Clear existing markers and sources
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing sources if they exist
    if (map.getSource('hotspots')) {
      map.removeLayer('hotspots-layer');
      map.removeSource('hotspots');
    }

    // Create GeoJSON data for hotspots
    const hotspotsGeoJSON = {
      type: 'FeatureCollection',
      features: hotspots.map((hotspot) => {
        const data = hotspotData.find((d) => d.city === hotspot.city) || {};
        const { aqi, pm25 } = data;
        const info = aqiInfo(aqi);

        return {
          type: 'Feature',
          properties: {
            city: hotspot.city,
            aqi: aqi || null,
            pm25: pm25 || null,
            status: info.status,
            color: info.color,
          },
          geometry: {
            type: 'Point',
            coordinates: hotspot.coordinates,
          },
        };
      }),
    };

    // Add hotspots source
    map.addSource('hotspots', {
      type: 'geojson',
      data: hotspotsGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add hotspots layer
    map.addLayer({
      id: 'hotspots-layer',
      type: 'circle',
      source: 'hotspots',
      paint: {
        'circle-radius': 10,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9,
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

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15,
        })
          .setLngLat(coordinates)
          .setHTML(
            `
            <div style="min-width:180px; padding: 8px;">
                <div style="font-weight:600; margin-bottom:8px; font-size:16px;">${properties?.city || ''}</div>
                <div style="font-size:13px; color:#374151;">
                    <div style="margin-bottom:4px;">
                        <strong>AQI:</strong> 
                        <span style="color:${properties?.color || '#9CA3AF'}; font-weight:600;">${properties?.aqi || '—'}</span>
                    </div>
                    <div style="margin-bottom:4px;">
                        <strong>Status:</strong> 
                        ${properties?.status === 'USG' ? 'Unhealthy for Sensitive Groups' : properties?.status || '—'}
                    </div>
                    <div>
                        <strong>PM2.5:</strong> 
                        ${properties?.pm25 ? `${Number(properties.pm25).toFixed(1)} μg/m³` : '—'}
                    </div>
                </div>
            </div>
            `
          )
          .addTo(map);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      // Remove all popups
      const popups = document.getElementsByClassName('mapboxgl-popup');
      Array.from(popups).forEach((popup) => {
        popup.remove();
      });
    };

    map.on('mouseenter', 'hotspots-layer', handleMouseEnter);
    map.on('mouseleave', 'hotspots-layer', handleMouseLeave);

    // Cleanup function
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (map.getSource('hotspots')) {
        map.off('mouseenter', 'hotspots-layer', handleMouseEnter);
        map.off('mouseleave', 'hotspots-layer', handleMouseLeave);
        map.removeLayer('hotspots-layer');
        map.removeSource('hotspots');
      }
    };
  }, [hotspotData, mapLoaded]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0 overflow-hidden" />
    </div>
  );
};

export default Map;
