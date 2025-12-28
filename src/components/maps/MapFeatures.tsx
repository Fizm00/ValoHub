import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, ArrowUpFromLine, Zap, Target } from 'lucide-react';
import { TechCard } from '../ui/TechCard';
import Section from '../ui/Section';

const features = [
    {
        icon: DoorOpen,
        title: "Teleporters",
        map: "BIND",
        desc: "One-way transit systems for rapid rotation. Emits a loud audio cue upon usage. Projectiles can pass through."
    },
    {
        icon: ArrowUpFromLine,
        title: "Ascenders",
        map: "ICEBOX / SPLIT",
        desc: "Vertical zip-lines allowing rapid high-ground access. Accuracy is decreased while attached."
    },
    {
        icon: Zap,
        title: "Destructible Doors",
        map: "LOTUS / ASCENT",
        desc: "Interactive barriers that can be opened, closed, or destroyed. Key for controlling site flow."
    },
    {
        icon: Target,
        title: "Three Planting Sites",
        map: "HAVEN / LOTUS",
        desc: "Unique layouts featuring an additional C-Site, stretching defender resources thin."
    }
];

const MapFeatures = () => {
    return (
        <Section className="py-32 relative bg-valo-dark overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-oswald text-white uppercase mb-4">
                        Strategic <span className="text-valo-red">Unique Mechanics</span>
                    </h2>
                    <p className="text-white/60 font-rajdhani text-lg max-w-2xl border-l-2 border-valo-red pl-4">
                        Every map presents a unique tactical puzzle. Mastering these environmental mechanics is key to dominance.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <TechCard
                            key={idx}
                            className="bg-white/5 hover:bg-white/10 transition-colors group h-full"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="p-3 bg-valo-red/10 border border-valo-red/30 rounded-lg group-hover:bg-valo-red group-hover:text-white transition-colors duration-300">
                                        <feature.icon size={28} className="text-valo-red group-hover:text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold font-rajdhani text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                        {feature.map}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-oswald text-white uppercase mb-3 group-hover:text-valo-red transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-white/60 font-rajdhani leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        </TechCard>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-valo-red/5 to-transparent pointer-events-none" />
        </Section>
    );
};

export default MapFeatures;
