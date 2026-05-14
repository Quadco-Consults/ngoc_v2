import { useState } from 'react';
import { Workflow, Activity, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/Button';
import StatsCard from '../../components/shared/StatsCard';
import PipelineNetworkMap from './PipelineNetworkMap';

interface Pipeline {
  id: string;
  name: string;
  from: string;
  to: string;
  length: number;
  diameter: number;
  capacity: number;
  currentFlow: number;
  pressure: number;
  status: 'Operational' | 'Maintenance' | 'Critical';
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'Field' | 'Plant' | 'Terminal' | 'Junction';
  status: 'Online' | 'Offline' | 'Warning';
  production?: number;
}

// Mock data
const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Escravos-Lagos Pipeline (ELPS)',
    from: 'Escravos',
    to: 'Lagos',
    length: 386,
    diameter: 24,
    capacity: 650,
    currentFlow: 580,
    pressure: 850,
    status: 'Operational',
  },
  {
    id: '2',
    name: 'Obiafu-Obrikom Pipeline (OB3)',
    from: 'Obiafu',
    to: 'Obrikom',
    length: 56,
    diameter: 36,
    capacity: 850,
    currentFlow: 820,
    pressure: 920,
    status: 'Operational',
  },
  {
    id: '3',
    name: 'AKK Pipeline',
    from: 'Ajaokuta',
    to: 'Kano',
    length: 614,
    diameter: 40,
    capacity: 2200,
    currentFlow: 1800,
    pressure: 780,
    status: 'Maintenance',
  },
  {
    id: '4',
    name: 'West African Gas Pipeline (WAGP)',
    from: 'Lagos',
    to: 'Ghana',
    length: 678,
    diameter: 20,
    capacity: 170,
    currentFlow: 150,
    pressure: 800,
    status: 'Operational',
  },
];

const mockNodes: NetworkNode[] = [
  { id: '1', name: 'Escravos Gas Plant', type: 'Plant', status: 'Online', production: 720 },
  { id: '2', name: 'Obiafu-Obrikom Field', type: 'Field', status: 'Online', production: 850 },
  { id: '3', name: 'Bonny LNG Terminal', type: 'Terminal', status: 'Online', production: 21500 },
  { id: '4', name: 'Lagos Junction', type: 'Junction', status: 'Warning' },
  { id: '5', name: 'Utorogu Station', type: 'Plant', status: 'Online', production: 680 },
];

export default function PipelineNetwork() {
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const totalLength = mockPipelines.reduce((sum, p) => sum + p.length, 0);
  const totalCapacity = mockPipelines.reduce((sum, p) => sum + p.capacity, 0);
  const totalFlow = mockPipelines.reduce((sum, p) => sum + p.currentFlow, 0);
  const avgUtilization = ((totalFlow / totalCapacity) * 100).toFixed(1);

  const criticalPipelines = mockPipelines.filter((p) => p.status === 'Critical').length;
  const maintenancePipelines = mockPipelines.filter((p) => p.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline Network"
        subtitle="National gas transmission network visualization and monitoring"
        actions={
          <>
            <Button variant="outline">Export Network Data</Button>
            <Button variant="primary">Real-time Monitor</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pipeline Length"
          value={`${totalLength.toLocaleString()} km`}
          icon={<Workflow className="w-6 h-6" />}
          color="primary"
        />
        <StatsCard
          title="Network Capacity"
          value={`${totalCapacity.toLocaleString()} MMSCF/D`}
          color="secondary"
        />
        <StatsCard
          title="Current Throughput"
          value={`${totalFlow.toLocaleString()} MMSCF/D`}
          color="success"
        />
        <StatsCard
          title="Average Utilization"
          value={`${avgUtilization}%`}
          icon={<Activity className="w-6 h-6" />}
          color="accent"
        />
      </div>

      {/* Network Status Alerts */}
      {(criticalPipelines > 0 || maintenancePipelines > 0) && (
        <div className="space-y-3">
          {criticalPipelines > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Critical Pipeline Alert</h4>
                  <p className="text-sm text-red-800 mt-1">
                    {criticalPipelines} pipeline{criticalPipelines > 1 ? 's require' : ' requires'}{' '}
                    immediate attention due to critical status.
                  </p>
                </div>
              </div>
            </div>
          )}
          {maintenancePipelines > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Maintenance in Progress</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    {maintenancePipelines} pipeline{maintenancePipelines > 1 ? 's are' : ' is'}{' '}
                    currently under maintenance, affecting throughput capacity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="h-[600px]">
          <PipelineNetworkMap />
        </div>
      </div>

      {/* Pipeline Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Major Pipelines</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mockPipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedPipeline?.id === pipeline.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedPipeline(pipeline)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{pipeline.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {pipeline.from} → {pipeline.to} ({pipeline.length} km)
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Flow: {pipeline.currentFlow} MMSCF/D</span>
                      <span>•</span>
                      <span>
                        Utilization:{' '}
                        {((pipeline.currentFlow / pipeline.capacity) * 100).toFixed(0)}%
                      </span>
                      <span>•</span>
                      <span>Pressure: {pipeline.pressure} PSI</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      pipeline.status === 'Operational'
                        ? 'bg-green-100 text-green-700'
                        : pipeline.status === 'Maintenance'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {pipeline.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Nodes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Network Nodes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mockNodes.map((node) => (
              <div
                key={node.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedNode?.id === node.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{node.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{node.type}</p>
                    {node.production && (
                      <p className="text-xs text-gray-500 mt-1">
                        Production: {node.production.toLocaleString()}{' '}
                        {node.type === 'Terminal' ? 'MTPA' : 'MMSCF/D'}
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      node.status === 'Online'
                        ? 'bg-green-100 text-green-700'
                        : node.status === 'Warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        node.status === 'Online'
                          ? 'bg-green-600'
                          : node.status === 'Warning'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                    />
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Details Panel */}
      {selectedPipeline && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pipeline Name</p>
              <p className="font-medium text-gray-900">{selectedPipeline.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Route</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.from} → {selectedPipeline.to}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Length / Diameter</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.length} km / {selectedPipeline.diameter}"
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Capacity</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.capacity.toLocaleString()} MMSCF/D
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Flow</p>
              <p className="font-medium text-gray-900">
                {selectedPipeline.currentFlow.toLocaleString()} MMSCF/D
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Utilization</p>
              <p className="font-medium text-gray-900">
                {((selectedPipeline.currentFlow / selectedPipeline.capacity) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pressure</p>
              <p className="font-medium text-gray-900">{selectedPipeline.pressure} PSI</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  selectedPipeline.status === 'Operational'
                    ? 'bg-green-100 text-green-700'
                    : selectedPipeline.status === 'Maintenance'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {selectedPipeline.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
