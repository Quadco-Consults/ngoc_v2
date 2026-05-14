import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

export default function useFlyToCoordinates(mapRef: RefObject<MapboxMap | null>) {
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
