import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AGGStation,
  GasPlant,
  GasPipeline,
  SlugCatcher,
  JunctionNode,
  LNGTrain,
  CompressionStation,
  MeteringStation,
  PowerStation,
} from '../types/gas-assets';

interface GasAssetsState {
  aggStations: AGGStation[];
  gasPlants: GasPlant[];
  gasPipelines: GasPipeline[];
  slugCatchers: SlugCatcher[];
  junctionNodes: JunctionNode[];
  lngTrains: LNGTrain[];
  compressionStations: CompressionStation[];
  meteringStations: MeteringStation[];
  powerStations: PowerStation[];
  loading: boolean;
  error: string | null;
}

const initialState: GasAssetsState = {
  aggStations: [],
  gasPlants: [],
  gasPipelines: [],
  slugCatchers: [],
  junctionNodes: [],
  lngTrains: [],
  compressionStations: [],
  meteringStations: [],
  powerStations: [],
  loading: false,
  error: null,
};

const gasAssetsSlice = createSlice({
  name: 'gasAssets',
  initialState,
  reducers: {
    // AGG Stations
    setAGGStations: (state, action: PayloadAction<AGGStation[]>) => {
      state.aggStations = action.payload;
    },
    addAGGStation: (state, action: PayloadAction<AGGStation>) => {
      state.aggStations.push(action.payload);
    },
    updateAGGStation: (state, action: PayloadAction<AGGStation>) => {
      const index = state.aggStations.findIndex((station) => station.id === action.payload.id);
      if (index !== -1) {
        state.aggStations[index] = action.payload;
      }
    },
    deleteAGGStation: (state, action: PayloadAction<string>) => {
      state.aggStations = state.aggStations.filter((station) => station.id !== action.payload);
    },

    // Gas Plants
    setGasPlants: (state, action: PayloadAction<GasPlant[]>) => {
      state.gasPlants = action.payload;
    },
    addGasPlant: (state, action: PayloadAction<GasPlant>) => {
      state.gasPlants.push(action.payload);
    },
    updateGasPlant: (state, action: PayloadAction<GasPlant>) => {
      const index = state.gasPlants.findIndex((plant) => plant.id === action.payload.id);
      if (index !== -1) {
        state.gasPlants[index] = action.payload;
      }
    },
    deleteGasPlant: (state, action: PayloadAction<string>) => {
      state.gasPlants = state.gasPlants.filter((plant) => plant.id !== action.payload);
    },

    // Gas Pipelines
    setGasPipelines: (state, action: PayloadAction<GasPipeline[]>) => {
      state.gasPipelines = action.payload;
    },
    addGasPipeline: (state, action: PayloadAction<GasPipeline>) => {
      state.gasPipelines.push(action.payload);
    },
    updateGasPipeline: (state, action: PayloadAction<GasPipeline>) => {
      const index = state.gasPipelines.findIndex((pipeline) => pipeline.id === action.payload.id);
      if (index !== -1) {
        state.gasPipelines[index] = action.payload;
      }
    },
    deleteGasPipeline: (state, action: PayloadAction<string>) => {
      state.gasPipelines = state.gasPipelines.filter((pipeline) => pipeline.id !== action.payload);
    },

    // Slug Catchers
    setSlugCatchers: (state, action: PayloadAction<SlugCatcher[]>) => {
      state.slugCatchers = action.payload;
    },
    addSlugCatcher: (state, action: PayloadAction<SlugCatcher>) => {
      state.slugCatchers.push(action.payload);
    },

    // Junction Nodes
    setJunctionNodes: (state, action: PayloadAction<JunctionNode[]>) => {
      state.junctionNodes = action.payload;
    },
    addJunctionNode: (state, action: PayloadAction<JunctionNode>) => {
      state.junctionNodes.push(action.payload);
    },

    // LNG Trains
    setLNGTrains: (state, action: PayloadAction<LNGTrain[]>) => {
      state.lngTrains = action.payload;
    },
    addLNGTrain: (state, action: PayloadAction<LNGTrain>) => {
      state.lngTrains.push(action.payload);
    },

    // Compression Stations
    setCompressionStations: (state, action: PayloadAction<CompressionStation[]>) => {
      state.compressionStations = action.payload;
    },
    addCompressionStation: (state, action: PayloadAction<CompressionStation>) => {
      state.compressionStations.push(action.payload);
    },

    // Metering Stations
    setMeteringStations: (state, action: PayloadAction<MeteringStation[]>) => {
      state.meteringStations = action.payload;
    },
    addMeteringStation: (state, action: PayloadAction<MeteringStation>) => {
      state.meteringStations.push(action.payload);
    },

    // Power Stations
    setPowerStations: (state, action: PayloadAction<PowerStation[]>) => {
      state.powerStations = action.payload;
    },
    addPowerStation: (state, action: PayloadAction<PowerStation>) => {
      state.powerStations.push(action.payload);
    },
    updatePowerStation: (state, action: PayloadAction<PowerStation>) => {
      const index = state.powerStations.findIndex((station) => station.id === action.payload.id);
      if (index !== -1) {
        state.powerStations[index] = action.payload;
      }
    },
    deletePowerStation: (state, action: PayloadAction<string>) => {
      state.powerStations = state.powerStations.filter((station) => station.id !== action.payload);
    },

    // Common
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAGGStations,
  addAGGStation,
  updateAGGStation,
  deleteAGGStation,
  setGasPlants,
  addGasPlant,
  updateGasPlant,
  deleteGasPlant,
  setGasPipelines,
  addGasPipeline,
  updateGasPipeline,
  deleteGasPipeline,
  setSlugCatchers,
  addSlugCatcher,
  setJunctionNodes,
  addJunctionNode,
  setLNGTrains,
  addLNGTrain,
  setCompressionStations,
  addCompressionStation,
  setMeteringStations,
  addMeteringStation,
  setPowerStations,
  addPowerStation,
  updatePowerStation,
  deletePowerStation,
  setLoading,
  setError,
} = gasAssetsSlice.actions;

export default gasAssetsSlice.reducer;
