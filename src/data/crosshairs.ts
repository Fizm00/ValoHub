
export interface CrosshairConfig {
    color: string;
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
    _id: string;
    id?: string;
    player: string;
    team: string;
    code: string;
    config: CrosshairConfig;
}
