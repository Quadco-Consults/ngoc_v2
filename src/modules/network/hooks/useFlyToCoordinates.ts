import { RefObject } from "react";

export default function useFlyToCoordinates(mapRef: RefObject<mapboxgl.Map>) {
    const map = mapRef.current;

    const flyToCoordinates = (coordinates: [number, number], zoom?: number) => {
        map?.flyTo({
            center: coordinates,
            zoom,
            essential: true,
        });
    };

    return flyToCoordinates;
}
