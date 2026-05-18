import { useState, useCallback } from "react";

export default function usePopover() {
    const [anchorEl, setAnchorEl] = useState(null);

    const togglePopover = useCallback((e: any) => {
        setAnchorEl((p) => (p ? null : e?.currentTarget));
    }, []);

    return {
        anchorEl,
        isOpen: Boolean(anchorEl),
        setAnchorEl,
        togglePopover,
    };
}
