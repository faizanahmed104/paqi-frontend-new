'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { aqiInfo, getAqius } from '@/utils/helpers';
import { API_KEY, BASE_URL, MAPBOX_ACCESS_TOKEN } from '@/libs/api';
import { FAKE_HOTSPOTS, HOTSPOTS } from '../common/constant';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch AQI data
  useEffect(() => {
    if (!API_KEY) {
      setHotspotData(FAKE_HOTSPOTS);
      return;
    }

    const controller = new AbortController();
    const buildUrl = (c: any, key: string) =>
      `${BASE_URL}?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state)}&country=${encodeURIComponent(c.country)}&key=${encodeURIComponent(key)}`;

    (async () => {
      try {
        const results = await Promise.all(
          HOTSPOTS.map(async (cfg) => {
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
  }, [API_KEY]);

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
              <span class="home-icon">
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  style="margin-left:2px;"
                  stroke="currentColor"
                  stroke-width="2"
                  width="24"
                  height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15V10.5M9 21v-6h6v6"/>
                </svg>
              </span>
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
    if (map.getSource('HOTSPOTS')) {
      map.removeLayer('HOTSPOTS-layer');
      map.removeSource('HOTSPOTS');
    }

    // Create GeoJSON data for HOTSPOTS
    const hotspotsGeoJSON = {
      type: 'FeatureCollection',
      features: HOTSPOTS.map((hotspot) => {
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
    map.addSource('HOTSPOTS', {
      type: 'geojson',
      data: hotspotsGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add hotspots layer
    map.addLayer({
      id: 'hotspots-layer',
      type: 'circle',
      source: 'HOTSPOTS',
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

      if (map.getSource('HOTSPOTS')) {
        map.off('mouseenter', 'hotspots-layer', handleMouseEnter);
        map.off('mouseleave', 'hotspots-layer', handleMouseLeave);
        map.removeLayer('hotspots-layer');
        map.removeSource('HOTSPOTS');
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
