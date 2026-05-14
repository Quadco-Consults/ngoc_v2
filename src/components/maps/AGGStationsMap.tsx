import PipelineNetworkMap from '../../modules/network/PipelineNetworkMap';

interface AGGStationsMapProps {
  height?: string;
}

export default function AGGStationsMap({ height = '600px' }: AGGStationsMapProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <PipelineNetworkMap />
    </div>
  );
}
