import { Feature, FeatureCollection, Point, LineString } from 'geojson';
import type { GasPlant, AGGStation, GasPipeline, PowerStation } from '../types/gas-assets';

// Validate coordinates
const isValidLngLat = (coordinates: [number, number]): boolean => {
  const [lng, lat] = coordinates;
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    !isNaN(lng) &&
    !isNaN(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90 &&
    lat !== 0 &&
    lng !== 0
  );
};

// Convert Gas Plants to GeoJSON
export const convertGasPlantsToGeoJSON = (
  plants: GasPlant[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = plants
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((plant) => ({
      type: 'Feature',
      id: plant.id,
      geometry: {
        type: 'Point',
        coordinates: [plant.location.lng, plant.location.lat],
      },
      properties: {
        id: plant.id,
        name: plant.name,
        type: plant.type,
        operator: plant.operator,
        installedCapacity: plant.installedCapacity,
        operatingCapacity: plant.operatingCapacity,
        status: plant.status,
        deliveryMarkets: plant.deliveryMarkets?.join(', ') || '',
        gasSupplyFields: plant.gasSupplyFields?.join(', ') || '',
        tag: 'gas-plant',
        facility_status: plant.status, // For consistent status naming
      },
    }));

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

// Convert AGG Stations to GeoJSON
export const convertAGGStationsToGeoJSON = (
  stations: AGGStation[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = stations
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((station) => ({
      type: 'Feature',
      id: station.id,
      geometry: {
        type: 'Point',
        coordinates: [station.location.lng, station.location.lat],
      },
      properties: {
        id: station.id,
        name: station.name,
        aggType: station.aggType,
        processingType: station.processingType,
        designCapacity: station.designCapacity,
        availableCapacity: station.availableCapacity,
        utilization: station.utilization,
        numberOfTrains: station.numberOfTrains,
        status: station.status,
        tag: 'agg-station',
        facility_status: station.status,
      },
    }));

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

// Convert Power Stations to GeoJSON
export const convertPowerStationsToGeoJSON = (
  stations: PowerStation[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = stations
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((station) => ({
      type: 'Feature',
      id: station.id,
      geometry: {
        type: 'Point',
        coordinates: [station.location.lng, station.location.lat],
      },
      properties: {
        id: station.id,
        name: station.name,
        operator: station.operator,
        capacity: station.capacity,
        generation: station.generation,
        gasConsumption: station.gasConsumption,
        efficiency: station.efficiency,
        turbines: station.turbines,
        supplier: station.supplier,
        status: station.status,
        tag: 'power-station',
        facility_status: station.status,
      },
    }));

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

// Convert Gas Pipelines to GeoJSON
export const convertGasPipelinesToGeoJSON = ({
  pipelines,
  type,
}: {
  pipelines: GasPipeline[];
  type?: string;
}): {
  type: 'geojson';
  data: FeatureCollection<LineString, any>;
} => {
  const features: Feature<LineString, any>[] = pipelines
    .filter((pipeline) => {
      // Filter by type if specified
      if (type && pipeline.type !== type) return false;

      // Check if pipeline has valid route coordinates
      return (
        pipeline.route &&
        Array.isArray(pipeline.route) &&
        pipeline.route.length >= 2 &&
        pipeline.route.every((coord) =>
          isValidLngLat([coord.lng, coord.lat])
        )
      );
    })
    .map((pipeline) => ({
      type: 'Feature',
      id: pipeline.id,
      geometry: {
        type: 'LineString',
        coordinates: pipeline.route!.map((coord) => [coord.lng, coord.lat]),
      },
      properties: {
        id: pipeline.id,
        name: pipeline.name,
        type: pipeline.type,
        operator: pipeline.operator,
        installedCapacity: pipeline.installedCapacity,
        operatingCapacity: pipeline.operatingCapacity,
        status: pipeline.status,
        size: pipeline.size || '',
        deliveryMarkets: pipeline.deliveryMarkets?.join(', ') || '',
        tag: 'pipeline',
      },
    }));

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

// Group pipelines by type
export const groupPipelinesByType = (pipelines: GasPipeline[]) => {
  return {
    all: convertGasPipelinesToGeoJSON({ pipelines }),
    transmission: convertGasPipelinesToGeoJSON({
      pipelines,
      type: 'transmission',
    }),
    gathering: convertGasPipelinesToGeoJSON({
      pipelines,
      type: 'gathering',
    }),
    distribution: convertGasPipelinesToGeoJSON({
      pipelines,
      type: 'distribution',
    }),
  };
};
