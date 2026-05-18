import FlowstationPng from "../assets/imgs/flowstation.png";
import FlowstationActivePng from "../assets/imgs/flowstation-active.png";
import FlowstationInactivePng from "../assets/imgs/flowstation-inactive.png";
import FlowstationMaintainancePng from "../assets/imgs/flowstation-maintainance.png";

import TerminalPng from "../assets/imgs/terminal.png";
import TerminalActivePng from "../assets/imgs/terminal-active.png";
import TerminalInactivePng from "../assets/imgs/terminal-inactive.png";
import TerminalMaintainancePng from "../assets/imgs/terminal-maintainance.png";

import LactPointPng from "../assets/imgs/lactpoint.png";
import LactPointActivePng from "../assets/imgs/lactpoint-active.png";
import LactPointInactivePng from "../assets/imgs/lactpoint-inactive.png";
import LactPointMaintainancePng from "../assets/imgs/lactpoint-maintainance.png";

import ManifoldPng from "../assets/imgs/manifold.png";
import ManifoldActivePng from "../assets/imgs/manifold-active.png";
import ManifoldInactivePng from "../assets/imgs/manifold-inactive.png";
import ManifoldMaintainancePng from "../assets/imgs/manifold-maintainance.png";

export const IMAGES = [
    {
        label: "np-flowstation",
        width: 60,
        height: 60,
        url: FlowstationPng,
    },
    {
        label: "np-lactpoint",
        width: 25,
        height: 25,
        url: LactPointPng,
    },
    {
        label: "np-manifold",
        width: 25,
        height: 25,
        url: ManifoldPng,
    },
    {
        label: "np-terminal",
        width: 60,
        height: 60,
        url: TerminalPng,
    },
    {
        label: "np-flowstation-active",
        width: 60,
        height: 60,
        url: FlowstationActivePng,
    },
    {
        label: "np-lactpoint-active",
        width: 25,
        height: 25,
        url: LactPointActivePng,
    },
    {
        label: "np-manifold-active",
        width: 25,
        height: 25,
        url: ManifoldActivePng,
    },
    {
        label: "np-terminal-active",
        width: 60,
        height: 60,
        url: TerminalActivePng,
    },
    {
        label: "np-flowstation-inactive",
        width: 60,
        height: 60,
        url: FlowstationInactivePng,
    },
    {
        label: "np-lactpoint-inactive",
        width: 25,
        height: 25,
        url: LactPointInactivePng,
    },
    {
        label: "np-manifold-inactive",
        width: 25,
        height: 25,
        url: ManifoldInactivePng,
    },
    {
        label: "np-terminal-inactive",
        width: 60,
        height: 60,
        url: TerminalInactivePng,
    },
    {
        label: "np-flowstation-maintainance",
        width: 60,
        height: 60,
        url: FlowstationMaintainancePng,
    },
    {
        label: "np-lactpoint-maintainance",
        width: 25,
        height: 25,
        url: LactPointMaintainancePng,
    },
    {
        label: "np-manifold-maintainance",
        width: 25,
        height: 25,
        url: ManifoldMaintainancePng,
    },
    {
        label: "np-terminal-maintainance",
        width: 60,
        height: 60,
        url: TerminalMaintainancePng,
    },
    // FPSO icons (using terminal images as fallback since no specific FPSO icons exist)
    {
        label: "np-fpso",
        width: 60,
        height: 60,
        url: TerminalPng,
    },
    {
        label: "np-fpso-active",
        width: 60,
        height: 60,
        url: TerminalActivePng,
    },
    {
        label: "np-fpso-inactive",
        width: 60,
        height: 60,
        url: TerminalInactivePng,
    },
    {
        label: "np-fpso-maintainance",
        width: 60,
        height: 60,
        url: TerminalMaintainancePng,
    },
    // FSO icons (using terminal images as fallback since no specific FSO icons exist)
    {
        label: "np-fso",
        width: 60,
        height: 60,
        url: TerminalPng,
    },
    {
        label: "np-fso-active",
        width: 60,
        height: 60,
        url: TerminalActivePng,
    },
    {
        label: "np-fso-inactive",
        width: 60,
        height: 60,
        url: TerminalInactivePng,
    },
    {
        label: "np-fso-maintainance",
        width: 60,
        height: 60,
        url: TerminalMaintainancePng,
    },
];
