import { Button, Chip, Typography } from "@mui/material";
import { generatePath } from "react-router-dom";
import { assetTypeConfig } from "../config/asset-config";
import useAssetInfo from "../hooks/useAssetInfo";

const assetStatusConfig = [
    {
        name: "Maintenance",
        color: "warning",
    },

    {
        name: "Active",
        color: "success",
    },

    {
        name: "Inactive",
        color: "error",
    },
];

export default function NetworkPopUp({
    asset,
}: {
    asset: {
        id: string;
        name: string;
        title: string;
        facility_status: string;
        tag: string;
        updated_datetime: string;
        pipeline_type: string;
    };
}) {
    const assetStatus = assetStatusConfig.find(
        (config) => config.name.toLowerCase() === asset?.facility_status
    );

    const assetConfig = assetTypeConfig.find(
        (config) => config.name.toLowerCase() === asset.tag
    );

    const assetInfo = useAssetInfo({
        type: assetConfig?.name || "",
        id: asset?.id,
        lastUpdated: asset?.updated_datetime,
        altLabel: asset?.pipeline_type,
    });
    const detailsHref =
        assetConfig?.detailsRoute && asset?.id
            ? generatePath(assetConfig.detailsRoute, { id: asset.id })
            : undefined;

    return (
        <div className="bg-white space-y-6 w-96 max-w-96 p-4 rounded-md">
            <div className="flex items-center gap-2">
                <img
                    src={assetConfig?.icon}
                    alt={asset?.name}
                    width={30}
                    height={30}
                />

                <Typography className="flex-1 font-bold ml-1 text-primary-500">
                    {asset?.name}
                </Typography>

                {assetStatus && (
                    <Chip
                        size="small"
                        label={assetStatus?.name}
                        color={assetStatus?.color as any}
                    />
                )}
            </div>

            <div className="space-y-3">
                {assetInfo?.map(({ label, value }) => {
                    return (
                        <div key={label} className="grid grid-cols-2 gap-4">
                            <Typography
                                variant="body2"
                                className="font-bold text-primary-500 text-sm"
                            >
                                {label}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="whitespace-pre-wrap text-sm"
                            >
                                {value?.replace("_", " ") ?? "-"}
                            </Typography>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between gap-1">
                {detailsHref ? (
                    <Button
                        variant="outlined"
                        href={detailsHref}
                        target="_blank"
                        className="text-primary-500"
                        style={{ color: "#00AD51", borderColor: "#00AD51" }}
                    >
                        Details
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        disabled
                        className="text-primary-500"
                        style={{ color: "#00AD51", borderColor: "#00AD51" }}
                    >
                        Details
                    </Button>
                )}

                {/* {asset?.__typename === "StationType" && (
                    <Button
                        variant="contained"
                        href={`${config?.pipelineUrl}&id=${asset?.id}`}
                        target="_blank"
                    >
                        Map View
                    </Button>
                )} */}
            </div>
        </div>
    );
}
