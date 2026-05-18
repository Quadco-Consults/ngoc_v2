import { useMemo } from "react";
import { FeatureCollection, Point } from "geojson";
import {
    convertFlowStationToGeoJSON,
    convertFPSOToGeoJSON,
    convertFSOToGeoJSON,
    convertLactPointToGeoJSON,
    convertManifoldToGeoJSON,
    convertPiplelineToGeoJSON,
    convertTerminalToGeoJSON,
} from "../utils/convertToGeoJSON";
import { useGetAllPipelineFlowStationsQuery } from "../../flowstation/services/flowstation";
import { useGetAllLactPointPipelineNetworkQuery } from "../../lactpoint/services/lactpoint";
import { useGetAllManifoldPipelineNetworkQuery } from "../../manifold/services";
import { useGetAllTerminalPipelineNetworkQuery } from "../../terminals/services/terminal";
import { useGetAllPipelinePipelineNetworkQuery } from "../../pipeline/services";
import { useGetAllFPSOPipelineNetworkQuery } from "../../fpso/services/fpso";
import { useGetAllFSOPipelineNetworkQuery } from "../../fso/services/fso";
import isValidLngLat from "../utils/checkValidCoordinates";
import safelyParseCoordinates, {
    safelyParsePointCoordinates,
} from "../utils/safelyParseCoordinates";

