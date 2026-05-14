import { Building2, Factory, GitBranch, MapPin, Activity } from 'lucide-react';

import type { FacilityStatus } from '../../../types/gas-assets';

interface Asset {
  id: string;
  name: string;
  type: 'Gas Plant' | 'AGG Station' | 'Pipeline';
  operator: string;
  status: FacilityStatus;
  location?: { lat: number; lng: number };
  capacity?: number;
  installedCapacity?: number;
  designCapacity?: number;
  utilization?: number;
}

interface AssetCardProps {
  asset: Asset;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

export default function AssetCard({ asset, viewMode, onClick }: AssetCardProps) {
  const getAssetIcon = () => {
    switch (asset.type) {
      case 'Gas Plant':
        return <Factory className="w-8 h-8" />;
      case 'AGG Station':
        return <Building2 className="w-8 h-8" />;
      case 'Pipeline':
        return <GitBranch className="w-8 h-8" />;
      default:
        return <Building2 className="w-8 h-8" />;
    }
  };

  const getAssetColor = () => {
    switch (asset.type) {
      case 'Gas Plant':
        return 'text-green-600 bg-green-50';
      case 'AGG Station':
        return 'text-purple-600 bg-purple-50';
      case 'Pipeline':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = () => {
    switch (asset.status) {
      case 'operational':
        return 'bg-green-100 text-green-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
      case 'offline':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${getAssetColor()}`}>
            {getAssetIcon()}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{asset.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{asset.operator}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{asset.type}</span>
              </div>
              {asset.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {asset.location.lat.toFixed(4)}, {asset.location.lng.toFixed(4)}
                  </span>
                </div>
              )}
              {(asset.capacity || asset.installedCapacity || asset.designCapacity) && (
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>
                    {asset.capacity || asset.installedCapacity || asset.designCapacity} MMSCF/D
                  </span>
                </div>
              )}
              {asset.utilization && (
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>Utilization: {asset.utilization}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${getAssetColor()} group-hover:scale-110 transition-transform`}>
          {getAssetIcon()}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
          {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
          {asset.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{asset.operator}</p>

        {/* Asset Type Badge */}
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 mb-3">
          <Building2 className="w-3 h-3" />
          {asset.type}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {asset.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">
                {asset.location.lat.toFixed(4)}, {asset.location.lng.toFixed(4)}
              </span>
            </div>
          )}
          {(asset.capacity || asset.installedCapacity || asset.designCapacity) && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium text-gray-900">
                {asset.capacity || asset.installedCapacity || asset.designCapacity} MMSCF/D
              </span>
            </div>
          )}
          {asset.utilization !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Utilization:</span>
              <span className="font-medium text-gray-900">{asset.utilization}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-primary-600 font-medium">Click to view details →</p>
      </div>
    </div>
  );
}
