import type { Feature, FeatureCollection, Point } from "geojson";
import type { IFlowStationPipelineNetwork } from "../../flowstation/types/flowstation";
import type { ILactPointPipelineNetwork } from "../../lactpoint/types";
import type { IManifoldPipelineNetwork } from "../../manifold/types";
import type { ITerminalPipelineNetwork } from "../../terminals/types/terminal";
import type { IFPSOPipelineNetwork } from "../../fpso/types";
import type { IFSOPaginatedData } from "../../fso/types/fso";
import type { IPipelinePaginatedData } from "../../pipeline/types";
import isValidLngLat from "./checkValidCoordinates";
import safelyParseCoordinates, {
    safelyParsePointCoordinates,
} from "./safelyParseCoordinates";

export const convertFlowStationToGeoJSON = (
    flowStations: IFlowStationPipelineNetwork[]
): {
    type: "geojson";
    data: FeatureCollection<Point, any>;
} => {
    const features: Feature<Point, any>[] = flowStations
        ?.filter(
            ({ lng_summary, lat_summary }) =>
                lng_summary &&
                lat_summary &&
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        )
        .map(
            ({
                id,
                name,
                lng_summary,
                lat_summary,
                facility_status,
                // @ts-ignore
                updated_datetime,
            }) => ({
                type: "Feature",
                id,
                geometry: {
                    type: "Point",
                    coordinates: [
                        parseFloat(lng_summary),
                        parseFloat(lat_summary),
                    ],
                },
                properties: {
                    id,
                    name,
                    lng_summary,
                    lat_summary,
                    facility_status,
                    updated_datetime,
                    tag: "flow_station",
                },
            })
        );

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
};

export const convertLactPointToGeoJSON = (
    lactpoints: ILactPointPipelineNetwork[]
) => {
    const features = lactpoints
        ?.map(({ id, name, summary_outlet, updated_datetime }) => {
            const coordinates = safelyParsePointCoordinates(summary_outlet);

            if (coordinates && isValidLngLat(coordinates)) {
                return {
                    type: "Feature",
                    id,
                    geometry: {
                        type: "Point",
                        coordinates,
                    },
                    properties: {
                        id,
                        name,
                        summary_outlet,
                        updated_datetime,
                        tag: "lactpoint",
                    },
                };
            }

            return null;
        })
        .filter((feature) => feature !== null);

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
};

export const convertManifoldToGeoJSON = (
    manifolds: IManifoldPipelineNetwork[]
) => {
    const features = manifolds
        ?.filter(
            ({ lng_summary, lat_summary }) =>
                lng_summary &&
                lat_summary &&
                isValidLngLat([lng_summary, lat_summary])
        )
        ?.map(({ id, name, lng_summary, lat_summary, updated_datetime }) => ({
            type: "Feature",
            id,
            geometry: {
                type: "Point",
                coordinates: [lng_summary, lat_summary],
            },
            properties: {
                id,
                name,
                lng_summary,
                lat_summary,
                updated_datetime,
                tag: "manifold",
            },
        }));

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
};

export function convertTerminalToGeoJSON({
    status,
    terminals,
}: {
    status?: string;
    terminals: ITerminalPipelineNetwork[];
}): {
    type: "geojson";
    data: FeatureCollection<Point, any>;
} {
    const features: Feature<Point, any>[] = terminals
        .filter(
            ({ facility_status, lng_summary, lat_summary }) =>
                (status ? facility_status === status : true) &&
                lng_summary &&
                lat_summary &&
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        )
        .map(({ id, lng_summary, lat_summary, ...rest }) => ({
            type: "Feature",
            id: id,
            geometry: {
                type: "Point",
                coordinates: [parseFloat(lng_summary), parseFloat(lat_summary)],
            },
            properties: {
                id,
                lng_summary,
                lat_summary,
                ...rest,
                tag: "terminal",
            },
        }));

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
}

export function convertFPSOToGeoJSON({
    status,
    fpsos,
}: {
    status?: string;
    fpsos: IFPSOPipelineNetwork[];
}): {
    type: "geojson";
    data: FeatureCollection<Point, any>;
} {
    const features: Feature<Point, any>[] = fpsos
        ?.filter(
            ({ facility_status, lng_summary, lat_summary }) =>
                (status ? facility_status === status : true) &&
                lng_summary &&
                lat_summary &&
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        )
        .map(({ facility_status, ...rest }) => ({
            type: "Feature",
            id: rest.id,
            geometry: {
                type: "Point",
                coordinates: [
                    parseFloat(rest?.lng_summary),
                    parseFloat(rest?.lat_summary),
                ],
            },
            properties: {
                ...rest,
                facility_status: facility_status.toLowerCase(),
                tag: "fpso",
            },
        }));

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
}

export function convertFSOToGeoJSON({
    status,
    fsos,
}: {
    status?: string;
    fsos: IFSOPaginatedData[];
}): {
    type: "geojson";
    data: FeatureCollection<Point, any>;
} {
    const features: Feature<Point, any>[] = fsos
        ?.filter(
            ({ facility_status, lng_summary, lat_summary }) =>
                (status ? facility_status === status : true) &&
                lng_summary &&
                lat_summary &&
                isValidLngLat([
                    parseFloat(lng_summary),
                    parseFloat(lat_summary),
                ])
        )
        .map((fso) => ({
            type: "Feature",
            id: fso.id,
            geometry: {
                type: "Point",
                coordinates: [
                    parseFloat(fso?.lng_summary),
                    parseFloat(fso?.lat_summary),
                ],
            },
            properties: {
                ...fso,
                tag: "fso",
            },
        }));

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
}

export const convertPiplelineToGeoJSON = ({
    type,
    pipelines,
}: {
    type?: string;
    pipelines: IPipelinePaginatedData[];
}) => {
    const features = pipelines
        ?.map(
            ({
                id,
                name,
                summary_coordinates,
                pipeline_type,
                status,
                updated_datetime,
                network,
            }: IPipelinePaginatedData) => {
                const coordinates =
                    typeof summary_coordinates === "string"
                        ? safelyParseCoordinates(summary_coordinates)
                        : // @ts-ignore
                          summary_coordinates?.coordinates;

                if (
                    (!type || pipeline_type === type) &&
                    coordinates &&
                    isValidLngLat(coordinates)
                ) {
                    return {
                        type: "Feature",
                        id,
                        geometry: {
                            type: "LineString",
                            coordinates,
                        },
                        properties: {
                            id,
                            name,
                            summary_coordinates,
                            pipeline_type,
                            status,
                            updated_datetime,
                            network,
                            tag: "pipeline",
                        },
                    };
                }

                return null;
            }
        )
        .filter((feature) => feature !== null);

    return {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features,
        },
    };
};
