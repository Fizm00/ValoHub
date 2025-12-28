
export interface CrosshairConfig {
    color: string; // CSS color
    outlines: boolean;
    outlineOpacity?: number;
    outlineThickness?: number;
    centerDot: boolean;
    centerDotOpacity?: number;
    centerDotThickness?: number;
    innerLines: {
        show: boolean;
        opacity?: number;
        length: number;
        thickness: number;
        offset: number;
    };
    outerLines: {
        show: boolean;
        opacity?: number;
        length: number;
        thickness: number;
        offset: number;
    };
}

export interface ProCrosshair {
    player: string;
    team: string; // e.g. SEN, PRX, FNC
    code: string; // The copyable profile code
    config: CrosshairConfig;
}

// PRO_CROSSHAIRS has been migrated to the database (server/models/Crosshair.ts)
// Interfaces are kept for type safety in frontend components.
