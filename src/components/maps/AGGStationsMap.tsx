import PipelineNetworkMap from '../../modules/network/PipelineNetworkMap';
import type { AGGStation } from '../../types/gas-assets';

interface AGGStationsMapProps {
  stations: AGGStation[];
  height?: string;
}

export default function AGGStationsMap({ stations, height = '600px' }: AGGStationsMapProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <PipelineNetworkMap />
    </div>
  );
}
