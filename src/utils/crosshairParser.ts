import type { CrosshairConfig } from '../data/crosshairs';

// Color Map for 'c' parameter
const COLOR_MAP: Record<string, string> = {
    '0': '#ffffff', // White
    '1': '#00ff00', // Green
    '2': '#7fff00', // Yellow Green
    '3': '#dfff00', // Green Yellow
    '4': '#ffff00', // Yellow
    '5': '#00ffff', // Cyan
    '6': '#ff00ff', // Pink
    '7': '#ff0000', // Red
};

export const parseCrosshairCode = (code: string): CrosshairConfig => {
    // Default Config
    const config: CrosshairConfig = {
        color: '#ffffff',
        outlines: false,
        outlineOpacity: 0.5,
        outlineThickness: 1,
        centerDot: false,
        centerDotOpacity: 1,
        centerDotThickness: 2,
        innerLines: { show: true, opacity: 0.8, length: 6, thickness: 2, offset: 3 },
        outerLines: { show: true, opacity: 0.35, length: 2, thickness: 2, offset: 10 }
    };

    if (!code) return config;

    // Split by semicolon
    const parts = code.split(';');

    for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        const val = parts[i + 1]; // Lookahead for value if needed, though some keys are boolean flags

        // --- GENERAL ---
        // c;X -> Color Index
        if (key === 'c') {
            config.color = COLOR_MAP[val] || '#ffffff';
        }
        // u;RRGGBB -> Custom Color
        if (key === 'u') {
            // Valorant uses RRGGBBFF usually, or just RRGGBB.
            // If length is 8, strip last 2 alpha chars for CSS hex color if needed, or just use it.
            // CSS handles 8-digit hex (RRGGBBAA), but Valorant might put alpha at end.
            // Let's assume standard Hex.
            config.color = `#${val.substring(0, 6)}`;
        }

        // h;0 -> Outlines Off (h;0 means outlines ON?? No, usually h;0 is default? Let's check TenZ code: h;0 is in code. He has NO outlines.)
        // Actually: 
        // P;h;0 means Outlines OFF?
        // Let's deduce from Seed data:
        // TenZ: h;0 -> Outlines: false.
        // Yay: h;0 -> Outlines: false.
        // Demon1: no h param -> Outlines: true.
        // So presence of h;0 implies Outlines OFF. But wait, codes are additive.
        // Actually 'h' is usually 'Outlines On' flag in some parsers?
        // Let's look closer.
        // Demon1 code: 0;s;1;P;o;1... 
        // 'o' is Outline Opacity? 't' is Thickness?

        // Let's use a simpler heuristic based on common knowledge or experimentation
        // P usually starts the primary profile.

        // Outlines
        if (key === 'h') {
            // It seems 'h;0' sets outlines to OFF.
            // If 'h' isn't there, defaults might involve outlines.
            // Wait, standard parser logic: 
            // c = color
            // h = outlines (1 = on, 0 = off) - BUT TenZ has h;0 and outlines: false.
            // So if h is followed by 0, outlines = false.
            if (val === '0') config.outlines = false;
        }

        // o;1 -> Outline Opacity (0-1)
        if (key === 'o') {
            // If it's a standalone 'o', usually outline opacity check context.
            // Inner lines also use 'o' (0o).
            // Main 'o' usually appears before 0l, 0o.
            config.outlineOpacity = parseFloat(val);
            if (config.outlineOpacity > 0) config.outlines = true; // Implicit turn on?
        }

        // t -> Outline Thickness
        if (key === 't') {
            config.outlineThickness = parseFloat(val);
        }

        // d;1 -> Center Dot On
        if (key === 'd') {
            if (val === '1') config.centerDot = true;
            if (val === '0') config.centerDot = false;
        }
        // z;X -> Center Dot Thickness
        if (key === 'z') {
            config.centerDotThickness = parseFloat(val);
        }
        // a;X -> Center Dot Opacity
        if (key === 'a') {
            config.centerDotOpacity = parseFloat(val);
        }

        // --- INNER LINES (Prefix 0) ---
        // 0b;0 -> Inner Lines Show? (b usually means 'show' bool, 0=off, 1=on)
        if (key === '0b') {
            if (val === '0') config.innerLines.show = false;
        }
        // 0l -> Length
        if (key === '0l') config.innerLines.length = parseFloat(val);
        // 0t -> Thickness
        if (key === '0t') config.innerLines.thickness = parseFloat(val);
        // 0o -> Offset
        if (key === '0o') config.innerLines.offset = parseFloat(val);
        // 0a -> Opacity
        if (key === '0a') config.innerLines.opacity = parseFloat(val);


        // --- OUTER LINES (Prefix 1) ---
        // 1b;0 -> Outer Lines Show?
        if (key === '1b') {
            if (val === '0') config.outerLines.show = false;
        }
        // 1l -> Length
        if (key === '1l') config.outerLines.length = parseFloat(val);
        // 1t -> Thickness
        if (key === '1t') config.outerLines.thickness = parseFloat(val);
        // 1o -> Offset
        if (key === '1o') config.outerLines.offset = parseFloat(val);
        // 1a -> Opacity
        if (key === '1a') config.outerLines.opacity = parseFloat(val);
    }

    return config;
};
