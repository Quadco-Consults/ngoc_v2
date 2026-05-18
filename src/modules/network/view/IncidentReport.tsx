import "./IncidentReport.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import usePipelineDataSource from "../hooks/usePipelineDataSource";
import Navigation from "../components/Navigation";
import {
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import NetworkLegend from "../components/NetworkLegend";
import IncidentReportAssetMarkerWithDeferment from "../components/IncidentReportAssetMarkerWithDeferement";
import FlowstationPng from "../assets/imgs/flowstation.png";
import FlowstationActivePng from "../assets/imgs/flowstation-active.png";
import FlowstationInactivePng from "../assets/imgs/flowstation-inactive.png";
import FlowstationMaintainancePng from "../assets/imgs/flowstation-maintainance.png";
// import AddIncidentReport from "../../incident-report/components/AddIncidentReport";
import TerminalPng from "../assets/imgs/terminal.png";
import TerminalActivePng from "../assets/imgs/terminal-active.png";
import TerminalInactivePng from "../assets/imgs/terminal-inactive.png";
import TerminalMaintainancePng from "../assets/imgs/terminal-maintainance.png";
import NumberTypography from "../components/NumberTypography";
import useFlyToCoordinates from "../hooks/useFlyToCoordinates";
import { IMAGES } from "../lib/images";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

export default function PipelineNetworkIncidentReport() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
    const [areDataSourcesReady, setDataSourcesReady] = useState(false);
    const [areImagesLoaded, setImagesLoaded] = useState(false);
    const isMapFullyLoaded =
        isMapLoaded &&
        isMapStyleLoaded &&
        areDataSourcesReady &&
        areImagesLoaded;

    const [networkArea, setNetworkArea] = useState("");

    const [lightPreset] = useState("day");

    const flyToCoordinates = useFlyToCoordinates(mapRef);

    const [isIncidentReportOpen, setIsIncidentReportOpen] = useState(false);
    const [incidentReportData, setIncidentReportData] = useState<{
        id: string;
        tag: string;
        name: string;
        pipeline_type?: string;
    }>({ id: "", tag: "", name: "" });

    const pipelineDataSource = usePipelineDataSource();

    const [isNetworkLegendOpen, setIsNetworkLegendOpen] = useState(false);

    const {
        pipelineGeoJSON,
        flowStationGeoJSON,
        terminalGeoJSON,
        FPSOGeoJSON,
        totalDeferment,
        FSOGeoJSON,
    } = pipelineDataSource;

    useEffect(() => {
        if (
            pipelineGeoJSON &&
            flowStationGeoJSON &&
            terminalGeoJSON &&
            FPSOGeoJSON &&
            FSOGeoJSON
        ) {
            setDataSourcesReady(true);
        } else {
            setDataSourcesReady(false);
        }
    }, [
        pipelineGeoJSON,
        flowStationGeoJSON,
        terminalGeoJSON,
        FPSOGeoJSON,
        FSOGeoJSON,
    ]);

    const handleTrunklineClick = (e: mapboxgl.MapMouseEvent) => {
        if (!(e?.features?.[0]?.properties && e?.lngLat)) {
            return;
        }

        const map = mapRef?.current;

        if (map) {
            map.getCanvas().style.cursor = "pointer";
            const asset = e.features[0].properties;
            setIsIncidentReportOpen(true);
            setIncidentReportData(asset as any);
        }
    };

    const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
        if (!(e?.features?.[0]?.properties && e?.lngLat)) {
            return;
        }

        const map = mapRef?.current;

        if (map) {
            map.getCanvas().style.cursor = "pointer";
        }
    };

    const handleMouseLeave = () => {
        const map = mapRef?.current;

        if (map) {
            map.getCanvas().style.cursor = "";
        }
    };

    useLayoutEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [8, 8],
            zoom: 5,
            pitch: 45,
            style: { version: 8, sources: {}, layers: [] },
            attributionControl: false,
        });

        mapRef.current.on("style.load", () => {
            setIsMapStyleLoaded(true);
            setImagesLoaded(false);
            loadImages(mapRef, setImagesLoaded);
        });

        mapRef.current.on("load", () => {
            setIsMapLoaded(true);
            loadImages(mapRef, setImagesLoaded);
        });

        mapRef.current.on("error", () => {});

        mapRef.current.on("styledataloading", () => {
            setIsMapStyleLoaded(false);
            setImagesLoaded(false);
        });

        mapRef.current.on("style.import.load", () => {});

        return () => {
            mapRef?.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef?.current;

        if (map) {
            if (lightPreset === "night") {
                map.setStyle({
                    version: 8,
                    sources: {},
                    layers: [],
                });
            } else {
                map.setStyle({
                    version: 8,
                    sources: {},
                    layers: [],
                });
            }
        }
    }, [lightPreset]);

    useEffect(() => {
        if (
            !isMapFullyLoaded ||
            // @ts-ignore
            !pipelineGeoJSON?.all?.data ||
            !mapRef.current
        ) {
            return;
        }

        const map = mapRef?.current;

        const addDeliveryLineLayer = () => {
            if (map?.getSource("delivery-line-source")) return;

            const lightPresetConfig = {
                day: {
                    lineColor: "#0172CB",
                },
                dawn: {
                    lineColor: "#0172CB",
                },
                dusk: {
                    lineColor: "#84E9FF",
                },
                night: {
                    lineColor: "#84E9FF",
                },
            }[lightPreset];

            map?.addSource(
                "delivery-line-source",
                // @ts-ignore
                pipelineGeoJSON?.all
            );

            map?.addLayer({
                id: "delivery-line-layer",
                source: "delivery-line-source",
                type: "line",
                paint: {
                    "line-width": 6,
                    // @ts-ignore
                    "line-color": lightPresetConfig?.lineColor,
                },
            });
        };

        if (map?.isStyleLoaded()) {
            addDeliveryLineLayer();
        } else {
            map.once("styledata", addDeliveryLineLayer);
        }

        map?.on("mouseenter", "delivery-line-layer", handleMouseEnter);
        map?.on("mouseleave", "delivery-line-layer", handleMouseLeave);
        map?.on("click", "delivery-line-layer", handleTrunklineClick);

        return () => {
            map.off("load", addDeliveryLineLayer);
            map.off("mouseenter", "delivery-line-layer", handleMouseEnter);
            map.off("mouseleave", "delivery-line-layer", handleMouseLeave);
        };
    }, [isMapFullyLoaded, lightPreset, pipelineGeoJSON]);

    // Image loading function
    const loadImages = (
        mapRef: React.RefObject<mapboxgl.Map>,
        setImagesLoaded?: (loaded: boolean) => void
    ) => {
        const map = mapRef?.current;

        if (map && setImagesLoaded) {
            let loadedCount = 0;
            const totalImages = IMAGES.filter((img) => img.url).length;

            if (totalImages === 0) {
                setImagesLoaded(true);
                return;
            }

            IMAGES.forEach((img) => {
                if (!img.url) {
                    return;
                }

                if (map.hasImage(img.label)) {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                    return;
                }

                map.loadImage(img.url, (error, image) => {
                    if (error) {
                        console.error(
                            `Error loading image ${img.label}:`,
                            error
                        );
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            setImagesLoaded(true);
                        }
                        return;
                    }

                    try {
                        if (!map.hasImage(img.label)) {
                            map.addImage(img.label, image as ImageData);
                        }
                    } catch (e) {
                        console.error(`Error adding image ${img.label}:`, e);
                    }

                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setImagesLoaded(true);
                    }
                });
            });
        } else if (map) {
            IMAGES.forEach((img) => {
                if (!img.url) {
                    return;
                }

                map.loadImage(img.url, (error, image) => {
                    if (error) {
                        console.error(
                            `Error loading image ${img.label}:`,
                            error
                        );
                        return;
                    }

                    try {
                        if (!map.hasImage(img.label)) {
                            map.addImage(img.label, image as ImageData);
                        }
                    } catch (e) {
                        console.error(`Error adding image ${img.label}:`, e);
                    }
                });
            });
        }
    };

    return (
        <>
            <div className="h-full bg-white flex flex-col">
                <div className="flex items-center gap-2 p-2 pb-0">
                    <Navigation />
                    <div className="flex-1" />

                    <ToggleButtonGroup
                        value={networkArea}
                        exclusive
                        onChange={(_, value) => setNetworkArea(value)}
                        aria-label="text alignment"
                        color="primary"
                        size="small"
                    >
                        {["TNP", "TRP", "TFP", "TEP", "NCTL", "SBTL"].map(
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
                            flyToCoordinates(coordinates)
                        }
                    />
                </div>
                <div className="flex-1 min-h-0 p-2 relative">
                    <div
                        ref={mapContainerRef}
                        id="map"
                        className="rounded-lg h-full"
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#B0CCEA] text-center">
                        <Typography className="p-2 font-bold">
                            Total Deferment (KBOPD)
                        </Typography>
                        <Divider className="bg-text-primary" />
                        <NumberTypography className="p-2 font-bold">
                            {totalDeferment}
                        </NumberTypography>
                    </div>
                </div>
            </div>

            {isMapFullyLoaded ? (
                <>
                    {console.log(
                        "IncidentReport: Rendering asset markers - all dependencies ready"
                    )}
                    <div style={{ display: "none" }}>
                        {flowStationGeoJSON?.all?.data?.features?.map(
                            (feature) => (
                                <IncidentReportAssetMarkerWithDeferment
                                    key={feature?.id}
                                    {...{
                                        mapRef,
                                        feature,
                                        icon:
                                            {
                                                active: FlowstationActivePng,
                                                inactive:
                                                    FlowstationInactivePng,
                                                maintenance:
                                                    FlowstationMaintainancePng,
                                            }[
                                                feature?.properties?.facility_status?.toLowerCase() as string
                                            ] ?? FlowstationPng,
                                        name: feature?.properties?.name,
                                        status: feature?.properties
                                            ?.facility_status,
                                        onClick: () => {
                                            setIsIncidentReportOpen(true);
                                            setIncidentReportData(
                                                feature?.properties
                                            );
                                        },
                                    }}
                                />
                            )
                        )}

                        {terminalGeoJSON?.all?.data?.features?.map(
                            (feature) => (
                                <IncidentReportAssetMarkerWithDeferment
                                    key={feature?.id}
                                    {...{
                                        mapRef,
                                        feature,
                                        icon:
                                            {
                                                active: TerminalActivePng,
                                                inactive: TerminalInactivePng,
                                                maintenance:
                                                    TerminalMaintainancePng,
                                            }[
                                                feature?.properties?.facility_status?.toLowerCase() as string
                                            ] ?? TerminalPng,
                                        name: feature?.properties?.name,
                                        status: feature?.properties
                                            ?.facility_status,
                                        onClick: () => {
                                            setIsIncidentReportOpen(true);
                                            setIncidentReportData(
                                                feature?.properties
                                            );
                                        },
                                    }}
                                />
                            )
                        )}

                        {FPSOGeoJSON?.all?.data?.features?.map((feature) => (
                            <IncidentReportAssetMarkerWithDeferment
                                key={feature?.id}
                                {...{
                                    mapRef,
                                    feature,
                                    icon:
                                        {
                                            active: TerminalActivePng,
                                            inactive: TerminalInactivePng,
                                            maintenance:
                                                TerminalMaintainancePng,
                                        }[
                                            feature?.properties?.facility_status?.toLowerCase() as string
                                        ] ?? TerminalPng,
                                    name: feature?.properties?.name,
                                    status: feature?.properties
                                        ?.facility_status,
                                    onClick: () => {
                                        setIsIncidentReportOpen(true);
                                        setIncidentReportData(
                                            feature?.properties
                                        );
                                    },
                                }}
                            />
                        ))}

                        {FSOGeoJSON?.all?.data?.features?.map((feature) => (
                            <IncidentReportAssetMarkerWithDeferment
                                key={feature?.id}
                                {...{
                                    mapRef,
                                    feature,
                                    icon:
                                        {
                                            active: TerminalActivePng,
                                            inactive: TerminalInactivePng,
                                            maintenance:
                                                TerminalMaintainancePng,
                                        }[
                                            feature?.properties?.facility_status?.toLowerCase() as string
                                        ] ?? TerminalPng,
                                    name: feature?.properties?.name,
                                    status: feature?.properties
                                        ?.facility_status,
                                    onClick: () => {
                                        setIsIncidentReportOpen(true);
                                        setIncidentReportData(
                                            feature?.properties
                                        );
                                    },
                                }}
                            />
                        ))}

                        {/* Temporarily commented out - requires incident-report module dependencies */}
                        {/* {isIncidentReportOpen && (
                            <AddIncidentReport
                                isOpen={isIncidentReportOpen}
                                onClose={() => setIsIncidentReportOpen(false)}
                                asset={{
                                    ...incidentReportData,
                                }}
                            />
                        )} */}
                    </div>
                </>
            ) : null}
        </>
    );
}
