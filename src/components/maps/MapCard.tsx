import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MapData } from '../../services/api';
import { Crosshair } from 'lucide-react';

interface MapCardProps {
    map: MapData;
    onClick: (map: MapData) => void;
}

const MapCard: React.FC<MapCardProps> = ({ map, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position state for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the tilt
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    // Transform mouse position to rotation degrees
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Holographic sheen movement (moves opposite to tilt)
    const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const sheenY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // Calculate normalized mouse position (-0.5 to 0.5) from center
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className="relative w-[300px] md:w-[400px] lg:w-[30vw] h-[50vh] md:h-[60vh] shrink-0 group perspective-1000 cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick(map)}
            style={{
                perspective: 1000
            }}
        >
            <motion.div
                className="w-full h-full relative bg-valo-gray clip-corner-2 overflow-hidden border border-white/10 group-hover:border-valo-red/50 transition-colors duration-500 shadow-xl"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d" // Essential for 3D effect
                }}
            >
                {/* Background Image Layer */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{ transform: "translateZ(0px)" }} // Base layer
                >
                    <img
                        src={map.splash}
                        alt={map.displayName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Holographic Sheen Layer */}
                <motion.div
                    className="absolute inset-0 z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
                    style={{
                        background: `linear-gradient(105deg, transparent 20%, rgba(255, 70, 85, 0.4) 40%, rgba(255, 255, 255, 0.3) 45%, rgba(255, 70, 85, 0.4) 50%, transparent 80%)`,
                        backgroundSize: "200% 200%",
                        backgroundPositionX: sheenX,
                        backgroundPositionY: sheenY,
                        transform: "translateZ(20px)"
                    }}
                />

                {/* Floating UI Layer (3D Depth) */}
                <div
                    className="absolute inset-0 p-8 flex flex-col justify-end z-20"
                    style={{ transform: "translateZ(40px)" }}
                >
                    {/* Top HUD */}
                    <div className="absolute top-6 right-6 flex flex-col items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
                        <div className="flex items-center gap-2 text-valo-red mb-1">
                            <Crosshair size={14} className="animate-spin-slow" />
                            <span className="font-rajdhani text-xs font-bold tracking-widest">TACTICAL FEED</span>
                        </div>
                        <div className="h-px w-12 bg-valo-red/50" />
                        <span className="text-white/40 font-rajdhani text-[10px] mt-1 tracking-[0.2em]">{map.coordinates}</span>
                    </div>

                    {/* Main Content */}
                    <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                        <div className="flex items-center gap-3 mb-2 opacity-80 group-hover:opacity-100">
                            <div className="bg-valo-red px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-widest shrink-0">
                                Sector {map.uuid.slice(0, 4)}
                            </div>
                            <div className="h-px w-full bg-white/20" />
                        </div>

                        <h2 className="text-6xl md:text-7xl font-oswald font-bold text-transparent text-stroke-white group-hover:text-white transition-colors duration-300 uppercase leading-[0.85] tracking-tighter">
                            {map.displayName}
                        </h2>

                        <p className="mt-4 text-white/70 font-rajdhani text-sm leading-relaxed line-clamp-2 border-l-2 border-valo-red pl-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 translate-y-4 group-hover:translate-y-0">
                            {map.narrativeDescription || map.tacticalDescription}
                        </p>
                    </div>
                </div>

                {/* Decorative Tech Borders */}
                <div className="absolute inset-4 border border-white/5 pointer-events-none z-30" style={{ transform: "translateZ(10px)" }}>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30" />
                </div>

            </motion.div>
        </motion.div>
    );
};

export default MapCard;
