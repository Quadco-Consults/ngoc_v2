import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Sun, Moon, Satellite } from 'lucide-react';
import useGasAssetsDataSource from '../../hooks/useGasAssetsDataSource';
import useFlyToCoordinates from '../../hooks/useFlyToCoordinates';
import { setGasPlants, setAGGStations, setGasPipelines, setPowerStations } from '../../store/gasAssetsSlice';
import { loadMapIcons } from './lib/images';

// Map styles
const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
};

type MapStyle = keyof typeof MAP_STYLES;

const defaultSymbolStyle = {
  'icon-size': 0.5,
  'text-anchor': 'top',
  'text-ignore-placement': true,
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 1.4],
};

interface PipelineNetworkMapProps {
  networkStats?: {
    totalLength: number;
    totalCapacity: number;
    totalFlow: number;
    avgUtilization: string;
  };
}

export default function PipelineNetworkMap({ networkStats }: PipelineNetworkMapProps) {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!mapboxToken) {
    console.error('VITE_MAPBOX_TOKEN is not set. Please add it to your .env.local file.');
  }

  mapboxgl.accessToken = mapboxToken || '';

  const dispatch = useDispatch();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapPopupRef = useRef<mapboxgl.Popup | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapStyleLoaded, setMapStyleLoaded] = useState(false);
  const [areIconsLoaded, setIconsLoaded] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyle>('light');
  const [isStyleSwitching, setIsStyleSwitching] = useState(false);

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

  const isMapFullyLoaded = isMapLoaded && isMapStyleLoaded && areIconsLoaded && areDataSourcesReady;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [plants, agg, pipelines, gtsPipelines, powerStations, powerSupplyPipelines, majorPipelines] = await Promise.all([
        import('../../data/gas-plants'),
        import('../../data/agg-stations'),
        import('../../data/gas-pipelines'),
        import('../../data/gts-pipelines'),
        import('../../data/power-stations'),
        import('../../data/power-supply-pipelines'),
        import('../../data/major-pipelines'),
      ]);

      dispatch(setGasPlants(plants.gasPlantsData));
      dispatch(setAGGStations(agg.aggStationsData));
      dispatch(setPowerStations(powerStations.powerStationsData));
      // Combine all pipeline data
      dispatch(setGasPipelines([
        ...pipelines.gasPipelinesData,
        ...gtsPipelines.gtsPipelinesData,
        ...powerSupplyPipelines.powerSupplyPipelines,
        ...majorPipelines.majorPipelinesData,
      ]));
    };

    loadData();
  }, [dispatch]);

  // Switch map style
  const switchMapStyle = (style: MapStyle) => {
    if (!mapRef.current || isStyleSwitching) return;

    setIsStyleSwitching(true);
    setMapStyleLoaded(false);
    setCurrentMapStyle(style);

    mapRef.current.setStyle(MAP_STYLES[style]);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [7.0, 9.0], // Nigeria center
      zoom: 6,
      pitch: 0,
      attributionControl: false,
      style: MAP_STYLES.light,
    });

    const map = mapRef.current;

    map.on('load', () => {
      setMapLoaded(true);
    });

    map.on('style.load', () => {
      setMapStyleLoaded(true);
      setIsStyleSwitching(false);
    });

    mapPopupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: 'gas-asset-popup',
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load custom icons after map style loads
  useEffect(() => {
    if (!mapRef.current || !isMapStyleLoaded) return;

    // Reset icon loaded state when switching styles
    setIconsLoaded(false);

    console.log('Starting to load map icons...');

    loadMapIcons(mapRef.current, (loaded, total) => {
      console.log(`Loading icons progress: ${loaded}/${total}`);
    }).then((success) => {
      console.log(`Icon loading completed. Success: ${success}`);
      if (success) {
        setIconsLoaded(true);
        console.log('All map icons loaded successfully');
      } else {
        console.error('Failed to load some or all map icons');
        // Still set to true to allow map to render
        setIconsLoaded(true);
      }
    }).catch((error) => {
      console.error('Error in loadMapIcons:', error);
      setIconsLoaded(true);
    });
  }, [isMapStyleLoaded]);

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
        <div class="p-3" style="min-width: 250px;">
          <h3 class="font-bold text-sm mb-2">${asset.name}</h3>
          <div class="text-xs space-y-1 mb-3">
            ${asset.tag ? `<p><span class="text-gray-600">Type:</span> <span class="capitalize">${asset.tag.replace(/-/g, ' ')}</span></p>` : ''}
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
          <div class="flex flex-col gap-2 pt-2 border-t border-gray-200">
            <button
              onclick="window.location.href='#'"
              class="w-full px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              View Asset Details
            </button>
            <button
              onclick="window.location.href='#'"
              class="w-full px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Record Incident
            </button>
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

  const handleAssetClick = (e: mapboxgl.MapMouseEvent) => {
    if (!(e?.features?.[0]?.properties && e?.lngLat) || !mapRef.current) return;

    const coordinates = [e.lngLat.lng, e.lngLat.lat];

    // Switch to satellite view
    if (currentMapStyle !== 'satellite') {
      switchMapStyle('satellite');
    }

    // Zoom into the asset location
    mapRef.current.flyTo({
      center: coordinates as [number, number],
      zoom: 16,
      duration: 2000,
      essential: true,
    });
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

    const safelyAddLayer = (layer: any, interactive: boolean = true) => {
      if (!map.getLayer(layer.id)) {
        try {
          map.addLayer(layer);
          if (interactive) {
            map.on('mouseenter', layer.id, handleMouseEnter);
            map.on('mouseleave', layer.id, handleMouseLeave);
            map.on('click', layer.id, handleAssetClick);
          }
        } catch (e) {
          console.error(`Error adding layer ${layer.id}:`, e);
        }
      }
    };

    // Add Gas Plants with clustering
    if (gasPlantGeoJSON?.all) {
      safelyAddSource('gasplant-source', {
        ...gasPlantGeoJSON.all,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circles
      safelyAddLayer({
        id: 'gasplant-clusters',
        type: 'circle',
        source: 'gasplant-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#10b981',
            5,
            '#3b82f6',
            10,
            '#ef4444'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            4,
            5,
            5,
            10,
            6
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      }, false);

      // Cluster count labels
      safelyAddLayer({
        id: 'gasplant-cluster-count',
        type: 'symbol',
        source: 'gasplant-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      }, false);

      // Unclustered point layer with custom icons
      safelyAddLayer({
        id: 'gasplant-layer',
        type: 'symbol',
        source: 'gasplant-source',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': [
            'case',
            ['==', ['get', 'status'], 'operational'],
            'gas-plant-operational',
            ['==', ['get', 'status'], 'maintenance'],
            'gas-plant-maintenance',
            ['==', ['get', 'status'], 'offline'],
            'gas-plant-offline',
            'gas-plant'
          ],
          'icon-size': 0.02,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });

      safelyAddLayer({
        id: 'gasplant-labels',
        type: 'symbol',
        source: 'gasplant-source',
        minzoom: 8, // Only show labels at zoom 8+
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 10,
            10, 12,
            14, 16,
          ],
        },
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.6,
            10, 1,
          ],
        },
      }, false);
    }

    // Add AGG Stations with clustering
    if (aggStationGeoJSON?.all) {
      safelyAddSource('agg-source', {
        ...aggStationGeoJSON.all,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circles
      safelyAddLayer({
        id: 'agg-clusters',
        type: 'circle',
        source: 'agg-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#8b5cf6',
            5,
            '#7c3aed',
            10,
            '#6d28d9'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            3,
            5,
            4,
            10,
            5
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      }, false);

      // Cluster count labels
      safelyAddLayer({
        id: 'agg-cluster-count',
        type: 'symbol',
        source: 'agg-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      }, false);

      // Unclustered point layer with custom icons
      safelyAddLayer({
        id: 'agg-layer',
        type: 'symbol',
        source: 'agg-source',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': [
            'case',
            ['==', ['get', 'status'], 'operational'],
            'agg-station-operational',
            ['==', ['get', 'status'], 'maintenance'],
            'agg-station-maintenance',
            ['==', ['get', 'status'], 'offline'],
            'agg-station-offline',
            'agg-station'
          ],
          'icon-size': 0.02,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });

      safelyAddLayer({
        id: 'agg-labels',
        type: 'symbol',
        source: 'agg-source',
        minzoom: 9, // Only show labels at zoom 9+
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 9,
            11, 11,
            14, 14,
          ],
        },
        paint: {
          'text-color': '#581c87',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 0.6,
            11, 1,
          ],
        },
      }, false);
    }

    // Add Power Stations
    if (powerStationGeoJSON?.all) {
      safelyAddSource('power-source', {
        ...powerStationGeoJSON.all,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circles
      safelyAddLayer({
        id: 'power-clusters',
        type: 'circle',
        source: 'power-source',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#ef4444',
            5,
            '#dc2626',
            10,
            '#b91c1c'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            4,
            5,
            5,
            10,
            6
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      }, false);

      // Cluster count labels
      safelyAddLayer({
        id: 'power-cluster-count',
        type: 'symbol',
        source: 'power-source',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      }, false);

      // Unclustered point layer with custom icons
      safelyAddLayer({
        id: 'power-layer',
        type: 'symbol',
        source: 'power-source',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': [
            'case',
            ['==', ['get', 'status'], 'operational'],
            'power-station-operational',
            ['==', ['get', 'status'], 'maintenance'],
            'power-station-maintenance',
            ['==', ['get', 'status'], 'offline'],
            'power-station-offline',
            'power-station'
          ],
          'icon-size': 0.02,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });

      safelyAddLayer({
        id: 'power-labels',
        type: 'symbol',
        source: 'power-source',
        minzoom: 8, // Only show labels at zoom 8+
        layout: {
          ...defaultSymbolStyle,
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 10,
            10, 12,
            14, 15,
          ],
        },
        paint: {
          'text-color': '#991b1b',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
          'text-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 0.6,
            10, 1,
          ],
        },
      }, false);
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
                5, 1,
                10, 2,
                15, 3
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

    // Add cluster click handlers to zoom in
    const clusterLayers = ['gasplant-clusters', 'agg-clusters', 'power-clusters'];
    clusterLayers.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.on('click', layerId, (e: any) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [layerId]
          });
          const clusterId = features[0].properties.cluster_id;
          const source = map.getSource(layerId.replace('-clusters', '-source')) as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return;

            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom
            });
          });
        });

        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    });

    // Fly to first gas plant
    if (gasPlantGeoJSON?.all?.data?.features?.[0]) {
      const coords = gasPlantGeoJSON.all.data.features[0].geometry.coordinates;
      flyToCoordinates([coords[0], coords[1]], 7);
    }
  }, [isMapFullyLoaded, gasPlantGeoJSON, aggStationGeoJSON, powerStationGeoJSON, pipelineGeoJSON]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />

      {/* Map Style Switcher */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex gap-2">
        <button
          onClick={() => switchMapStyle('light')}
          className={`p-2 rounded transition-colors ${
            currentMapStyle === 'light'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Light Mode"
          disabled={isStyleSwitching}
        >
          <Sun className="w-5 h-5" />
        </button>
        <button
          onClick={() => switchMapStyle('dark')}
          className={`p-2 rounded transition-colors ${
            currentMapStyle === 'dark'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Dark Mode"
          disabled={isStyleSwitching}
        >
          <Moon className="w-5 h-5" />
        </button>
        <button
          onClick={() => switchMapStyle('satellite')}
          className={`p-2 rounded transition-colors ${
            currentMapStyle === 'satellite'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Satellite Mode"
          disabled={isStyleSwitching}
        >
          <Satellite className="w-5 h-5" />
        </button>
      </div>

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

      {/* Pipeline Network Stats - Full Page View */}
      {networkStats && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-sm mb-3">Network Overview</h3>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-600">Total Length</p>
              <p className="text-lg font-bold text-gray-900">{networkStats.totalLength.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-gray-600">Network Capacity</p>
              <p className="text-lg font-bold text-gray-900">{networkStats.totalCapacity.toLocaleString()} MMSCF/D</p>
            </div>
            <div>
              <p className="text-gray-600">Current Throughput</p>
              <p className="text-lg font-bold text-gray-900">{networkStats.totalFlow.toLocaleString()} MMSCF/D</p>
            </div>
            <div>
              <p className="text-gray-600">Avg Utilization</p>
              <p className="text-lg font-bold text-green-600">{networkStats.avgUtilization}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