export default function usePipelineDataSource() {
    const { data: flowStation } = useGetAllPipelineFlowStationsQuery({
        page: 1,
        size: 2000000,
    });

    const { data: lactpoint } = useGetAllLactPointPipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const { data: manifold } = useGetAllManifoldPipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const { data: terminal } = useGetAllTerminalPipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const { data: fpso } = useGetAllFPSOPipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const { data: fso } = useGetAllFSOPipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const { data: pipeline } = useGetAllPipelinePipelineNetworkQuery({
        page: 1,
        size: 2000000,
    });

    const flowStationGeoJSON: {
        all: { type: "geojson"; data: FeatureCollection<Point, any> };
    } | null = useMemo(() => {
        const flowStations = flowStation?.data;

        if (!flowStations) return null;

        return {
            all: convertFlowStationToGeoJSON(flowStations),
        };
    }, [flowStation]);

    const lactPointGeoJSON = useMemo(() => {
        const lactpoints = lactpoint?.data;

        if (!lactpoints) return [];

        return {
            all: convertLactPointToGeoJSON(lactpoints),
        };
    }, [lactpoint]);

    const manifoldGeoJSON = useMemo(() => {
        const manifolds = manifold?.data;

        if (!manifolds) return [];

        return {
            all: convertManifoldToGeoJSON(manifolds),
        };
    }, [manifold]);

    const terminalGeoJSON: {
        all: { type: "geojson"; data: FeatureCollection<Point, any> };
    } | null = useMemo(() => {
        const terminals = terminal?.data;

        if (!terminals) return null;

        return {
            all: convertTerminalToGeoJSON({
                terminals,
            }),
        };
    }, [terminal]);

    const FPSOGeoJSON: {
        all: { type: "geojson"; data: FeatureCollection<Point, any> };
    } | null = useMemo(() => {
        const fpsos = fpso?.data;

        if (!fpsos) return null;

        return {
            all: convertFPSOToGeoJSON({
                fpsos,
            }),
        };
    }, [fpso]);

    const FSOGeoJSON: {
        all: { type: "geojson"; data: FeatureCollection<Point, any> };
    } | null = useMemo(() => {
        const fsos = fso?.data;

        if (!fsos) return null;

        return {
            all: convertFSOToGeoJSON({
                fsos,
            }),
        };
    }, [fso]);

    const pipelineGeoJSON = useMemo(() => {
        const pipelines = pipeline?.data;

        if (!pipelines) return [];

        const validPipelines = pipelines.filter((pipeline) => {
            const coordinates =
                typeof pipeline.summary_coordinates === "string"
                    ? safelyParseCoordinates(pipeline.summary_coordinates)
                    : // @ts-ignore
                      pipeline.summary_coordinates?.coordinates;

            return (
                Array.isArray(coordinates) &&
                coordinates.every(
                    (coord: number[]) =>
                        Array.isArray(coord) &&
                        coord.length === 2 &&
                        isValidLngLat([coord[0], coord[1]])
                )
            );
        });

        console.log({ pipelines: validPipelines.length });

        return {
            all: convertPiplelineToGeoJSON({ pipelines: validPipelines }),
            delivery_line: convertPiplelineToGeoJSON({
                type: "Delivery Line",
                pipelines: validPipelines,
            }),
            trunk_line: convertPiplelineToGeoJSON({
                type: "Trunk Line",
                pipelines: validPipelines,
            }),
            export_line: convertPiplelineToGeoJSON({
                type: "Export Line",
                pipelines: validPipelines,
            }),
            flow_line: convertPiplelineToGeoJSON({
                type: "Flow Line",
                pipelines: validPipelines,
            }),
            others: convertPiplelineToGeoJSON({
                type: "Others",
                pipelines: validPipelines,
            }),
        };
    }, [pipeline]);

    const flowStationStat = useMemo(() => {
        if (!flowStation) return null;

        const flowStations = flowStation?.data || [];

        const validStations = flowStations.filter(
            ({ lng_summary, lat_summary }) =>
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        );

        const inactive = validStations.filter(
            ({ facility_status }) => facility_status === "inactive"
        );

        const maintenance = validStations.filter(
            ({ facility_status }) => facility_status === "maintenance"
        );

        return {
            all: validStations.length,
            active: validStations.filter(
                ({ facility_status }) => facility_status === "active"
            ).length,
            inactive,
            maintenance,
        };
    }, [flowStation]);

    const lactPointStat = useMemo(() => {
        if (!lactpoint) return null;

        const lactPoints = lactpoint?.data;

        const validLactPoints = lactPoints?.filter(({ summary_outlet }) => {
            const coordinates = safelyParsePointCoordinates(summary_outlet);

            return isValidLngLat(coordinates as any);
        });

        return {
            all: validLactPoints?.length,
        };
    }, [lactpoint]);

    const manifoldStat = useMemo(() => {
        if (!manifold) return null;

        const manifolds = manifold?.data;

        const validManifolds = manifolds.filter(
            ({ lng_summary, lat_summary }) =>
                isValidLngLat([lng_summary, lat_summary])
        );

        return {
            all: validManifolds?.length,
        };
    }, [manifold]);

    const terminalStat = useMemo(() => {
        if (!terminal) return null;

        const terminals = terminal?.data ?? [];

        const validTerminals = terminals.filter(
            ({ lng_summary, lat_summary }) =>
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        );

        const inactive = validTerminals.filter(
            ({ facility_status }) => facility_status === "inactive"
        );

        const maintenance = validTerminals.filter(
            ({ facility_status }) => facility_status === "maintenance"
        );

        return {
            all: validTerminals.length,
            active: validTerminals.filter(
                ({ facility_status }) => facility_status === "active"
            ).length,
            inactive,
            maintenance,
        };
    }, [terminal]);

    const fpsoStat = useMemo(() => {
        if (!fpso) return null;

        const fpsos = fpso?.data || [];

        const validFPSOs = fpsos?.filter(({ lng_summary, lat_summary }) =>
            isValidLngLat([parseFloat(lng_summary), parseFloat(lat_summary)])
        );

        const inactive = validFPSOs.filter(
            ({ facility_status }) => facility_status === "inactive"
        );

        const maintenance = validFPSOs.filter(
            ({ facility_status }) => facility_status === "maintenance"
        );

        return {
            all: validFPSOs.length,
            active: validFPSOs.filter(
                ({ facility_status }) => facility_status === "active"
            ).length,
            inactive,
            maintenance,
        };
    }, [fpso]);

    const fsoStat = useMemo(() => {
        if (!fso) return null;

        const fsos = fso?.data || [];

        const validFSOs = fsos.filter(({ lng_summary, lat_summary }) =>
            isValidLngLat([parseFloat(lng_summary), parseFloat(lat_summary)])
        );

        const inactive = validFSOs.filter(
            ({ facility_status }) => facility_status === "inactive"
        );

        const maintenance = validFSOs.filter(
            ({ facility_status }) => facility_status === "maintenance"
        );

        return {
            all: validFSOs.length,
            active: validFSOs.filter(
                ({ facility_status }) => facility_status === "active"
            ).length,
            inactive,
            maintenance,
        };
    }, [fso]);

    const pipelineStats = useMemo(() => {
        if (!pipeline) return null;

        const pipelines = pipeline?.data;

        const validPipelines = pipelines.filter((pipeline) => {
            const coordinates =
                typeof pipeline.summary_coordinates === "string"
                    ? safelyParseCoordinates(pipeline.summary_coordinates)
                    : // @ts-ignore
                      pipeline.summary_coordinates?.coordinates;

            return (
                Array.isArray(coordinates) &&
                coordinates.every(
                    (coord: number[]) =>
                        Array.isArray(coord) &&
                        coord.length === 2 &&
                        isValidLngLat([coord[0], coord[1]])
                )
            );
        });

        return {
            active: validPipelines?.filter(({ status }) => status === "active")
                ?.length,
            inactive: validPipelines?.filter(
                ({ status }) => status === "inactive"
            ),
            maintenance: validPipelines?.filter(
                ({ status }) => status === "maintenance"
            ),
        };
    }, [pipeline]);

    const totalDeferment = useMemo(() => {
        if (
            !flowStation?.data ||
            !terminal?.data ||
            !fpso?.data ||
            !fso?.data ||
            !pipeline?.data
        )
            return 0;

        const flowStationDefermentVolume = flowStation.data.reduce(
            // @ts-ignore
            (acc, item) => acc + (item?.downtime_deferment ?? 0),
            0
        );

        const terminalDefermentVolume = terminal.data.reduce(
            // @ts-ignore
            (acc, item) => acc + (item?.downtime_deferment ?? 0),
            0
        );

        const fpsoDefermentVolume = fpso?.data.reduce(
            // @ts-ignore
            (acc, item) => acc + (item?.downtime_deferment ?? 0),
            0
        );

        const fsoDefermentVolume = fso?.data.reduce(
            (acc, item) => acc + (item?.downtime_deferment ?? 0),
            0
        );

        const pipelineDefermentVolume = pipeline?.data.reduce(
            (acc, item) => acc + (item?.downtime_deferement ?? 0),
            0
        );
        return (
            flowStationDefermentVolume +
            terminalDefermentVolume +
            fpsoDefermentVolume +
            fsoDefermentVolume +
            pipelineDefermentVolume
        );
    }, [flowStation, terminal, fpso, fso, pipeline]);

    return {
        flowStationGeoJSON,
        lactPointGeoJSON,
        manifoldGeoJSON,
        terminalGeoJSON,
        FPSOGeoJSON,
        FSOGeoJSON,
        pipelineGeoJSON,
        flowStationStat,
        lactPointStat,
        manifoldStat,
        terminalStat,
        fpsoStat,
        fsoStat,
        pipelineStats,
        totalDeferment,
    };
}
