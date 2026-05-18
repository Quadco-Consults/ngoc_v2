import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ExecutiveDashboard from '../modules/dashboard/ExecutiveDashboard';
import OperationsDashboard from '../modules/dashboard/OperationsDashboard';
import GasDashboard from '../modules/dashboard/GasDashboard';
import GasInfrastructureDashboard from '../modules/dashboard/GasInfrastructureDashboard';
import GasFields from '../modules/assets/GasFields';
import GasWells from '../modules/assets/GasWells';
import GasPipelines from '../modules/assets/GasPipelines';
import GasPlants from '../modules/assets/GasPlants';
import AGGStations from '../modules/assets/AGGStations';
import LNGTerminals from '../modules/assets/LNGTerminals';
import CompressionStations from '../modules/assets/CompressionStations';
import PowerStations from '../modules/assets/PowerStations';
import GasProduction from '../modules/production/GasProduction';
import FieldProduction from '../modules/production/FieldProduction';
import PlantProduction from '../modules/production/PlantProduction';
import FlareMonitoring from '../modules/production/FlareMonitoring';
import GasNominations from '../modules/commercial/GasNominations';
import GasAllocations from '../modules/commercial/GasAllocations';
import GasBalancing from '../modules/commercial/GasBalancing';
import GasContracts from '../modules/commercial/GasContracts';
import Maintenance from '../modules/operations/Maintenance';
import Incidents from '../modules/operations/Incidents';
import Deferments from '../modules/operations/Deferments';
import PipelineNetwork from '../modules/network/PipelineNetwork';
// import PipelineNetworkIncidentReport from '../modules/network/view/IncidentReport';
import AssetManagement from '../modules/asset-management/AssetManagement';
import AnalyticsDashboard from '../modules/analytics/AnalyticsDashboard';
import UserManagement from '../modules/users/UserManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ExecutiveDashboard />,
      },
      // Dashboard Routes
      {
        path: 'dashboard',
        children: [
          {
            path: 'operations',
            element: <OperationsDashboard />,
          },
          {
            path: 'gas',
            element: <GasDashboard />,
          },
          {
            path: 'infrastructure',
            element: <GasInfrastructureDashboard />,
          },
        ],
      },
      // Gas Assets Routes
      {
        path: 'assets',
        children: [
          {
            path: 'fields',
            element: <GasFields />,
          },
          {
            path: 'wells',
            element: <GasWells />,
          },
          {
            path: 'pipelines',
            element: <GasPipelines />,
          },
          {
            path: 'plants',
            element: <GasPlants />,
          },
          {
            path: 'agg-stations',
            element: <AGGStations />,
          },
          {
            path: 'lng-terminals',
            element: <LNGTerminals />,
          },
          {
            path: 'compression',
            element: <CompressionStations />,
          },
          {
            path: 'power-stations',
            element: <PowerStations />,
          },
        ],
      },
      // Production Routes
      {
        path: 'production',
        children: [
          {
            path: 'gas',
            element: <GasProduction />,
          },
          {
            path: 'fields',
            element: <FieldProduction />,
          },
          {
            path: 'plants',
            element: <PlantProduction />,
          },
          {
            path: 'flare',
            element: <FlareMonitoring />,
          },
        ],
      },
      // Commercial Routes
      {
        path: 'commercial',
        children: [
          {
            path: 'nominations',
            element: <GasNominations />,
          },
          {
            path: 'allocations',
            element: <GasAllocations />,
          },
          {
            path: 'balancing',
            element: <GasBalancing />,
          },
          {
            path: 'contracts',
            element: <GasContracts />,
          },
        ],
      },
      // Operations Routes
      {
        path: 'operations',
        children: [
          {
            path: 'maintenance',
            element: <Maintenance />,
          },
          {
            path: 'deferments',
            element: <Deferments />,
          },
          {
            path: 'incidents',
            element: <Incidents />,
          },
        ],
      },
      // Other Routes
      {
        path: 'network',
        children: [
          {
            path: 'pipeline-network',
            element: <PipelineNetwork />,
          },
        ],
      },
      {
        path: 'asset-management',
        element: <AssetManagement />,
      },
      {
        path: 'analytics',
        element: <AnalyticsDashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      // Incident report route commented out - requires oil upstream dependencies
      // {
      //   path: 'incident-report',
      //   element: <PipelineNetworkIncidentReport />,
      // },
    ],
  },
]);
