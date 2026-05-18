export default function safelyParseCoordinates(
    summary_coordinates: string | null
) {
    if (!summary_coordinates) return null;

    try {
        const parsed = JSON.parse(summary_coordinates);
        return parsed?.coordinates && Array.isArray(parsed.coordinates)
            ? parsed.coordinates
            : null;
    } catch {
        return null;
    }
}

export function safelyParsePointCoordinates(summary_outlet: string | null) {
    if (!summary_outlet) return null;

    try {
        const parsed = JSON.parse(summary_outlet);
        const coords = parsed?.coordinates?.map(Number);
        return Array.isArray(coords) && coords.length === 2 ? coords : null;
    } catch {
        return null;
    }
}
