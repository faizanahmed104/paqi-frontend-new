'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Button from '@/ui-elements/Button';
import { AirLoader } from '@/ui-elements/Loader';
import { API_KEY, buildUrl, controller, MAPBOX_ACCESS_TOKEN } from '@/libs/api';
import { FAKE_HOTSPOTS, HOTSPOTS } from '@/components/common/constant';
import { aqiInfo, getAqius } from '@/utils/helpers';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

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

  const API_KEY = process.env.NEXT_PUBLIC_AIRVISUAL_KEY || '';

  /* ---------- fetch AQI data (or fallback) ---------- */
  useEffect(() => {
    if (!API_KEY) {
      setHotspotData(FAKE_HOTSPOTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const results = await Promise.all(
          HOTSPOTS.map(async (cfg) => {
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

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded || !hotspotData || hotspotData.length === 0) return;

    // Remove existing sources if they exist - with safety checks
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
      features: hotspots.map((hotspot) => {
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
          if (map.getSource('HOTSPOTS')) {
            map.removeSource('HOTSPOTS');
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
    </div>
  );
}

export default Map;
