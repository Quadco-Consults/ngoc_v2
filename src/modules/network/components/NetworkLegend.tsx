import { ListItem, Typography } from "@mui/material";
import { Popover } from "react-tiny-popover";
import FlowstationActivePng from "../assets/imgs/flowstation-active.png";
import FlowstationInactivePng from "../assets/imgs/flowstation-inactive.png";
import FlowstationMaintainancePng from "../assets/imgs/flowstation-maintainance.png";
import LactPointActivePng from "../assets/imgs/lactpoint-active.png";
import ManifoldActivePng from "../assets/imgs/manifold-active.png";
import TerminalActivePng from "../assets/imgs/terminal-active.png";
import TerminalInactivePng from "../assets/imgs/terminal-inactive.png";
import TerminalMaintainancePng from "../assets/imgs/terminal-maintainance.png";
import PipelineActiveSvg from "../assets/svgs/active-pipeline.svg";
import PipelineInactiveSvg from "../assets/svgs/faulty-pipeline.svg";
import PipelineMaintenanceSvg from "../assets/svgs/maintenance-pipeline.svg";
// FPSO and FSO icons (using terminal images as fallback since no specific icons exist)
import FPSOActivePng from "../assets/imgs/terminal-active.png";
import FPSOInactivePng from "../assets/imgs/terminal-inactive.png";
import FPSOMaintainancePng from "../assets/imgs/terminal-maintainance.png";
import FSOActivePng from "../assets/imgs/terminal-active.png";
import FSOInactivePng from "../assets/imgs/terminal-inactive.png";
import FSOMaintainancePng from "../assets/imgs/terminal-maintainance.png";
import usePipelineDataSource from "../hooks/usePipelineDataSource";
import { Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { MdOutlineLegendToggle } from "react-icons/md";
import NumberTypography from "./NumberTypography";
import safelyParseCoordinates from "../utils/safelyParseCoordinates";

interface IProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onItemClick: (coordinates: [number, number]) => void;
}

export default function NetworkLegend({
    isOpen,
    onOpen,
    onClose,
    onItemClick,
}: IProps) {
    return (
        <Popover
            isOpen={isOpen}
            positions={["bottom", "left"]}
            onClickOutside={onClose}
            content={<PopOverContent onItemClick={onItemClick} />}
        >
            <button
                onClick={onOpen}
                className="bg-primary-500 text-white py-1.5 px-6 rounded-lg flex items-center gap-2"
            >
                <MdOutlineLegendToggle size={24} />
                Legend
            </button>
        </Popover>
    );
}

