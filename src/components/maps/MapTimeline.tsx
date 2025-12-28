import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import type { MapData } from '../../services/api';

interface MapTimelineProps {
    maps?: MapData[];
}

interface TimelineGroup {
    year: string;
    title: string;
    maps: string[];
}

const YEAR_TITLES: Record<string, string> = {
    "2020": "FIRST LIGHT",
    "2021": "FORMATION",
    "2022": "DIMENSION",
    "2023": "EVOLUTION",
    "2024": "REVELATION",
    "2025": "AWAKENING"
};

const MapTimeline = ({ maps = [] }: MapTimelineProps) => {

    const timelineData = useMemo(() => {
        const groups: Record<string, string[]> = {};

        maps.forEach(map => {
            // Parse date (YYYY-MM-DD) or default to 2020
            const year = map.releaseDate ? map.releaseDate.split('-')[0] : "2020";
            if (!groups[year]) groups[year] = [];
            groups[year].push(map.displayName);
        });

        // Convert to array and sort
        const sortedGroups: TimelineGroup[] = Object.keys(groups)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(year => ({
                year,
                title: YEAR_TITLES[year] || `ERA ${year}`,
                maps: groups[year].sort()
            }));

        return sortedGroups;
    }, [maps]);

    return (
        <Section className="py-32 bg-valo-dark relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-5xl md:text-7xl font-oswald text-white uppercase mb-2">
                        Operation <span className="text-valo-red">History</span>
                    </h2>
                    <p className="text-white/50 font-rajdhani text-lg tracking-widest uppercase">
                        Timeline of Sector Discoveries
                    </p>
                </motion.div>

                <div className="relative border-l-2 border-white/10 ml-4 md:ml-10 space-y-16">
                    {timelineData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-12"
                        >
                            {/* Dot on line */}
                            <div className="absolute -left-[9px] top-2 w-4 h-4 bg-valo-dark border-2 border-valo-red rounded-full" />

                            <div className="flex flex-col md:flex-row gap-4 md:items-baseline">
                                <div className="text-4xl font-oswald text-white/20 font-bold">{item.year}</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white uppercase mb-2 flex items-center gap-3">
                                        {item.title}
                                        <div className="h-px w-10 bg-white/20" />
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.maps.map((mapName, mIdx) => (
                                            <span
                                                key={mIdx}
                                                className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-rajdhani font-bold text-valo-red uppercase hover:bg-valo-red hover:text-white transition-colors cursor-default"
                                            >
                                                {mapName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {timelineData.length === 0 && (
                        <div className="text-white/30 font-rajdhani italic pl-12">
                            Initializing Archives...
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default MapTimeline;
