import PipelineNetworkMap from '../../modules/network/PipelineNetworkMap';

interface AGGStationsMapProps {
  stations?: any[];
  height?: string;
}

export default function AGGStationsMap({ stations, height = '600px' }: AGGStationsMapProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <PipelineNetworkMap />
    </div>
  );
}