const PopOverContent = ({
    onItemClick,
}: {
    onItemClick: (coordinates: [number, number]) => void;
}) => {
    const {
        flowStationStat,
        lactPointStat,
        manifoldStat,
        terminalStat,
        fpsoStat,
        fsoStat,
        pipelineStats,
        totalDeferment,
    } = usePipelineDataSource();

    const legendData = useMemo(() => {
        return [
            {
                icon: FlowstationActivePng,
                label: "Flow Stations",
                value: flowStationStat?.active,
            },

            {
                icon: FlowstationInactivePng,
                label: "Faulty Flow Stations",
                value: flowStationStat?.inactive?.length,
                data: flowStationStat?.inactive,
            },

            {
                icon: FlowstationMaintainancePng,
                label: "Maintenance Flow Stations",
                value: flowStationStat?.maintenance?.length,
                data: flowStationStat?.maintenance,
            },

            {
                icon: LactPointActivePng,
                label: "Lact Points",
                value: lactPointStat?.all,
            },

            {
                icon: ManifoldActivePng,
                label: "Manifolds",
                value: manifoldStat?.all,
            },

            {
                icon: TerminalActivePng,
                label: "Terminals",
                value: terminalStat?.active,
            },

            {
                icon: TerminalInactivePng,
                label: "Faulty Terminals",
                value: terminalStat?.inactive?.length,
                data: terminalStat?.inactive,
            },

            {
                icon: TerminalMaintainancePng,
                label: "Maintenance Terminals",
                value: terminalStat?.maintenance?.length,
                data: terminalStat?.maintenance,
            },

            {
                icon: FPSOActivePng,
                label: "FPSO",
                value: fpsoStat?.active,
            },

            {
                icon: FPSOInactivePng,
                label: "Faulty FPSO",
                value: fpsoStat?.inactive?.length,
                data: fpsoStat?.inactive,
            },

            {
                icon: FPSOMaintainancePng,
                label: "Maintenance FPSO",
                value: fpsoStat?.maintenance?.length,
                data: fpsoStat?.maintenance,
            },

            {
                icon: FSOActivePng,
                label: "FSO",
                value: fsoStat?.active,
            },

            {
                icon: FSOInactivePng,
                label: "Faulty FSO",
                value: fsoStat?.inactive?.length,
                data: fsoStat?.inactive,
            },

            {
                icon: FSOMaintainancePng,
                label: "Maintenance FSO",
                value: fsoStat?.maintenance?.length,
                data: fsoStat?.maintenance,
            },

            {
                icon: PipelineActiveSvg,
                label: "Pipelines",
                value: pipelineStats?.active,
            },

            {
                icon: PipelineInactiveSvg,
                label: "Faulty Pipelines",
                value: pipelineStats?.inactive?.length,
                data: pipelineStats?.inactive,
            },

            {
                icon: PipelineMaintenanceSvg,
                label: "Maintenance Pipelines",
                value: pipelineStats?.maintenance?.length,
                data: pipelineStats?.maintenance,
            },
        ];
    }, [
        flowStationStat,
        lactPointStat,
        manifoldStat,
        terminalStat,
        fpsoStat,
        fsoStat,
        pipelineStats,
    ]);

    const handleItemClick = (props: any) => {
        try {
            if (props.lng_summary && props.lat_summary) {
                const lng = Number(props.lng_summary);
                const lat = Number(props.lat_summary);

                if (!isNaN(lng) && !isNaN(lat)) {
                    onItemClick([lng, lat]);
                }
            }

            if (props.summary_coordinates) {
                const coordinates =
                    typeof props.summary_coordinates === "string"
                        ? safelyParseCoordinates(props.summary_coordinates)
                        : props.summary_coordinates?.coordinates;

                if (
                    coordinates &&
                    Array.isArray(coordinates) &&
                    coordinates.length > 0
                ) {
                    onItemClick(coordinates[0]);
                }
            }
        } catch (error) {
            console.error("Error handling item click:", error);
        }
    };

    return (
        <div className="bg-white h-[550px] w-[320px] absolute right-0 shadow-xl border-gray-300 border-[1px] overflow-y-scroll rounded-lg">
            <ListItem divider>
                <Typography variant="h6" className="font-bold text-primary-500">
                    Map Summary
                </Typography>
            </ListItem>

            {legendData?.map(({ icon, label, value, data }) => (
                <Fragment key={label || "unknown"}>
                    <ListItem divider className="flex justify-between gap-2">
                        <img src={icon} alt={label} width={20} height={20} />

                        <Typography
                            variant="body2"
                            className="flex-1 text-primary-500"
                        >
                            {label}
                        </Typography>

                        <div className="flex items-start justify-center rounded-full w-5 h-5 bg-primary-500 text-white">
                            <Typography variant="caption">
                                {value || 0}
                            </Typography>
                        </div>
                    </ListItem>

                    {(() => {
                        if (!data?.length) return null;

                        // @ts-ignore
                        const isPipeline = data[0]?.pipeline_type;

                        return (
                            <div className="bg-gray-50">
                                <ListItem
                                    divider
                                    className="flex items-start justify-between gap-4 text-text-secondary"
                                >
                                    <Typography
                                        variant="caption"
                                        className="flex-1 uppercase"
                                    >
                                        Offline {label}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        className={
                                            isPipeline && "flex-1 text-center"
                                        }
                                    >
                                        Deferment
                                        <br />
                                        (KBOPD)
                                    </Typography>

                                    {isPipeline && (
                                        <Typography
                                            variant="caption"
                                            className={
                                                isPipeline &&
                                                "flex-1 text-center"
                                            }
                                        >
                                            Type
                                        </Typography>
                                    )}
                                </ListItem>

                                {data.map(
                                    ({
                                        id,
                                        name,
                                        // @ts-ignore
                                        downtime_deferment,
                                        // @ts-ignore
                                        downtime_deferement,
                                        // @ts-ignore
                                        pipeline_type,
                                        ...restProps
                                    }) => {
                                        if (!id || !name) return null;
                                        return (
                                            <ListItem
                                                key={id}
                                                component="div"
                                                divider
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() =>
                                                    handleItemClick({
                                                        ...restProps,
                                                    })
                                                }
                                            >
                                                <Typography
                                                    variant="body2"
                                                    className="flex-1"
                                                >
                                                    {name}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    className={
                                                        isPipeline &&
                                                        "flex-1 text-center"
                                                    }
                                                >
                                                    {downtime_deferment ||
                                                        downtime_deferement ||
                                                        0}
                                                </Typography>

                                                {isPipeline && (
                                                    <Typography
                                                        variant="body2"
                                                        className={
                                                            isPipeline &&
                                                            "flex-1 text-center"
                                                        }
                                                    >
                                                        {pipeline_type}
                                                    </Typography>
                                                )}
                                            </ListItem>
                                        );
                                    }
                                )}
                            </div>
                        );
                    })()}
                </Fragment>
            ))}

            <ListItem divider className="flex gap-2">
                <Typography variant="body2" className="flex-1 font-bold">
                    Total Deferment
                </Typography>
                <NumberTypography variant="body2" className="font-bold">
                    {totalDeferment || 0}
                </NumberTypography>
            </ListItem>
        </div>
    );
};
