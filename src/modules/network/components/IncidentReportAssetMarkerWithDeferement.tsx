import { MutableRefObject } from "react";
import IncidentReportAssetMarker from "./IncidentReportAssetMarker";
import clsx from "clsx";
import { Divider, Typography } from "@mui/material";
import { Feature } from "geojson";
import { useGetSingleFlowStationQuery } from "../../flowstation/services/flowstation";
import { skipToken } from "@reduxjs/toolkit/query";
import NumberTypography from "./NumberTypography";
import { useGetSingleTerminalQuery } from "../../terminals/services/terminal";

export default function IncidentReportAssetMarkerWithDeferment({
    icon,
    feature,
    mapRef,
    name,
    status,
    ...restProps
}: {
    icon: string;
    feature: Feature;
    mapRef: MutableRefObject<mapboxgl.Map | null>;
    name: string;
    status: string;
    onClick?: () => void;
}) {
    const assetType = feature?.properties?.tag;
    const id = feature?.properties?.id;

    const { data: flowStation } = useGetSingleFlowStationQuery(
        assetType === "flow_station" ? id : skipToken
    );

    const { data: terminal } = useGetSingleTerminalQuery(
        assetType === "terminal" ? id : skipToken
    );

    const deferment =
        flowStation?.data?.downtime_deferment ||
        terminal?.data?.downtime_deferment ||
        0; // Provide default value

    return (
        <IncidentReportAssetMarker
            id={feature?.id as string}
            feature={feature}
            mapRef={mapRef}
            className={clsx(
                "cursor-pointer flex items-stretch border border-solid",
                {
                    active: "border-[#99C97B]",
                    inactive: "border-[#FB0006]",
                    maintenance: "border-[#F5D253]",
                }[status] ?? "border-[#99C97B]"
            )}
            {...restProps}
        >
            <div className="min-w-20 p-1 px-2 text-center flex items-center justify-center gap-2">
                <img src={icon} alt={icon} width={12} height={12} />
                <Typography variant="body2" className="font-bold">
                    {name}
                </Typography>
            </div>

            {status !== "active" && (
                <div
                    className={clsx(
                        "border-l",
                        {
                            ACTIVE: "border-[#99C97B]",
                            INACTIVE: "border-[#FB0006]",
                            MAINTENANCE: "border-[#F5D253]",
                        }[status] ?? "border-[#99C97B]"
                    )}
                >
                    <Typography
                        variant="caption"
                        className={clsx(
                            "text-center px-1 block",
                            {
                                ACTIVE: "bg-[#99C97B]",
                                INACTIVE: "bg-[#FB0006] text-white",
                                MAINTENANCE: "bg-[#F5D253]",
                            }[status] ?? "bg-[#99C97B]"
                        )}
                    >
                        Deferment (KBOPD)
                    </Typography>
                    <Divider />

                    <NumberTypography
                        variant="body2"
                        className="text-right px-1"
                    >
                        {deferment ?? 0}
                    </NumberTypography>
                </div>
            )}
        </IncidentReportAssetMarker>
    );
}
