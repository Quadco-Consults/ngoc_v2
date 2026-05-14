import { RefObject, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

export default function useFlyToCoordinates(mapRef: RefObject<mapboxgl.Map | null>) {
  const flyToCoordinates = useCallback(
    (coordinates: [number, number], zoom: number = 10) => {
      if (!mapRef.current) return;

      mapRef.current.flyTo({
        center: coordinates,
        zoom,
        essential: true,
        duration: 2000,
      });
    },
    [mapRef]
  );

  return flyToCoordinates;
}
