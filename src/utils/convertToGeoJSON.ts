import { type Feature, type FeatureCollection, type Point, type LineString } from 'geojson';
import type { GasPlant, AGGStation, GasPipeline, PowerStation, CompressionStation, MeteringStation, JunctionNode, GasField, GasWell } from '../types/gas-assets';

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

// Convert Compression Stations to GeoJSON
export const convertCompressionStationsToGeoJSON = (
  stations: CompressionStation[]
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
        compressors: station.compressors,
        capacity: station.capacity,
        inletPressure: station.inletPressure,
        outletPressure: station.outletPressure,
        efficiency: station.efficiency,
        status: station.status,
        tag: 'compression-station',
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

// Convert Metering Stations to GeoJSON
export const convertMeteringStationsToGeoJSON = (
  stations: MeteringStation[]
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
        type: station.type,
        flow: station.flow,
        pressure: station.pressure,
        temperature: station.temperature,
        accuracy: station.accuracy,
        status: station.status,
        tag: 'metering-station',
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

// Convert Junction Nodes to GeoJSON
export const convertJunctionNodesToGeoJSON = (
  nodes: JunctionNode[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = nodes
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((node) => ({
      type: 'Feature',
      id: node.id,
      geometry: {
        type: 'Point',
        coordinates: [node.location.lng, node.location.lat],
      },
      properties: {
        id: node.id,
        name: node.name,
        operator: node.operator,
        type: node.type,
        capacity: node.capacity,
        pressure: node.pressure,
        status: node.status,
        tag: 'junction-node',
        facility_status: node.status,
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

// Convert Gas Fields to GeoJSON
export const convertGasFieldsToGeoJSON = (
  fields: GasField[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = fields
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((field) => ({
      type: 'Feature',
      id: field.id,
      geometry: {
        type: 'Point',
        coordinates: [field.location.lng, field.location.lat],
      },
      properties: {
        id: field.id,
        name: field.name,
        oml: field.oml,
        operator: field.operator,
        status: field.status,
        currentProduction: field.currentProduction,
        capacity: field.capacity,
        wells: field.wells,
        reserves: field.reserves.proven,
        tag: 'gas-field',
        facility_status: field.status === 'producing' ? 'operational' : field.status,
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

// Convert Gas Wells to GeoJSON
export const convertGasWellsToGeoJSON = (
  wells: GasWell[]
): {
  type: 'geojson';
  data: FeatureCollection<Point, any>;
} => {
  const features: Feature<Point, any>[] = wells
    .filter(
      ({ location }) =>
        location && isValidLngLat([location.lng, location.lat])
    )
    .map((well) => ({
      type: 'Feature',
      id: well.id,
      geometry: {
        type: 'Point',
        coordinates: [well.location.lng, well.location.lat],
      },
      properties: {
        id: well.id,
        name: well.name,
        fieldName: well.fieldName,
        type: well.type,
        status: well.status,
        production: well.production,
        depth: well.depth,
        pressure: well.pressure,
        temperature: well.temperature,
        tag: 'gas-well',
        facility_status: well.status,
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
