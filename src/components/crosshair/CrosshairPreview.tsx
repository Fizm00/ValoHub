
import React from 'react';
import type { CrosshairConfig } from '../../data/crosshairs';

interface CrosshairPreviewProps {
    config: CrosshairConfig;
    scale?: number;
}

export const CrosshairPreview: React.FC<CrosshairPreviewProps> = ({ config, scale = 4 }) => {
    const px = (val: number) => `${val * scale}px`;

    const outlineStyle = (opacity: number = 1) =>
        config.outlines ? `drop-shadow(0px 0px ${px(config.outlineThickness || 1)} rgba(0,0,0,${config.outlineOpacity || opacity}))` : 'none';

    return (
        <div className="relative flex items-center justify-center w-full h-full pointer-events-none select-none">
            {config.centerDot && (
                <div
                    className="absolute bg-current z-20"
                    style={{
                        width: px(config.centerDotThickness || 2),
                        height: px(config.centerDotThickness || 2),
                        backgroundColor: config.color,
                        opacity: config.centerDotOpacity ?? 1,
                        filter: outlineStyle()
                    }}
                />
            )}

            {config.innerLines.show && (
                <>
                    <div
                        className="absolute bg-current z-10"
                        style={{
                            width: px((config.innerLines.length * 2) + (config.innerLines.offset * 2) + Math.max(config.innerLines.thickness, 2)), // simplified total width
                            height: px(config.innerLines.thickness),
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{
                            width: px(config.innerLines.length),
                            height: '100%',
                            backgroundColor: config.color,
                            opacity: config.innerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />

                        <div style={{ width: px(config.innerLines.offset * 2), height: '100%' }} />

                        <div style={{
                            width: px(config.innerLines.length),
                            height: '100%',
                            backgroundColor: config.color,
                            opacity: config.innerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />
                    </div>

                    <div
                        className="absolute bg-current z-10 flex flex-col justify-between items-center"
                        style={{
                            height: px((config.innerLines.length * 2) + (config.innerLines.offset * 2) + Math.max(config.innerLines.thickness, 2)),
                            width: px(config.innerLines.thickness),
                            backgroundColor: 'transparent',
                        }}
                    >
                        <div style={{
                            height: px(config.innerLines.length),
                            width: '100%',
                            backgroundColor: config.color,
                            opacity: config.innerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />

                        <div style={{ height: px(config.innerLines.offset * 2), width: '100%' }} />

                        <div style={{
                            height: px(config.innerLines.length),
                            width: '100%',
                            backgroundColor: config.color,
                            opacity: config.innerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />
                    </div>
                </>
            )}
            {config.outerLines.show && (
                <>
                    <div
                        className="absolute bg-current z-10"
                        style={{
                            width: px((config.outerLines.length * 2) + (config.outerLines.offset * 2) + Math.max(config.outerLines.thickness, 2)),
                            height: px(config.outerLines.thickness),
                            backgroundColor: 'transparent',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{
                            width: px(config.outerLines.length),
                            height: '100%',
                            backgroundColor: config.color,
                            opacity: config.outerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />

                        <div style={{ width: px(config.outerLines.offset * 2), height: '100%' }} />

                        <div style={{
                            width: px(config.outerLines.length),
                            height: '100%',
                            backgroundColor: config.color,
                            opacity: config.outerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />
                    </div>

                    <div
                        className="absolute bg-current z-10 flex flex-col justify-between items-center"
                        style={{
                            height: px((config.outerLines.length * 2) + (config.outerLines.offset * 2) + Math.max(config.outerLines.thickness, 2)),
                            width: px(config.outerLines.thickness),
                            backgroundColor: 'transparent',
                        }}
                    >
                        <div style={{
                            height: px(config.outerLines.length),
                            width: '100%',
                            backgroundColor: config.color,
                            opacity: config.outerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />

                        <div style={{ height: px(config.outerLines.offset * 2), width: '100%' }} />

                        <div style={{
                            height: px(config.outerLines.length),
                            width: '100%',
                            backgroundColor: config.color,
                            opacity: config.outerLines.opacity ?? 1,
                            filter: outlineStyle()
                        }} />
                    </div>
                </>
            )}
        </div>
    );
};
