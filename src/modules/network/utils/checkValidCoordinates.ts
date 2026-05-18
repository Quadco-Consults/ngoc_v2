import mapboxgl from "mapbox-gl";

type Coordinate = [number, number];
type CoordinateInput =
    | Coordinate
    | mapboxgl.LngLat
    | Coordinate[]
    | mapboxgl.LngLat[];

export default function isValidLngLat(value: CoordinateInput): boolean {
    if (value instanceof mapboxgl.LngLat) {
        return (
            typeof value.lng === "number" &&
            typeof value.lat === "number" &&
            value.lng >= -180 &&
            value.lng <= 180 &&
            value.lat >= -90 &&
            value.lat <= 90
        );
    }

    if (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "number" &&
        typeof value[1] === "number"
    ) {
        const [lng, lat] = value;
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    }

    if (Array.isArray(value)) {
        return value.every((coord) => isValidLngLat(coord as any));
    }

    return false;
}
