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
              return { city: cfg.city, aqi: null, pm25: null };
            }
            const json = await res.json();
            const aqius = getAqius(json);
            // AirVisual sometimes has different naming for pm2.5; try a few options:
            const pm25 = json?.data?.current?.pollution?.p2?.conc ?? null;
            return { city: cfg.city, aqi: aqius, pm25 };
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
        style: 'mapbox://styles/mapbox/light-v11',
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

    try {
      if (map.getLayer('hotspots-layer')) {
        map.removeLayer('hotspots-layer');
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
      features: HOTSPOTS.map((hotspot) => {
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

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
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
                <div><strong>PM2.5:</strong> ${properties?.pm25 ? Number(properties.pm25).toFixed(1) : '—'} μg/m³</div>
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
      Array.from(popups).forEach((popup) => popup.remove());
    };

    map.on('mouseenter', 'hotspots-layer', handleMouseEnter);
    map.on('mouseleave', 'hotspots-layer', handleMouseLeave);

    // Cleanup function with safety checks
    return () => {
      if (map && map.loaded()) {
        try {
          map.off('mouseenter', 'hotspots-layer', handleMouseEnter);
          map.off('mouseleave', 'hotspots-layer', handleMouseLeave);
          if (map.getLayer('hotspots-layer')) {
            map.removeLayer('hotspots-layer');
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
