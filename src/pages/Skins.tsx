import { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { type Weapon } from '../services/api';
import { Search, Sparkles } from 'lucide-react';
import SkinDetailModal from '../components/skins/SkinDetailModal';
import { useWeapons, useContentTiers } from '../hooks/useValoData';

const Skins = () => {
    const { data: weapons = [], isLoading: loadingWeapons } = useWeapons();
    const { data: contentTiers = [], isLoading: loadingTiers } = useContentTiers();
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkin, setSelectedSkin] = useState<any | null>(null);

    useEffect(() => {
        if (weapons.length > 0 && !selectedWeapon) {
            const sorted = [...weapons].sort((a, b) => a.displayName.localeCompare(b.displayName));
            setSelectedWeapon(sorted[0]);
        }
    }, [weapons]);

    const filteredWeapons = weapons
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .filter(w => w.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loadingWeapons || loadingTiers) {
        return (
            <div className="h-screen flex items-center justify-center bg-valo-dark text-white">
                <div className="text-2xl font-oswald animate-pulse flex items-center gap-3">
                    <Sparkles className="animate-spin" /> LOADING ARMORY...
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 bg-valo-dark min-h-screen flex flex-col">
            <Section className="flex-1 flex flex-col md:flex-row gap-8 h-full">

                <div className="w-full md:w-1/4 flex flex-col gap-4 h-[calc(100vh-150px)] sticky top-24">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="text"
                                placeholder="Search Weapon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded px-10 py-2 text-white text-sm focus:outline-none focus:border-valo-red transition-colors font-rajdhani uppercase tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {filteredWeapons.map((weapon) => (
                            <button
                                key={weapon.uuid}
                                onClick={() => setSelectedWeapon(weapon)}
                                className={`w-full text-left p-3 rounded border transition-all duration-200 flex items-center gap-3 group ${selectedWeapon?.uuid === weapon.uuid
                                    ? 'bg-valo-red border-valo-red'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <img src={weapon.displayIcon} alt={weapon.displayName} className="h-8 w-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <span className={`font-oswald uppercase tracking-wide ${selectedWeapon?.uuid === weapon.uuid ? 'text-white' : 'text-white/60 group-hover:text-white'
                                    }`}>
                                    {weapon.displayName}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-3/4 flex flex-col h-full">
                    {selectedWeapon && (
                        <motion.div
                            key={selectedWeapon.uuid}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <div className="mb-6 border-b border-white/10 pb-4 flex items-end justify-between">
                                <div>
                                    <h2 className="text-4xl font-oswald text-white uppercase">{selectedWeapon.displayName}</h2>
                                    <p className="text-white/40 font-rajdhani tracking-widest text-sm">
                                        {selectedWeapon.skins.length} SKINS AVAILABLE
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <img src={selectedWeapon.displayIcon} alt={selectedWeapon.displayName} className="h-24 w-auto object-contain opacity-20" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                                {selectedWeapon.skins.map((skin, index) => (
                                    (skin.displayIcon || skin.levels[0]?.displayIcon) && (
                                        <motion.div
                                            key={skin.uuid}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-white/5 border border-white/5 hover:border-valo-red/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,70,85,0.2)] aspect-[4/3] flex flex-col cursor-pointer"
                                            onClick={() => setSelectedSkin(skin)}
                                        >
                                            <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-transparent to-black/40 group-hover:to-valo-red/10 transition-colors">
                                                <img
                                                    src={skin.displayIcon || skin.levels[0]?.displayIcon || ''}
                                                    alt={skin.displayName}
                                                    className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-3 bg-black/40 backdrop-blur-sm border-t border-white/5">
                                                <h4 className="text-sm font-bold font-rajdhani text-white/80 group-hover:text-valo-red truncate uppercase tracking-wider text-center">
                                                    {skin.displayName}
                                                </h4>
                                            </div>
                                        </motion.div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

            </Section>

            <AnimatePresence>
                {selectedSkin && (
                    <SkinDetailModal
                        skin={selectedSkin}
                        onClose={() => setSelectedSkin(null)}
                        contentTier={contentTiers.find(t => t.uuid === selectedSkin.contentTierUuid)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Skins;
