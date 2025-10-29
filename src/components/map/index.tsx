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
            if (!res.ok) return { city: cfg.city, aqi: null, pm25: null, timestamp: null };
            const json = await res.json();
            const aqius = getAqius(json);
            const pm25 = json?.data?.current?.pollution?.p2?.conc ?? null;
            const timestamp = json?.data?.current?.pollution?.ts ?? null;
            return { city: cfg.city, aqi: aqius, pm25, timestamp };
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

          // Add the outline layer
          map.addLayer({
            id: 'pakistan-outline',
            type: 'line',
            source: 'pakistan-boundary',
            paint: {
              'line-color': '#022d12',
              'line-width': 2,
              'line-opacity': 0.8,
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
    const map = mapInstance.current;
    if (!map || !mapLoaded || !hotspotData || hotspotData.length === 0) return;

    // Clear existing markers and sources
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing sources if they exist
    if (map.getSource('HOTSPOTS')) {
      map.removeLayer('HOTSPOTS-layer');
      map.removeSource('HOTSPOTS');
    }

    // Calculate the cutoff time (1 hour ago)
    const oneHourAgo = new Date(Date.now() - 7200 * 1000);

    // Create GeoJSON data for HOTSPOTS
    const hotspotsGeoJSON = {
      type: 'FeatureCollection',
      features: HOTSPOTS.map((hotspot) => {
        const data = hotspotData.find((d) => d.city === hotspot.city) || {};
        const { aqi, pm25 } = data;
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
              timestamp: timestamp ?? null,
            },
            geometry: {
              type: 'Point',
              coordinates: hotspot.coordinates,
            },
          };
        })
        // This line filters out all features where aqi is not a number
        .filter((feature) => {
          const aqi = feature.properties.aqi;
          const ts = feature.properties.timestamp;

          // 1. Must have a valid AQI
          const hasValidAqi = typeof aqi === 'number';

          // 2. Must have a timestamp (this filters out fallback data)
          if (!ts) {
            return false;
          }

          // 3. Timestamp must be more recent than 1 hour ago
          const featureTime = new Date(ts);
          const isRecent = featureTime > oneHourAgo;

          return hasValidAqi && isRecent;
        }),
    };

    // Add hotspots source
    map.addSource('HOTSPOTS', {
      type: 'geojson',
      data: hotspotsGeoJSON as GeoJSON.FeatureCollection,
    });

    // Add circle layer
    map.addLayer({
      id: 'hotspots-circles',
      type: 'circle',
      source: 'HOTSPOTS',
      paint: {
        // Use a 'step' expression for zoom-based radius
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5.5, 7,   // At zoom 8 (and below), radius is 5px
          6, 16  // At zoom 9 (and above), radius is 14px
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
      source: 'HOTSPOTS',
      minzoom: 6.5,
      layout: {
        'text-field': ['get', 'pm25Label'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 12,
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
            dateStyle: 'long',
            timeStyle: 'short',
          });
          timestampHtml = `<div style="margin-top: 5px; padding-top: 5px; font-size: 12px; color: #555;"><normal>Last Update:</normal> ${ts}</div>`;
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
            <div style="min-width:450px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
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
