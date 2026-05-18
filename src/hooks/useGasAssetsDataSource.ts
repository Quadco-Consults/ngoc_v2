import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  convertGasPlantsToGeoJSON,
  convertAGGStationsToGeoJSON,
  convertPowerStationsToGeoJSON,
  groupPipelinesByType,
  convertCompressionStationsToGeoJSON,
  convertMeteringStationsToGeoJSON,
  convertJunctionNodesToGeoJSON,
  convertGasFieldsToGeoJSON,
  convertGasWellsToGeoJSON,
} from '../utils/convertToGeoJSON';

export default function useGasAssetsDataSource() {
  const { gasPlants, aggStations, gasPipelines, powerStations, compressionStations, meteringStations, junctionNodes, gasFields, gasWells } = useSelector(
    (state: RootState) => state.gasAssets
  );

  // Convert Gas Plants to GeoJSON
  const gasPlantGeoJSON = useMemo(() => {
    if (!gasPlants || gasPlants.length === 0) return null;

    const validPlants = gasPlants.filter(
      (plant) => plant.location && plant.location.lat !== 0 && plant.location.lng !== 0
    );

    return {
      all: convertGasPlantsToGeoJSON(validPlants),
    };
  }, [gasPlants]);

  // Convert AGG Stations to GeoJSON
  const aggStationGeoJSON = useMemo(() => {
    if (!aggStations || aggStations.length === 0) return null;

    const validStations = aggStations.filter(
      (station) => station.location && station.location.lat !== 0 && station.location.lng !== 0
    );

    return {
      all: convertAGGStationsToGeoJSON(validStations),
    };
  }, [aggStations]);

  // Convert Power Stations to GeoJSON
  const powerStationGeoJSON = useMemo(() => {
    if (!powerStations || powerStations.length === 0) return null;

    const validStations = powerStations.filter(
      (station) => station.location && station.location.lat !== 0 && station.location.lng !== 0
    );

    return {
      all: convertPowerStationsToGeoJSON(validStations),
    };
  }, [powerStations]);

  // Convert Gas Pipelines to GeoJSON grouped by type
  const pipelineGeoJSON = useMemo(() => {
    if (!gasPipelines || gasPipelines.length === 0) return null;

    const validPipelines = gasPipelines.filter(
      (pipeline) =>
        pipeline.route &&
        Array.isArray(pipeline.route) &&
        pipeline.route.length >= 2 &&
        pipeline.route.every((coord) => coord.lat !== 0 && coord.lng !== 0)
    );

    return groupPipelinesByType(validPipelines);
  }, [gasPipelines]);

  // Calculate statistics
  const gasPlantStats = useMemo(() => {
    if (!gasPlants) return null;

    const operational = gasPlants.filter((p) => p.status === 'operational');
    const maintenance = gasPlants.filter((p) => p.status === 'maintenance');
    const offline = gasPlants.filter((p) => p.status === 'offline');

    return {
      all: gasPlants.length,
      operational: operational.length,
      maintenance: maintenance.length,
      offline: offline.length,
    };
  }, [gasPlants]);

  const aggStationStats = useMemo(() => {
    if (!aggStations) return null;

    const operational = aggStations.filter((s) => s.status === 'operational');
    const maintenance = aggStations.filter((s) => s.status === 'maintenance');
    const offline = aggStations.filter((s) => s.status === 'offline');

    return {
      all: aggStations.length,
      operational: operational.length,
      maintenance: maintenance.length,
      offline: offline.length,
    };
  }, [aggStations]);

  const pipelineStats = useMemo(() => {
    if (!gasPipelines) return null;

    const operational = gasPipelines.filter((p) => p.status === 'operational');
    const maintenance = gasPipelines.filter((p) => p.status === 'maintenance');
    const offline = gasPipelines.filter((p) => p.status === 'offline');

    return {
      all: gasPipelines.length,
      operational: operational.length,
      maintenance: maintenance.length,
      offline: offline.length,
    };
  }, [gasPipelines]);

  const powerStationStats = useMemo(() => {
    if (!powerStations) return null;

    const operational = powerStations.filter((s) => s.status === 'operational');
    const maintenance = powerStations.filter((s) => s.status === 'maintenance');
    const offline = powerStations.filter((s) => s.status === 'offline');

    return {
      all: powerStations.length,
      operational: operational.length,
      maintenance: maintenance.length,
      offline: offline.length,
    };
  }, [powerStations]);

  // Convert Compression Stations to GeoJSON
  const compressionStationGeoJSON = useMemo(() => {
    if (!compressionStations || compressionStations.length === 0) return null;

    const validStations = compressionStations.filter(
      (station) => station.location && station.location.lat !== 0 && station.location.lng !== 0
    );

    return {
      all: convertCompressionStationsToGeoJSON(validStations),
    };
  }, [compressionStations]);

  // Convert Metering Stations to GeoJSON
  const meteringStationGeoJSON = useMemo(() => {
    if (!meteringStations || meteringStations.length === 0) return null;

    const validStations = meteringStations.filter(
      (station) => station.location && station.location.lat !== 0 && station.location.lng !== 0
    );

    return {
      all: convertMeteringStationsToGeoJSON(validStations),
    };
  }, [meteringStations]);

  // Convert Junction Nodes to GeoJSON
  const junctionNodeGeoJSON = useMemo(() => {
    if (!junctionNodes || junctionNodes.length === 0) return null;

    const validNodes = junctionNodes.filter(
      (node) => node.location && node.location.lat !== 0 && node.location.lng !== 0
    );

    return {
      all: convertJunctionNodesToGeoJSON(validNodes),
    };
  }, [junctionNodes]);

  // Convert Gas Fields to GeoJSON
  const gasFieldGeoJSON = useMemo(() => {
    if (!gasFields || gasFields.length === 0) return null;

    const validFields = gasFields.filter(
      (field) => field.location && field.location.lat !== 0 && field.location.lng !== 0
    );

    return {
      all: convertGasFieldsToGeoJSON(validFields),
    };
  }, [gasFields]);

  // Convert Gas Wells to GeoJSON
  const gasWellGeoJSON = useMemo(() => {
    if (!gasWells || gasWells.length === 0) return null;

    const validWells = gasWells.filter(
      (well) => well.location && well.location.lat !== 0 && well.location.lng !== 0
    );

    return {
      all: convertGasWellsToGeoJSON(validWells),
    };
  }, [gasWells]);

  // Check if data sources are ready
  const areDataSourcesReady = Boolean(
    gasPlantGeoJSON && aggStationGeoJSON && pipelineGeoJSON && powerStationGeoJSON
  );

  return {
    gasPlantGeoJSON,
    aggStationGeoJSON,
    powerStationGeoJSON,
    pipelineGeoJSON,
    compressionStationGeoJSON,
    meteringStationGeoJSON,
    junctionNodeGeoJSON,
    gasFieldGeoJSON,
    gasWellGeoJSON,
    gasPlantStats,
    aggStationStats,
    powerStationStats,
    pipelineStats,
    areDataSourcesReady,
  };
}
