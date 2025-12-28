import { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeapons, type Weapon } from '../services/api';
import WeaponDetailModal from '../components/weapons/WeaponDetailModal';
import { Target, Crosshair } from 'lucide-react';

const CATEGORIES = ['All', 'Sidearm', 'Rifle', 'Sniper', 'SMG', 'Shotgun', 'Heavy', 'Melee'];

const Weapons = () => {
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

    useEffect(() => {
        const loadWeapons = async () => {
            try {
                const data = await fetchWeapons();
                const sorted = data.sort((a, b) => (a.shopData?.cost || 0) - (b.shopData?.cost || 0));
                setWeapons(sorted);
            } catch (error) {
                console.error("Failed to load weapons", error);
            } finally {
                setLoading(false);
            }
        };
        loadWeapons();
    }, []);

    const getCategoryName = (categoryStr: string) => {
        if (!categoryStr) return 'Unknown';
        const parts = categoryStr.split('::');
        return parts[1] || parts[0];
    };

    const filteredWeapons = filter === 'All'
        ? weapons
        : weapons.filter(w => getCategoryName(w.category).toLowerCase() === filter.toLowerCase());

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-valo-dark text-white">
                <div className="text-2xl font-oswald animate-pulse flex items-center gap-3">
                    <Crosshair className="animate-spin" /> ESTABLISHING LINK...
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 bg-valo-dark min-h-screen">
            <Section centered>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-oswald font-bold text-white mb-4 uppercase tracking-tighter">
                        Arsenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-valo-red to-red-600">Protocol</span>
                    </h1>
                    <p className="text-white/40 font-rajdhani text-lg tracking-widest max-w-2xl mx-auto border-t border-white/10 pt-4">
                        STANDARD ISSUE & TACTICAL ORDNANCE
                    </p>
                </motion.div>

                <div className="flex flex-wrap gap-2 justify-center mb-16 sticky top-24 z-30 bg-valo-dark/90 backdrop-blur-md py-4 border-y border-white/5">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 text-sm font-bold font-rajdhani uppercase tracking-widest transition-all clip-corner-sm ${filter === cat
                                ? 'bg-valo-red text-white'
                                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Weapons Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
                    <AnimatePresence mode="popLayout">
                        {filteredWeapons.map((weapon) => (
                            <motion.div
                                key={weapon.uuid}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setSelectedWeapon(weapon)}
                                className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-valo-red/50 transition-all duration-300 cursor-pointer overflow-hidden h-[300px] flex flex-col"
                            >
                                {/* Background Decorations */}
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Target size={40} />
                                </div>

                                {/* Header */}
                                <div className="p-6 relative z-10">
                                    <h3 className="text-3xl font-oswald text-white uppercase group-hover:text-valo-red transition-colors">{weapon.displayName}</h3>
                                    <div className="flex items-center gap-3 text-xs font-mono text-white/40 mt-1">
                                        <span className="uppercase">{getCategoryName(weapon.category)}</span>
                                        <div className="h-1 w-1 bg-valo-red rounded-full" />
                                        <span>{weapon.shopData?.cost || 0} CREDS</span>
                                    </div>
                                </div>

                                {/* Weapon Image Area */}
                                <div className="flex-1 relative flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/20 group-hover:to-valo-red/10 transition-colors">
                                    <motion.img
                                        src={weapon.displayIcon}
                                        alt={weapon.displayName}
                                        className="w-full h-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ease-out"
                                    />
                                </div>

                                {/* Hover Stats Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-valo-red translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 flex justify-between items-center z-20">
                                    <span className="text-white font-oswald text-sm uppercase tracking-wider">INSPECT WEAPON</span>
                                    <Crosshair className="text-white" size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </Section>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedWeapon && (
                    <WeaponDetailModal
                        weapon={selectedWeapon}
                        onClose={() => setSelectedWeapon(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Weapons;
