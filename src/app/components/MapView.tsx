import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TreeDeciduous } from 'lucide-react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';

interface Tree {
  x: number;
  y: number;
  id: number;
}

interface AirQualityData {
  lat: number;
  lng: number;
  aqi: number;
  color: string;
}

interface MapViewProps {
  showHeatMap: boolean;
  heatIntensity: number;
  trees: Tree[];
  onPlaceTree: (x: number, y: number) => void;
  showAirQuality?: boolean;
}

// Defined outside component so the reference is stable across re-renders
const MAP_CENTER = { lat: 49.2827, lng: -123.1207 }; // Vancouver, BC
const MAP_ZOOM = 13;

export function MapView({ showHeatMap, heatIntensity, trees, onPlaceTree, showAirQuality = false }: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [isLoadingAirQuality, setIsLoadingAirQuality] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFetchingRef = useRef(false);
  const mapLoadedRef = useRef(false);

  // Load Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  // Build mapOptions only after Google Maps script is loaded
  const getMapOptions = (): google.maps.MapOptions | undefined => {
    if (!isLoaded) return undefined;
    return {
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeId: 'roadmap',
      minZoom: 1,
      maxZoom: 20,
      gestureHandling: 'greedy',
      scrollwheel: true,
      disableDoubleClickZoom: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
    };
  };

  // Fetch air quality data for a single location
  const fetchAirQuality = useCallback(async (lat: number, lng: number): Promise<number | null> => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: { latitude: lat, longitude: lng },
          }),
        }
      );

      if (!response.ok) {
        console.error('Air quality API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      return data.indexes?.[0]?.aqi ?? null;
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return null;
    }
  }, []);

  // Get color for AQI value
  const getAqiColor = (aqi: number): string => {
    if (aqi > 200) return 'rgba(147, 51, 234, 0.7)'; // purple
    if (aqi > 150) return 'rgba(220, 38, 38, 0.7)';   // red
    if (aqi > 100) return 'rgba(251, 146, 60, 0.7)';   // orange
    if (aqi > 50)  return 'rgba(234, 179, 8, 0.7)';    // yellow
    return 'rgba(34, 197, 94, 0.6)';                    // green
  };

  // Fetch air quality for the visible map area (with debouncing built in)
  const loadAirQualityData = useCallback(async (currentMap: google.maps.Map) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoadingAirQuality(true);

    try {
      const bounds = currentMap.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const gridSize = 4; // 4x4 = 16 points (reasonable API usage)
      const latStep = (ne.lat() - sw.lat()) / gridSize;
      const lngStep = (ne.lng() - sw.lng()) / gridSize;

      const promises: Promise<AirQualityData | null>[] = [];

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          const lat = sw.lat() + latStep * i;
          const lng = sw.lng() + lngStep * j;
          promises.push(
            fetchAirQuality(lat, lng).then(aqi =>
              aqi !== null ? { lat, lng, aqi, color: getAqiColor(aqi) } : null
            )
          );
        }
      }

      // Fetch all points in parallel instead of sequentially
      const results = await Promise.all(promises);
      const validResults = results.filter((r): r is AirQualityData => r !== null);
      setAirQualityData(validResults);
    } catch (err) {
      console.error('Error loading air quality data:', err);
    } finally {
      setIsLoadingAirQuality(false);
      isFetchingRef.current = false;
    }
  }, [fetchAirQuality]);

  const onLoad = useCallback((currentMap: google.maps.Map) => {
    if (!mapLoadedRef.current) {
      currentMap.setCenter(MAP_CENTER);
      currentMap.setZoom(MAP_ZOOM);
      mapLoadedRef.current = true;
    }
    setMap(currentMap);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update air quality when toggled on, and debounce on map idle
  useEffect(() => {
    if (!map) return;

    if (!showAirQuality) {
      setAirQualityData([]);
      return;
    }

    // Load immediately when toggled on
    loadAirQualityData(map);

    // Re-fetch when map stops moving (idle fires once after pan/zoom ends)
    const idleListener = map.addListener('idle', () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        loadAirQualityData(map);
      }, 1500); // Wait 1.5s after map stops moving
    });

    return () => {
      google.maps.event.removeListener(idleListener);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [map, showAirQuality, loadAirQualityData]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onPlaceTree(e.latLng.lat(), e.latLng.lng());
    }
  };


  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <div className="text-lg mb-2">Loading Google Maps...</div>
          <div className="text-sm text-gray-400">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={getMapOptions()}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        onDragStart={() => {}} // Allow free dragging
        onZoomChanged={() => {}} // Allow free zooming
      >
        {/* Temperature Heat Map Overlay */}
        {showHeatMap && !showAirQuality && map && (
          <OverlayView
            position={MAP_CENTER}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >
            <div
              style={{
                position: 'absolute',
                left: '-2000px',
                top: '-2000px',
                width: '4000px',
                height: '4000px',
                pointerEvents: 'none',
                background: `radial-gradient(circle at 50% 45%, rgba(220, 38, 38, ${0.4 * (heatIntensity / 100)}) 0%, transparent 20%),
                            radial-gradient(circle at 65% 35%, rgba(239, 68, 68, ${0.5 * (heatIntensity / 100)}) 0%, transparent 18%),
                            radial-gradient(circle at 48% 65%, rgba(239, 68, 68, ${0.45 * (heatIntensity / 100)}) 0%, transparent 22%),
                            radial-gradient(circle at 30% 75%, rgba(251, 146, 60, ${0.35 * (heatIntensity / 100)}) 0%, transparent 15%),
                            radial-gradient(circle at 75% 70%, rgba(251, 146, 60, ${0.4 * (heatIntensity / 100)}) 0%, transparent 18%),
                            radial-gradient(circle at 35% 25%, rgba(239, 68, 68, ${0.38 * (heatIntensity / 100)}) 0%, transparent 16%),
                            radial-gradient(circle at 82% 50%, rgba(251, 146, 60, ${0.35 * (heatIntensity / 100)}) 0%, transparent 20%)`,
              }}
            />
          </OverlayView>
        )}

        {/* Air Quality Heat Map Overlay */}
        {showAirQuality && map && airQualityData.map((point, index) => (
          <OverlayView
            key={`aq-${index}`}
            position={{ lat: point.lat, lng: point.lng }}
            mapPaneName={OverlayView.OVERLAY_LAYER}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${point.color} 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
          </OverlayView>
        ))}

        {/* Tree Markers */}
        {trees.map((tree) => {
          const position = { lat: tree.x, lng: tree.y };
          
          return (
            <OverlayView
              key={tree.id}
              position={position}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                style={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                }}
              >
                <div className="bg-green-500 rounded-full p-2.5 shadow-lg border-2 border-green-300 flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5 text-white" />
                </div>
              </div>
            </OverlayView>
          );
        })}
      </GoogleMap>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 bg-[#2a2a2a]/90 text-white px-3 py-2 rounded-lg text-xs border border-[#3a3a3a] z-10">
        Click to place tree
      </div>

      {/* Air Quality Loading Indicator */}
      {isLoadingAirQuality && (
        <div className="absolute top-4 right-4 bg-[#2a2a2a]/90 text-white px-3 py-2 rounded-lg text-xs border border-[#3a3a3a] z-10">
          Loading air quality data...
        </div>
      )}
    </div>
  );
}
