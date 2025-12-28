import { useRef, useEffect, useState } from 'react';
import Section from '../components/ui/Section';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { fetchMaps, type MapData } from '../services/api';
import MapDetailModal from '../components/maps/MapDetailModal';
import MapCard from '../components/maps/MapCard';
import MapFeatures from '../components/maps/MapFeatures';
import TacticalBriefing from '../components/maps/TacticalBriefing';
import MapTimeline from '../components/maps/MapTimeline';

const MapsContent = ({ maps }: { maps: MapData[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(maps.length - 1) * 45}vw`]);

    const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <div className="bg-valo-dark relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div style={{ x: bgTextX }} className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap opacity-[0.03]">
                    <span className="text-[20rem] font-oswald font-bold uppercase text-white leading-none">
                        Combat Zones // Global Operations //
                    </span>
                </motion.div>
            </div>

            <div className="h-[300vh] relative z-10" ref={containerRef}>
                <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                    <motion.div style={{ x }} className="flex gap-8 px-10 items-center">
                        {maps.map((map) => (
                            <MapCard
                                key={map.uuid}
                                map={map}
                                onClick={setSelectedMap}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="relative z-20 bg-valo-black -mt-[60vh]">
                <TacticalBriefing maps={maps} />
                <MapTimeline maps={maps} />
                <MapFeatures />
            </div>

            <Section className="min-h-[50vh] flex items-center justify-center bg-valo-black text-white relative overflow-hidden border-t border-white/10">
                <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-10" />
                <div className="relative z-10 text-center">
                    <h2 className="text-6xl md:text-8xl font-oswald uppercase mb-4">
                        Battlegrounds <span className="text-valo-red">Await</span>
                    </h2>
                    <p className="text-white/50 font-rajdhani text-xl tracking-widest uppercase">
                        Master every angle // Dominate every site
                    </p>
                    <div className="mt-12 inline-block p-1 border border-white/10">
                        <div className="bg-white/5 px-8 py-3 uppercase font-bold tracking-widest text-sm text-valo-red">
                            More Maps Incoming
                        </div>
                    </div>
                </div>
            </Section>

            <AnimatePresence>
                {selectedMap && (
                    <MapDetailModal
                        map={selectedMap}
                        onClose={() => setSelectedMap(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const Maps = () => {
    const [maps, setMaps] = useState<MapData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMaps = async () => {
            try {
                const data = await fetchMaps();
                setMaps(data);
            } catch (error) {
                console.error("Failed to load maps", error);
            } finally {
                setLoading(false);
            }
        };
        loadMaps();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-valo-dark text-white">
                <div className="text-2xl font-oswald animate-pulse">LOADING MAPS...</div>
            </div>
        );
    }

    return <MapsContent maps={maps} />;
};

export default Maps;
