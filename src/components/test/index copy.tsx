'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const Test = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            mapInstance.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [69.3451, 30.3753], // Center of Pakistan
                zoom: 3.5,
                projection: 'globe',
                pitch: 0,
            });

            // Add navigation controls
            mapInstance.current.addControl(new mapboxgl.NavigationControl());

            // Disable map rotation using right click + drag and touch rotation gesture
            mapInstance.current.dragRotate.disable();
            mapInstance.current.touchZoomRotate.disableRotation();

            // Add atmosphere and stars for better globe effect
            mapInstance.current.on('style.load', () => {
                // Set dark theme with white landmasses
                mapInstance.current!.setFog({
                    'horizon-blend': 0.02,
                    'space-color': '#000000',
                    'star-intensity': 0.15
                });

                // Adjust the map style for dark theme
                mapInstance.current!.setPaintProperty('land', 'background-color', '#ffffff');
                mapInstance.current!.setPaintProperty('water', 'fill-color', '#000000');

                // Add Pakistan boundary data
                mapInstance.current!.addSource('pakistan-boundary', {
                    type: 'geojson',
                    data: require('./pakistan.json')
                });

                // Add the fill layer
                mapInstance.current!.addLayer({
                    id: 'pakistan-fill',
                    type: 'fill',
                    source: 'pakistan-boundary',
                    paint: {
                        'fill-color': '#13A94B',
                        'fill-opacity': 0.3
                    }
                });

                // Add the outline layer
                mapInstance.current!.addLayer({
                    id: 'pakistan-outline',
                    type: 'line',
                    source: 'pakistan-boundary',
                    paint: {
                        'line-color': '#13A94B',
                        'line-width': 2
                    }
                });
            });
        }

        // Cleanup
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

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