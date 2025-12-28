
import React from 'react';
import type { CrosshairConfig } from '../../data/crosshairs';
import { Sliders } from 'lucide-react';

interface CrosshairControlsProps {
    config: CrosshairConfig;
    onChange: (newConfig: CrosshairConfig) => void;
}

export const CrosshairControls: React.FC<CrosshairControlsProps> = ({ config, onChange }) => {

    const update = (key: keyof CrosshairConfig, value: any) => {
        onChange({ ...config, [key]: value });
    };

    const updateInner = (key: keyof CrosshairConfig['innerLines'], value: any) => {
        onChange({ ...config, innerLines: { ...config.innerLines, [key]: value } });
    };

    const updateOuter = (key: keyof CrosshairConfig['outerLines'], value: any) => {
        onChange({ ...config, outerLines: { ...config.outerLines, [key]: value } });
    };

    return (
        <div
            className="bg-valo-black/90 p-6 rounded-xl border border-white/10 h-full overflow-y-auto custom-scrollbar"
            data-lenis-prevent
        >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Sliders className="text-valo-red" />
                <h3 className="text-xl font-oswald text-white uppercase">Settings</h3>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest">General</h4>

                    <div className="space-y-2">
                        <label className="text-white text-sm">Crosshair Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={config.color}
                                onChange={(e) => update('color', e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                            />
                            <input
                                type="text"
                                value={config.color}
                                onChange={(e) => update('color', e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-3 text-white text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Outlines</label>
                        <input
                            type="checkbox"
                            checked={config.outlines}
                            onChange={(e) => update('outlines', e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-valo-red"
                        />
                    </div>
                    {config.outlines && (
                        <div className="space-y-2 pl-4 border-l-2 border-white/5">
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Opacity <span>{config.outlineOpacity}</span></div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={config.outlineOpacity ?? 1}
                                    onChange={(e) => update('outlineOpacity', parseFloat(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Thickness <span>{config.outlineThickness}</span></div>
                                <input
                                    type="range" min="1" max="6" step="1"
                                    value={config.outlineThickness ?? 1}
                                    onChange={(e) => update('outlineThickness', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Center Dot</label>
                        <input
                            type="checkbox"
                            checked={config.centerDot}
                            onChange={(e) => update('centerDot', e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-valo-red"
                        />
                    </div>
                    {config.centerDot && (
                        <div className="space-y-2 pl-4 border-l-2 border-white/5">
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Opacity <span>{config.centerDotOpacity}</span></div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={config.centerDotOpacity ?? 1}
                                    onChange={(e) => update('centerDotOpacity', parseFloat(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Thickness <span>{config.centerDotThickness}</span></div>
                                <input
                                    type="range" min="1" max="6" step="1"
                                    value={config.centerDotThickness ?? 2}
                                    onChange={(e) => update('centerDotThickness', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest">Inner Lines</h4>
                        <input
                            type="checkbox"
                            checked={config.innerLines.show}
                            onChange={(e) => updateInner('show', e.target.checked)}
                        />
                    </div>

                    {config.innerLines.show && (
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Opacity <span>{config.innerLines.opacity}</span></div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={config.innerLines.opacity ?? 1}
                                    onChange={(e) => updateInner('opacity', parseFloat(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Length <span>{config.innerLines.length}</span></div>
                                <input
                                    type="range" min="0" max="20" step="1"
                                    value={config.innerLines.length}
                                    onChange={(e) => updateInner('length', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Thickness <span>{config.innerLines.thickness}</span></div>
                                <input
                                    type="range" min="1" max="10" step="1"
                                    value={config.innerLines.thickness}
                                    onChange={(e) => updateInner('thickness', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Offset <span>{config.innerLines.offset}</span></div>
                                <input
                                    type="range" min="0" max="20" step="1"
                                    value={config.innerLines.offset}
                                    onChange={(e) => updateInner('offset', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Outer Lines */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest">Outer Lines</h4>
                        <input
                            type="checkbox"
                            checked={config.outerLines.show}
                            onChange={(e) => updateOuter('show', e.target.checked)}
                        />
                    </div>

                    {config.outerLines.show && (
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Opacity <span>{config.outerLines.opacity}</span></div>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={config.outerLines.opacity ?? 1}
                                    onChange={(e) => updateOuter('opacity', parseFloat(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Length <span>{config.outerLines.length}</span></div>
                                <input
                                    type="range" min="0" max="10" step="1"
                                    value={config.outerLines.length}
                                    onChange={(e) => updateOuter('length', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Thickness <span>{config.outerLines.thickness}</span></div>
                                <input
                                    type="range" min="1" max="10" step="1"
                                    value={config.outerLines.thickness}
                                    onChange={(e) => updateOuter('thickness', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-white/50 mb-1">Offset <span>{config.outerLines.offset}</span></div>
                                <input
                                    type="range" min="0" max="40" step="1"
                                    value={config.outerLines.offset}
                                    onChange={(e) => updateOuter('offset', parseInt(e.target.value))}
                                    className="w-full accent-valo-red"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
