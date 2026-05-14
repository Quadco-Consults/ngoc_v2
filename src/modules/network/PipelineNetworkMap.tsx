import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useGasAssetsDataSource from '../../hooks/useGasAssetsDataSource';
import useFlyToCoordinates from '../../hooks/useFlyToCoordinates';
import { setGasPlants, setAGGStations, setGasPipelines, setPowerStations } from '../../store/gasAssetsSlice';



// Note: access token is set inside the component so we can handle missing tokens gracefully in UI

const defaultSymbolStyle = {
  'icon-size': 0.5,
  'text-anchor': 'top',
  'text-ignore-placement': true,
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 1.4],
};

export default function PipelineNetworkMap() {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

  if (!mapboxToken) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl text-center shadow">
          <h3 className="text-lg font-semibold mb-2">Map unavailable</h3>
          <p className="text-sm text-gray-600 mb-4">An API access token is required to render the map.</p>
          <p className="text-xs text-gray-500">Set the <strong>VITE_MAPBOX_TOKEN</strong> environment variable in your deployment (for Vercel: Project Settings → Environment Variables) and redeploy.</p>
          <a
            className="inline-block mt-4 px-4 py-2 bg-[#00AD51] text-white rounded"
            href="https://docs.mapbox.com/api/overview/#access-tokens-and-token-scopes"
            target="_blank"
            rel="noreferrer"
          >
            Mapbox token docs
          </a>
        </div>
      </div>
    );
  }

  mapboxgl.accessToken = mapboxToken;

  const dispatch = useDispatch();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapPopupRef = useRef<mapboxgl.Popup | null>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapStyleLoaded, setMapStyleLoaded] = useState(false);

  const flyToCoordinates = useFlyToCoordinates(mapRef);

  const {
    gasPlantGeoJSON,
    aggStationGeoJSON,
    powerStationGeoJSON,
    pipelineGeoJSON,
    gasPlantStats,
    aggStationStats,
    powerStationStats,
    pipelineStats,
    areDataSourcesReady,
  } = useGasAssetsDataSource();

  const isMapFullyLoaded = isMapLoaded && isMapStyleLoaded && areDataSourcesReady;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [plants, agg, pipelines, gtsPipelines, powerStations] = await Promise.all([
        import('../../data/gas-plants'),
        import('../../data/agg-stations'),
        import('../../data/gas-pipelines'),
        import('../../data/gts-pipelines'),
        import('../../data/power-stations'),
      ]);

      dispatch(setGasPlants(plants.gasPlantsData));
      dispatch(setAGGStations(agg.aggStationsData));
      dispatch(setPowerStations(powerStations.powerStationsData));
      // Combine existing pipelines with detailed GTS pipelines
      dispatch(setGasPipelines([...pipelines.gasPipelinesData, ...gtsPipelines.gtsPipelinesData]));
    };

    loadData();
  }, [dispatch]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [7.0, 9.0], // Nigeria center
      zoom: 6,
      pitch: 0,
      attributionControl: false,
      style: 'mapbox://styles/mapbox/light-v11',
    });

    const map = mapRef.current;

    map.on('load', () => {
      setMapLoaded(true);
    });

    map.on('style.load', () => {
      setMapStyleLoaded(true);
    });

    mapPopupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: 'gas-asset-popup',
    });

    map.on('click', () => {
      mapPopupRef.current?.remove();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
    if (!(e?.features?.[0]?.properties && e?.lngLat) || !mapRef.current) return;

    mapRef.current.getCanvas().style.cursor = 'pointer';

    const coordinates = [e.lngLat.lng, e.lngLat.lat];
    const asset = e.features[0].properties;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }



    if (mapPopupRef.current) {
      const popupHTML = `
        <div class="p-3">
          <h3 class="font-bold text-sm mb-2">${asset.name}</h3>
          <div class="text-xs space-y-1">
            ${asset.type ? `<p><span class="text-gray-600">Type:</span> ${asset.type}</p>` : ''}
            ${asset.operator ? `<p><span class="text-gray-600">Operator:</span> ${asset.operator}</p>` : ''}
            ${asset.installedCapacity ? `<p><span class="text-gray-600">Capacity:</span> ${asset.installedCapacity} MMSCFD</p>` : ''}
            ${asset.designCapacity ? `<p><span class="text-gray-600">Capacity:</span> ${asset.designCapacity} MMSCFD</p>` : ''}
            ${asset.capacity ? `<p><span class="text-gray-600">Capacity:</span> ${asset.capacity} MW</p>` : ''}
            ${asset.generation ? `<p><span class="text-gray-600">Generation:</span> ${asset.generation} MW</p>` : ''}
            ${asset.gasConsumption ? `<p><span class="text-gray-600">Gas Consumption:</span> ${asset.gasConsumption} MMSCF/D</p>` : ''}
            ${asset.efficiency ? `<p><span class="text-gray-600">Efficiency:</span> ${asset.efficiency}%</p>` : ''}
            <p><span class="text-gray-600">Status:</span>
              <span class="px-2 py-0.5 rounded-full text-xs ${
                asset.status === 'operational' ? 'bg-green-100 text-green-700' :
                asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }">${asset.status}</span>
            </p>
          </div>
        </div>
      `;

      mapPopupRef.current
        .setLngLat(coordinates as mapboxgl.LngLatLike)
        .setHTML(popupHTML)
        .addTo(mapRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
  };

  // Add layers when data is ready
  useEffect(() => {
    if (!isMapFullyLoaded || !mapRef.current) return;

    const map = mapRef.current;

    const safelyAddSource = (sourceId: string, source: any) => {
      if (!map.getSource(sourceId)) {
        try {
          map.addSource(sourceId, source);
        } catch (e) {
          console.error(`Error adding source ${sourceId}:`, e);
        }
      }
    };

    const safelyAddLayer = (layer: any) => {
      if (!map.getLayer(layer.id)) {
        try {
          map.addLayer(layer);
          map.on('mouseenter', layer.id, handleMouseEnter);
          map.on('mouseleave', layer.id, handleMouseLeave);
        } catch (e) {
          console.error(`Error adding layer ${layer.id}:`, e);
        }
      }
    };

    // Add Gas Plants
    if (gasPlantGeoJSON?.all) {
      safelyAddSource('gasplant-source', gasPlantGeoJSON.all);
      safelyAddLayer({
        id: 'gasplant-layer',
        type: 'circle',
        source: 'gasplant-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 4,
            10, 8,
            15, 12
          ],
          'circle-color': [
            'match',
            ['get', 'status'],
            'operational', '#10b981',
            'maintenance', '#f59e0b',
            'offline', '#6b7280',
            '#3b82f6'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      safelyAddLayer({
        id: 'gasplant-labels',
        type: 'symbol',
        source: 'gasplant-source',
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 0,
            7, 10,
            10, 14,
          ],
        },
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      });
    }

    // Add AGG Stations
    if (aggStationGeoJSON?.all) {
      safelyAddSource('agg-source', aggStationGeoJSON.all);
      safelyAddLayer({
        id: 'agg-layer',
        type: 'circle',
        source: 'agg-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 3,
            10, 6,
            15, 10
          ],
          'circle-color': [
            'match',
            ['get', 'status'],
            'operational', '#8b5cf6',
            'maintenance', '#f59e0b',
            'offline', '#6b7280',
            '#a855f7'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      safelyAddLayer({
        id: 'agg-labels',
        type: 'symbol',
        source: 'agg-source',
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 0,
            7, 9,
            10, 12,
          ],
        },
        paint: {
          'text-color': '#581c87',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      });
    }

    // Add Power Stations
    if (powerStationGeoJSON?.all) {
      safelyAddSource('power-source', powerStationGeoJSON.all);
      safelyAddLayer({
        id: 'power-layer',
        type: 'circle',
        source: 'power-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 5,
            10, 10,
            15, 15
          ],
          'circle-color': [
            'match',
            ['get', 'status'],
            'operational', '#ef4444',
            'maintenance', '#f59e0b',
            'offline', '#6b7280',
            '#dc2626'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      safelyAddLayer({
        id: 'power-labels',
        type: 'symbol',
        source: 'power-source',
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5, 0,
            7, 10,
            10, 13,
          ],
        },
        paint: {
          'text-color': '#991b1b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      });
    }

    // Add Pipelines
    if (pipelineGeoJSON) {
      const pipelineTypes = [
        { key: 'transmission', id: 'transmission-line', color: '#0172CB' },
        { key: 'gathering', id: 'gathering-line', color: '#10b981' },
        { key: 'distribution', id: 'distribution-line', color: '#f59e0b' },
      ];

      pipelineTypes.forEach(({ key, id, color }) => {
        // @ts-ignore
        if (pipelineGeoJSON[key]) {
          // @ts-ignore
          safelyAddSource(`${id}-source`, pipelineGeoJSON[key]);

          const layer: any = {
            id: `${id}-layer`,
            source: `${id}-source`,
            type: 'line',
            paint: {
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5, 2,
                10, 4,
                15, 6
              ],
              'line-color': [
                'match',
                ['get', 'status'],
                'operational', color,
                'maintenance', '#FFBF00',
                'offline', '#BD1B00',
                color
              ],
            },
          };

          safelyAddLayer(layer);
        }
      });
    }

    // Fly to first gas plant
    if (gasPlantGeoJSON?.all?.data?.features?.[0]) {
      const coords = gasPlantGeoJSON.all.data.features[0].geometry.coordinates;
      flyToCoordinates([coords[0], coords[1]], 7);
    }
  }, [isMapFullyLoaded, gasPlantGeoJSON, aggStationGeoJSON, powerStationGeoJSON, pipelineGeoJSON]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-sm mb-3">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Gas Plants ({gasPlantStats?.operational || 0} operational)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white"></div>
            <span>AGG Stations ({aggStationStats?.operational || 0} operational)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span>Power Stations ({powerStationStats?.operational || 0} operational)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-600"></div>
            <span>Transmission Pipelines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-600"></div>
            <span>Gathering Pipelines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-orange-500"></div>
            <span>Distribution Pipelines</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-gray-600">Plants</p>
            <p className="text-lg font-bold">{gasPlantStats?.all || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">AGG Stations</p>
            <p className="text-lg font-bold">{aggStationStats?.all || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Power Stations</p>
            <p className="text-lg font-bold">{powerStationStats?.all || 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Pipelines</p>
            <p className="text-lg font-bold">{pipelineStats?.all || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
