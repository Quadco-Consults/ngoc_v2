import flowStationIcon from "../assets/imgs/flowstation.png";
import lactPointIcon from "../assets/imgs/lactpoint.png";
import manifoldIcon from "../assets/imgs/manifold.png";
import terminalIcon from "../assets/imgs/terminal.png";
import pipelineIcon from "../assets/svgs/active-pipeline.svg";
import { OPERATOR_ROUTES } from "../../../routes/operators";

export const assetTypeConfig = [
    {
        name: "Terminal",
        icon: terminalIcon,
        detailsRoute: OPERATOR_ROUTES.TERMINAL_DETAILS,
    },

    {
        name: "FPSO",
        icon: terminalIcon,
        detailsRoute: OPERATOR_ROUTES.FPSO_DETAILS,
    },

    {
        name: "FSO",
        icon: terminalIcon,
        detailsRoute: OPERATOR_ROUTES.FSO_DETAILS,
    },

    {
        name: "Manifold",
        icon: manifoldIcon,
        detailsRoute: OPERATOR_ROUTES.MANIFOLD_DETAILS,
    },

    {
        name: "Flow_Station",
        icon: flowStationIcon,
        detailsRoute: OPERATOR_ROUTES.FLOW_STATION_DETAILS,
    },

    {
        name: "LactPoint",
        icon: lactPointIcon,
        detailsRoute: OPERATOR_ROUTES.LACTPOINT_DETAILS,
    },

    {
        name: "Pipeline",
        icon: pipelineIcon,
        detailsRoute: OPERATOR_ROUTES.PIPELINE_DETAILS,
    },
];
