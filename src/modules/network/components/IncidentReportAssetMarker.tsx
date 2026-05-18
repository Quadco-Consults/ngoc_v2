import mapboxgl from "mapbox-gl";
import {
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import useLazyRef from "../hooks/useLazyRef";
import "./IncidentReportAssetMarker.css";

const IncidentReportAssetMarker = forwardRef(function IncidentReportAssetMarker(
    {
        id,
        mapRef,
        feature,
        ...restProps
    }: {
        id: string;
        mapRef: MutableRefObject<mapboxgl.Map | null>;
        feature: any;
        className: string;
        children: React.ReactNode;
    },
    ref
) {
    const [node, setNode] = useState(null);

    const popUpRef = useLazyRef(
        () =>
            new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: "IncidentReportAssetMarker__popup",
            })
    );

    useImperativeHandle(ref, () => node, [node]);

    useEffect(() => {
        if (
            mapRef?.current &&
            popUpRef?.current &&
            node &&
            !feature?.geometry?.coordinates?.some(
                (coord: any) => coord > 90 || coord < -90
            )
        ) {
            popUpRef?.current
                .setLngLat(feature?.geometry?.coordinates)
                .setDOMContent(node)
                .addTo(mapRef.current);
        }

        const popup = popUpRef.current;

        return () => {
            popup.remove();
        };
    }, [feature?.geometry?.coordinates, mapRef, node, popUpRef]);

    // @ts-ignore
    return <div ref={setNode} {...restProps} />;
});

export default IncidentReportAssetMarker;
