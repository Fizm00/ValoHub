import React from 'react';
import { motion } from 'framer-motion';
import type { MapData } from '../../services/api';
import { X, Map as MapIcon, Compass } from 'lucide-react';

interface MapDetailModalProps {
    map: MapData;
    onClose: () => void;
}

const MapDetailModal: React.FC<MapDetailModalProps> = ({ map, onClose }) => {

    const [showCallouts, setShowCallouts] = React.useState(true);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-valo-black/95 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-7xl h-[90vh] bg-valo-dark border border-white/10 flex flex-col md:flex-row shadow-[0_0_50px_rgba(255,70,85,0.1)] overflow-hidden"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 98% 100%, 0 100%)"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tech Deco */}
                <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-valo-red rounded-tr-3xl z-50 pointer-events-none opacity-50" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/20 rounded-bl-3xl z-50 pointer-events-none opacity-50" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-valo-red rotate-45 transform scale-0 group-hover:scale-100 transition-transform" />
                        <X size={32} className="relative z-10 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                </button>

                {/* Left: Tactical Map View */}
                <div className="w-full md:w-[60%] relative bg-valo-black/80 flex items-center justify-center p-8 border-r border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-valo-red/5 to-transparent pointer-events-none" />

                    {/* Controls */}
                    <div className="absolute top-8 left-8 z-20 flex gap-4">
                        <button
                            onClick={() => setShowCallouts(!showCallouts)}
                            className={`px-4 py-2 text-xs font-bold font-rajdhani uppercase tracking-widest border transition-all ${showCallouts ? 'bg-valo-red text-white border-valo-red' : 'bg-transparent text-white/50 border-white/10 hover:border-white'}`}
                        >
                            Toggle Callouts
                        </button>
                    </div>

                    {/* Map Image Container */}
                    <div className="relative w-full h-full max-h-[80vh] aspect-square flex items-center justify-center">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            src={map.displayIcon}
                            alt={`${map.displayName} Tactical`}
                            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] invert active:invert-0 transition-all duration-300"
                            style={{ filter: "invert(1) opacity(0.9)" }}
                        />

                        {/* Callouts Overlay */}
                        {showCallouts && map.callouts?.map((callout, index) => {
                            // Coordinate Transformation (Standard)
                            // UI_Y = World_X ... UI_X = World_Y
                            const top = (callout.location.x * map.yMultiplier) + map.yScalarToAdd;
                            const left = (callout.location.y * map.xMultiplier) + map.xScalarToAdd;

                            if (top < 0 || top > 1 || left < 0 || left > 1) return null;

                            return (
                                <div
                                    key={index}
                                    className="absolute flex flex-col items-center justify-center group cursor-help z-20"
                                    style={{
                                        top: `${top * 100}%`,
                                        left: `${left * 100}%`,
                                        transform: 'translate(-50%, -50%)' // Center the dot exactly on the point
                                    }}
                                >
                                    {/* DOT: The reference anchor */}
                                    <div className="w-1.5 h-1.5 bg-valo-red rounded-full shadow-[0_0_8px_#ff4655] group-hover:scale-150 transition-transform relative z-10" />

                                    {/* TEXT: Always visible now */}
                                    <div className="absolute top-3 z-20 pointer-events-none whitespace-nowrap">
                                        <span className="text-[10px] font-bold font-rajdhani text-white uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 shadow-sm">
                                            {callout.regionName}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Overlay Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
                    </div>

                    <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white/40 font-rajdhani uppercase tracking-widest text-xs">
                        <Compass size={16} />
                        <span>Coordinates: {map.coordinates || "UNKNOWN"}</span>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-[40%] flex flex-col h-full bg-valo-dark relative z-40">
                    <div
                        className="overflow-y-auto custom-scrollbar p-8 md:p-12 h-full w-full touch-pan-y"
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 border border-valo-red/50 bg-valo-red/10">
                                    <MapIcon size={20} className="text-valo-red" />
                                </div>
                                <span className="font-rajdhani text-white/50 uppercase tracking-[0.2em] text-sm font-bold">
                                    Tactical Database
                                </span>
                            </div>

                            <h2 className="text-7xl font-oswald font-bold text-white uppercase mb-8 leading-none">
                                {map.displayName}
                            </h2>

                            <div className="relative mb-10 group overflow-hidden border border-white/10">
                                <div className="absolute inset-0 bg-valo-red/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10" />
                                <img
                                    src={map.splash}
                                    alt={map.displayName}
                                    className="w-full h-48 object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                                />
                                <div className="absolute bottom-2 right-2 z-20 bg-black/70 px-2 py-1 text-xs font-rajdhani text-white uppercase">
                                    Environmental Preview
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-oswald text-white uppercase mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-valo-red rotate-45" /> Narrative
                                    </h3>
                                    <p className="text-white/70 font-rajdhani leading-relaxed border-l-2 border-white/10 pl-4">
                                        {map.narrativeDescription || "No narrative data available for this sector."}
                                    </p>
                                </div>

                                {map.tacticalDescription && (
                                    <div>
                                        <h3 className="text-xl font-oswald text-white uppercase mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-valo-cyan rotate-45" /> Site Layout
                                        </h3>
                                        <p className="text-white/70 font-rajdhani leading-relaxed border-l-2 border-white/10 pl-4">
                                            {map.tacticalDescription}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MapDetailModal;
