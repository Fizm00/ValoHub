
import { useState } from 'react';
import { CrosshairControls } from '../components/crosshair/CrosshairControls';
import { CrosshairPreview } from '../components/crosshair/CrosshairPreview';
import type { CrosshairConfig } from '../data/crosshairs';
import { useLocation } from 'react-router-dom';
import { Copy, RotateCcw } from 'lucide-react';

// Default Config
const DEFAULT_CONFIG: CrosshairConfig = {
    color: "#00ffff",
    outlines: true,
    outlineOpacity: 1,
    outlineThickness: 1,
    centerDot: false,
    innerLines: { show: true, opacity: 1, length: 6, thickness: 2, offset: 3 },
    outerLines: { show: true, opacity: 0.5, length: 2, thickness: 2, offset: 10 }
};

const CrosshairGenerator = () => {
    const location = useLocation();
    const initialConfig = location.state?.config || DEFAULT_CONFIG;
    const initialName = location.state?.player || "Custom Profile";

    const [config, setConfig] = useState<CrosshairConfig>(initialConfig);
    const [profileName, setProfileName] = useState(initialName);

    // Dummy generate code function - in a real app this would parse the config to the '0;P;...' format
    const generateCode = () => {
        // This is complex string manipulation. For now we just return a placeholder or the original if unedited.
        // Implementing full protocol generator is out of scope for this step, but we can simulate success.
        return `0;P;c;${config.color};h;0... (Generator WIP)`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCode());
        alert("Crosshair code copied to clipboard! (Simulated)");
    };

    return (
        <div className="fixed inset-0 top-20 bg-valo-dark flex flex-col z-0">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col w-full h-full p-4 md:p-6 !py-6">

                <header className="mb-6 flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-oswald text-white uppercase">Crosshair Generator</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/40 text-xs uppercase tracking-widest">Editing:</span>
                            <input
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="bg-transparent text-valo-red border-b border-white/10 focus:border-valo-red text-sm font-bold uppercase outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setConfig(DEFAULT_CONFIG)}
                            className="p-2 text-white/50 hover:text-white transition-colors" title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 bg-white text-valo-black px-4 py-2 rounded font-bold uppercase hover:opacity-90"
                        >
                            <Copy size={16} /> Copy Code
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Preview Area (2/3) */}
                    <div className="lg:col-span-2 relative bg-[#1c1c1c] rounded-xl overflow-hidden border border-white/10 group h-full">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-[url('/maps/ascent_splash.jpg')] bg-cover bg-center transition-all opacity-50" />

                        {/* Crosshair Center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <CrosshairPreview config={config} scale={1} />
                        </div>

                        {/* Optional: Map Selectors for background could go here */}
                        <div className="absolute bottom-4 left-4 text-white/30 text-xs bg-black/50 px-2 py-1 rounded">
                            Preview Scale: 1x
                        </div>
                    </div>

                    {/* Right: Controls (1/3) */}
                    <div className="min-h-0 flex flex-col h-full overflow-hidden">
                        <CrosshairControls config={config} onChange={setConfig} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CrosshairGenerator;

