import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RefObject, useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import NetworkPopUp from "../components/NetworkPopUp";
import "./PipelineNetwork.css";
import Navigation from "../components/Navigation";
import {
    MenuItem,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import NetworkLegend from "../components/NetworkLegend";
import useGasAssetsDataSource from "../../../hooks/useGasAssetsDataSource";
import useFlyToCoordinates from "../hooks/useFlyToCoordinates";
import { setGasPlants, setAGGStations, setGasPipelines, setPowerStations, setCompressionStations, setMeteringStations, setJunctionNodes, setGasFields, setGasWells } from '../../../store/gasAssetsSlice';
import { loadMapIcons } from '../../../utils/mapIcons';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

const defaultSymbolStyle = {
    "icon-size": 3,
    "text-anchor": "top",
    "text-ignore-placement": true,
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-offset": [0, 1.4],
};

const mapStyles = {
    empty: "mapbox://styles/rootambat/cky1n8g7t08yw14p6qvz1nqec",
    satellite: "mapbox://styles/rootambat/ckye3ovvc7p9f14qkhovt23it",
    standard: "mapbox://styles/mapbox/standard",
    dark11: "mapbox://styles/mapbox/dark-v11",
    streetV9: "mapbox://styles/mapbox/streets-v9",
    navigationDayV1: "mapbox://styles/mapbox/navigation-day-v1",
    navigationNightV1: "mapbox://styles/mapbox/navigation-night-v1",
};

export default function PipelineNetwork() {
    const dispatch = useDispatch();
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapPopupRef = useRef<mapboxgl.Popup | null>(null);
    const mapPopupContentRef = useRef<HTMLDivElement>(null);

    const [isMapLoaded, setMapLoaded] = useState(false);
    const [isMapStyleLoaded, setMapStyleLoaded] = useState(false);
    const [areImagesLoaded, setImagesLoaded] = useState(false);
    const [lightPreset, setLightPreset] = useState("day");
    const [networkArea, setNetworkArea] = useState("");
    const [hasFlownToInitialCoordinates, setHasFlownToInitialCoordinates] =
        useState(false);

    const [popUpDetails, setPopUpDetails] = useState<{
        e: mapboxgl.MapMouseEvent;
        asset: any;
    } | null>();

    const flyToCoordinates = useFlyToCoordinates(mapRef);
    const [isNetworkLegendOpen, setIsNetworkLegendOpen] = useState(false);

    const {
        gasPlantGeoJSON,
        aggStationGeoJSON,
        powerStationGeoJSON,
        pipelineGeoJSON,
        compressionStationGeoJSON,
        meteringStationGeoJSON,
        junctionNodeGeoJSON,
        gasFieldGeoJSON,
        gasWellGeoJSON,
    } = useGasAssetsDataSource();

    const areDataSourcesReady = Boolean(
        gasPlantGeoJSON &&
            aggStationGeoJSON &&
            powerStationGeoJSON &&
            pipelineGeoJSON
    );

    const isMapFullyLoaded =
        isMapLoaded &&
        isMapStyleLoaded &&
        areDataSourcesReady &&
        areImagesLoaded;

    // Load gas assets data
    useEffect(() => {
        const loadData = async () => {
            const [
                plants,
                agg,
                pipelines,
                gtsPipelines,
                powerStations,
                powerSupplyPipelines,
                majorPipelines,
                compressionStations,
                meteringStations,
                junctionNodes,
                gasFields,
                gasWells,
            ] = await Promise.all([
                import('../../../data/gas-plants'),
                import('../../../data/agg-stations'),
                import('../../../data/gas-pipelines'),
                import('../../../data/gts-pipelines'),
                import('../../../data/power-stations'),
                import('../../../data/power-supply-pipelines'),
                import('../../../data/major-pipelines'),
                import('../../../data/compression-stations'),
                import('../../../data/metering-stations'),
                import('../../../data/junction-nodes'),
                import('../../../data/gas-fields'),
                import('../../../data/gas-wells'),
            ]);

            dispatch(setGasPlants(plants.gasPlantsData));
            dispatch(setAGGStations(agg.aggStationsData));
            dispatch(setPowerStations(powerStations.powerStationsData));
            dispatch(setCompressionStations(compressionStations.compressionStationsData));
            dispatch(setMeteringStations(meteringStations.meteringStationsData));
            dispatch(setJunctionNodes(junctionNodes.junctionNodesData));
            dispatch(setGasFields(gasFields.gasFieldsData));
            dispatch(setGasWells(gasWells.gasWellsData));
            dispatch(setGasPipelines([
                ...pipelines.gasPipelinesData,
                ...gtsPipelines.gtsPipelinesData,
                ...powerSupplyPipelines.powerSupplyPipelines,
                ...majorPipelines.majorPipelinesData,
            ]));
        };

        loadData();
    }, [dispatch]);

    const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
        if (!(e?.features?.[0]?.properties && e?.lngLat) || !mapRef.current)
            return;

        mapRef.current.getCanvas().style.cursor = "pointer";

        const coordinates = [e.lngLat.lng, e.lngLat.lat];
        const asset = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        setPopUpDetails({ e, asset });

        if (mapPopupRef.current && mapPopupContentRef.current) {
            mapPopupRef.current
                .setLngLat(coordinates as mapboxgl.LngLatLike)
                .setDOMContent(mapPopupContentRef.current)
                .addTo(mapRef.current);
        }
    };

    const handleMouseLeave = () => {
        if (mapRef.current) {
            mapRef.current.getCanvas().style.cursor = "";
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [7.0, 9.0], // Nigeria center
            zoom: 6,
            pitch: 45,
            attributionControl: false,
            style:
                lightPreset === "night" ? mapStyles.dark11 : mapStyles.standard,
        });

        const map = mapRef.current;

        map.on("load", () => {
            setMapLoaded(true);

            setTimeout(() => {
                loadMapIcons(map).then((success) => {
                    setImagesLoaded(success);
                });
            }, 500);
        });

        map.on("style.load", () => {
            setMapStyleLoaded(true);
            setImagesLoaded(false);
            setTimeout(() => {
                loadMapIcons(map).then((success) => {
                    setImagesLoaded(success);
                });
            }, 500);
        });

        mapPopupRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "Network__popup",
        });

        map.on("click", () => {
            mapPopupRef.current?.remove();
            setPopUpDetails(null);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && isMapLoaded) {
            mapRef.current.setStyle(
                lightPreset === "night" ? mapStyles.dark11 : mapStyles.standard
            );
        }
    }, [lightPreset]);

    useEffect(() => {
        if (mapRef.current && isMapStyleLoaded && lightPreset !== "night") {
            const map = mapRef.current;
            map.setConfigProperty("basemap", "showRoadLabels", false);
            map.setConfigProperty(
                "basemap",
                "showPointOfInterestLabels",
                false
            );
            map.setConfigProperty("basemap", "showTransitLabels", false);
            map.setConfigProperty("basemap", "lightPreset", lightPreset);
        }
    }, [isMapStyleLoaded, lightPreset]);

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
                    map.on("mouseenter", layer.id, handleMouseEnter);
                    map.on("mouseleave", layer.id, handleMouseLeave);
                } catch (e) {
                    console.error(`Error adding layer ${layer.id}:`, e);
                }
            }
        };

        // Add Gas Plants
        if (gasPlantGeoJSON?.all) {
            safelyAddSource("gasplant-source", gasPlantGeoJSON.all);
            safelyAddLayer({
                id: "gasplant-layer",
                type: "symbol",
                source: "gasplant-source",
                paint: {
                    "icon-color": "#ff00ff",
                    "icon-halo-color": "red",
                    "text-color": "red",
                },
                layout: {
                    ...defaultSymbolStyle,
                    "icon-size": 0.02,
                    "text-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0,
                        6,
                        0,
                        8,
                        11,
                        18,
                        16,
                    ],
                    "text-field": ["get", "name"],
                    "icon-image": [
                        "case",
                        ["==", ["get", "status"], "operational"],
                        "gas-plant-operational",
                        ["==", ["get", "status"], "maintenance"],
                        "gas-plant-maintenance",
                        ["==", ["get", "status"], "offline"],
                        "gas-plant-offline",
                        "gas-plant",
                    ],
                },
            });
        }

        // Add AGG Stations
        if (aggStationGeoJSON?.all) {
            safelyAddSource("agg-source", aggStationGeoJSON.all);
            safelyAddLayer({
                id: "agg-layer",
                source: "agg-source",
                type: "symbol",
                paint: {
                    "icon-color": "#ff0000",
                    "icon-halo-color": "red",
                    "text-color": "green",
                },
                layout: {
                    ...defaultSymbolStyle,
                    "icon-size": 0.02,
                    "text-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0,
                        6,
                        0,
                        8,
                        11,
                        18,
                        16,
                    ],
                    "text-field": ["get", "name"],
                    "icon-image": [
                        "case",
                        ["==", ["get", "status"], "operational"],
                        "agg-station-operational",
                        ["==", ["get", "status"], "maintenance"],
                        "agg-station-maintenance",
                        ["==", ["get", "status"], "offline"],
                        "agg-station-offline",
                        "agg-station",
                    ],
                },
            });
        }

        // Add Power Stations
        if (powerStationGeoJSON?.all) {
            safelyAddSource("power-source", powerStationGeoJSON.all);
            safelyAddLayer({
                id: "power-layer",
                source: "power-source",
                type: "symbol",
                paint: {
                    "icon-color": "#ff0000",
                    "icon-halo-color": "red",
                    "text-color": "green",
                },
                layout: {
                    ...defaultSymbolStyle,
                    "text-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        0,
                        6,
                        0,
                        8,
                        11,
                        18,
                        16,
                    ],
                    "icon-size": 0.02,
                    "text-field": ["get", "name"],
                    "icon-image": [
                        "case",
                        ["==", ["get", "status"], "operational"],
                        "power-station-operational",
                        ["==", ["get", "status"], "maintenance"],
                        "power-station-maintenance",
                        ["==", ["get", "status"], "offline"],
                        "power-station-offline",
                        "power-station",
                    ],
                },
            });
        }

        // Add Compression Stations
        if (compressionStationGeoJSON?.all) {
            safelyAddSource("compression-source", compressionStationGeoJSON.all);
            safelyAddLayer({
                id: "compression-layer",
                type: "circle",
                source: "compression-source",
                paint: {
                    "circle-radius": 6,
                    "circle-color": [
                        "match",
                        ["get", "status"],
                        "operational", "#8B4513",
                        "maintenance", "#FFBF00",
                        "offline", "#BD1B00",
                        "#8B4513"
                    ],
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });
        }

        // Add Junction Nodes
        if (junctionNodeGeoJSON?.all) {
            safelyAddSource("junction-source", junctionNodeGeoJSON.all);
            safelyAddLayer({
                id: "junction-layer",
                type: "circle",
                source: "junction-source",
                paint: {
                    "circle-radius": 5,
                    "circle-color": [
                        "match",
                        ["get", "status"],
                        "operational", "#6B7280",
                        "maintenance", "#FFBF00",
                        "offline", "#BD1B00",
                        "#6B7280"
                    ],
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });
        }

        // Add Gas Pipelines
        if (pipelineGeoJSON) {
            const getLineColor = (lightPreset: string) => [
                "case",
                ["==", ["get", "status"], "operational"],
                {
                    day: "#0172CB",
                    dawn: "#0172CB",
                    dusk: "#0172CB",
                    night: "#0172CB",
                }[lightPreset],
                ["==", ["get", "status"], "offline"],
                {
                    day: "#BD1B00",
                    dawn: "#BD1B00",
                    dusk: "#FF6666",
                    night: "#FF6666",
                }[lightPreset],
                ["==", ["get", "status"], "maintenance"],
                {
                    day: "#FFBF00",
                    dawn: "#FFBF00",
                    dusk: "#FFBF00",
                    night: "#FFBF00",
                }[lightPreset],
                {
                    day: "#015090",
                    dawn: "#015090",
                    dusk: "#F4F0F0",
                    night: "#F4F0F0",
                }[lightPreset],
            ];

            const pipelineTypes = [
                { key: "all", id: "all-pipelines" },
                { key: "transmission", id: "transmission-line" },
                { key: "gathering", id: "gathering-line" },
                { key: "distribution", id: "distribution-line" },
            ];

            pipelineTypes.forEach(({ key, id }) => {
                if (pipelineGeoJSON[key]) {
                    safelyAddSource(`${id}-source`, pipelineGeoJSON[key]);

                    const layer: any = {
                        id: `${id}-layer`,
                        source: `${id}-source`,
                        type: "line",
                        paint: {
                            "line-width": 3,
                            "line-color": getLineColor(lightPreset),
                            "line-opacity": 0.4,
                        },
                    };

                    if (!map.getLayer(layer.id)) {
                        try {
                            map.addLayer(layer);
                            map.on("mouseenter", layer.id, handleMouseEnter);
                            map.on("mouseleave", layer.id, handleMouseLeave);

                            // Add animated dashed layer for all pipelines
                            const dashedLayer = {
                                id: `${id}-dashed`,
                                source: `${id}-source`,
                                type: "line",
                                paint: {
                                    "line-width": 3,
                                    "line-color": getLineColor(lightPreset),
                                    "line-dasharray": [0, 4, 3],
                                },
                            };

                            map.addLayer(dashedLayer);
                            requestAnimationFrame(() =>
                                animateLine(mapRef, `${id}-dashed`)
                            );
                        } catch (e) {
                            console.error(
                                `Error adding pipeline layer ${layer.id}:`,
                                e
                            );
                        }
                    }
                }
            });
        }
    }, [
        isMapFullyLoaded,
        lightPreset,
        gasPlantGeoJSON,
        aggStationGeoJSON,
        powerStationGeoJSON,
        pipelineGeoJSON,
        compressionStationGeoJSON,
        junctionNodeGeoJSON,
    ]);

    useEffect(() => {
        if (
            pipelineGeoJSON?.all?.data?.features?.[0] &&
            !hasFlownToInitialCoordinates
        ) {
            flyToCoordinates(
                pipelineGeoJSON.all.data.features[0].geometry.coordinates[0],
                7
            );
            setHasFlownToInitialCoordinates(true);
        }
    }, [pipelineGeoJSON]);

    useEffect(() => {
        if (!networkArea || !pipelineGeoJSON?.all?.data?.features) return;

        const features = pipelineGeoJSON.all.data.features;
        const matchingPipeline = features.find(
            (feature: any) => feature.properties?.name?.includes(networkArea)
        );

        if (matchingPipeline?.geometry?.coordinates?.[0]) {
            flyToCoordinates(
                matchingPipeline.geometry.coordinates[0] as [number, number],
                10
            );
        }
    }, [networkArea, pipelineGeoJSON]);

    return (
        <>
            <div className="h-full w-full">
                <div className="flex items-center justify-between gap-2 p-2 pb-0 w-full">
                    <Navigation />
                    <div className="flex items-stretch gap-3">
                        <TextField
                            size="small"
                            label="Light Preset"
                            select
                            className="w-36"
                            value={lightPreset}
                            onChange={(e) => {
                                setMapStyleLoaded(false);
                                setLightPreset(e.target.value);
                            }}
                        >
                            {[
                                { label: "Day", value: "day" },
                                { label: "Night", value: "night" },
                                { label: "Dusk", value: "dusk" },
                                { label: "Dawn", value: "dawn" },
                            ].map(({ value, label }) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <ToggleButtonGroup
                            value={networkArea}
                            exclusive
                            onChange={(_, value) => setNetworkArea(value)}
                            aria-label="text alignment"
                            color="primary"
                            size="small"
                        >
                            {["AKK", "ELPS", "WAGL", "NCTL", "OB3"].map(
                                (label) => (
                                    <ToggleButton key={label} value={label}>
                                        <Typography>{label}</Typography>
                                    </ToggleButton>
                                )
                            )}
                        </ToggleButtonGroup>

                        <NetworkLegend
                            isOpen={isNetworkLegendOpen}
                            onOpen={() => setIsNetworkLegendOpen(true)}
                            onClose={() => setIsNetworkLegendOpen(false)}
                            onItemClick={(coordinates: [number, number]) =>
                                flyToCoordinates(coordinates, 12)
                            }
                        />
                    </div>
                </div>
                <div
                    ref={mapContainerRef}
                    id="map"
                    className="rounded-lg h-full mt-3 w-full"
                />
            </div>
            <div className="hidden">
                <div ref={mapPopupContentRef}>
                    {popUpDetails && (
                        <NetworkPopUp {...popUpDetails} mapRef={mapRef} />
                    )}
                </div>
            </div>
        </>
    );
}

function animateLine(mapRef: RefObject<mapboxgl.Map>, layerId: string) {
    let step = 0;
    const map = mapRef?.current;

    if (!(layerId && map && map?.getLayer(layerId))) return;

    const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5],
    ];

    function animateDashArray(timestamp: number) {
        if (!map || !map.getLayer(layerId)) return;

        const newStep = Math.floor(
            (timestamp / 100) % dashArraySequence.length
        );

        if (newStep !== step) {
            map.setPaintProperty(
                layerId,
                "line-dasharray",
                dashArraySequence[newStep]
            );
            step = newStep;
        }
        requestAnimationFrame(animateDashArray);
    }

    requestAnimationFrame(animateDashArray);
}
