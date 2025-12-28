import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BarChart2, Target, Zap, Info, DollarSign, Moon } from 'lucide-react';
import { type Weapon, fetchContentTiers, type ContentTier } from '../../services/api';
import { Button } from '../ui/Button';

interface WeaponDetailModalProps {
    weapon: Weapon;
    onClose: () => void;
}



// Estimated Prices based on Tier (approximate)
const TIER_PRICES: Record<string, number> = {
    "Select": 875,
    "Deluxe": 1275,
    "Premium": 1775,
    "Ultra": 2475,
    "Exclusive": 2175 // Varies wildly, but 2175 is common bundle price
};

const WeaponDetailModal = ({ weapon, onClose }: WeaponDetailModalProps) => {
    const skins = weapon.skins || [];
    const [currentSkinIndex, setCurrentSkinIndex] = useState(0);
    const [tiers, setTiers] = useState<ContentTier[]>([]);

    // Filter chromas for the current skin
    const currentSkin = skins[currentSkinIndex];
    const [currentChromaIndex, setCurrentChromaIndex] = useState(0);

    // Fetch Tiers on mount
    useEffect(() => {
        const loadTiers = async () => {
            const data = await fetchContentTiers();
            setTiers(data);
        };
        loadTiers();
    }, []);

    // Get current skin's tier data
    const currentTier = tiers.find(t => t.uuid === currentSkin?.contentTierUuid);
    const tierName = currentTier?.displayName || "Standard";
    // Night market eligibility: Usually Select, Deluxe, Premium are eligible. Ultra/Exclusive usually NOT.
    // Check rank or name. Rank < ? 
    // Let's use name check for simplicity.
    const isNightMarketEligible = ["Select", "Deluxe", "Premium"].some(t => tierName.includes(t));
    const estimatedPrice = TIER_PRICES[tierName.split(' ')[0]] || (tierName === "Standard" ? 0 : "???");

    // Reset chroma when skin changes
    useEffect(() => {
        setCurrentChromaIndex(0);
    }, [currentSkinIndex]);

    const activeChroma = currentSkin?.chromas?.[currentChromaIndex];
    const displayImage = activeChroma?.fullRender || currentSkin?.displayIcon || currentSkin?.levels?.[0]?.displayIcon || weapon.displayIcon;

    const nextSkin = () => {
        setCurrentSkinIndex((prev) => (prev + 1) % skins.length);
    };

    const prevSkin = () => {
        setCurrentSkinIndex((prev) => (prev - 1 + skins.length) % skins.length);
    };



    // Calculate generic stat percentages (arbitrary scaling for visual bar)
    const fireRatePercent = Math.min((weapon.weaponStats?.fireRate || 0) * 5, 100);
    const damagePercent = Math.min((weapon.weaponStats?.damageRanges?.[0]?.bodyDamage || 0), 100);
    const reloadSpeedInverse = Math.min(((5 - (weapon.weaponStats?.reloadTimeSeconds || 0)) / 5) * 100, 100); // Faster reload = higher bar

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative bg-valo-dark border border-white/10 w-full max-w-7xl h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-valo-red transition-colors text-white rounded-full"
                    >
                        <X size={24} />
                    </button>

                    {/* LEFT: 3D / Skin Viewer */}
                    <div className="w-full md:w-2/3 bg-gradient-to-br from-gray-900 to-black relative flex flex-col items-center justify-center p-8 overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10" />

                        {/* Background Name Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 font-oswald text-[12rem] font-bold uppercase whitespace-nowrap select-none">
                            {weapon.displayName}
                        </div>

                        {/* Skin Info Top Overlay */}
                        <div className="absolute top-0 inset-x-0 p-6 flex flex-col items-center z-20">
                            <h2 className="text-white/50 text-xs font-rajdhani tracking-widest uppercase mb-1">SELECTED SKIN</h2>
                            <div className="flex items-center gap-2">
                                {currentTier?.displayIcon && (
                                    <img src={currentTier.displayIcon} alt="tier" className="w-6 h-6 object-contain" />
                                )}
                                <div className="text-3xl font-oswald text-white uppercase text-center shadow-black drop-shadow-md">
                                    {currentSkin?.displayName || weapon.displayName}
                                </div>
                            </div>

                            {/* Skin Metadata Badges */}
                            {tierName !== "Standard" && (
                                <div className="flex gap-2 mt-2">
                                    <div className="px-2 py-1 bg-black/40 border border-white/10 rounded flex items-center gap-1 text-[10px] text-white/70 font-mono">
                                        <DollarSign size={10} className="text-valo-cyan" />
                                        {estimatedPrice} VP
                                    </div>
                                    {isNightMarketEligible && (
                                        <div className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/50 rounded flex items-center gap-1 text-[10px] text-indigo-300 font-mono">
                                            <Moon size={10} />
                                            NIGHT MARKET OK
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* WEAPON IMAGE */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-10">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSkinIndex + "-" + currentChromaIndex}
                                    src={displayImage}
                                    alt={currentSkin?.displayName}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="max-w-full max-h-[50vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Skin Controls */}
                        <div className="absolute bottom-8 flex items-center gap-6 z-20">
                            <Button variant="outline" onClick={prevSkin} className="w-12 h-12 rounded-full p-0 flex items-center justify-center">
                                <ChevronLeft />
                            </Button>

                            {/* Chroma Swatches */}
                            <div className="flex gap-2 bg-black/50 p-2 rounded-full backdrop-blur-sm border border-white/10">
                                {currentSkin?.chromas?.map((chroma, idx) => (
                                    <button
                                        key={chroma.uuid}
                                        onClick={() => setCurrentChromaIndex(idx)}
                                        className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all relative ${currentChromaIndex === idx ? 'border-valo-red scale-110' : 'border-transparent opacity-50 hover:opacity-100'} `}
                                        title={chroma.displayName}
                                    >
                                        {chroma.swatch ? (
                                            <img src={chroma.swatch} alt={chroma.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-500 flex items-center justify-center text-[8px] text-white">
                                                {idx + 1}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <Button variant="outline" onClick={nextSkin} className="w-12 h-12 rounded-full p-0 flex items-center justify-center">
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: Stats & Data */}
                    <div className="w-full md:w-1/3 bg-valo-black/95 border-l border-white/5 p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <span className="text-valo-red font-mono text-xs uppercase mb-2 block tracking-widest">TACTICAL ANALYSIS</span>
                            <div className="flex justify-between items-end">
                                <h1 className="text-4xl font-oswald text-white uppercase">{weapon.displayName}</h1>
                                <span className="text-valo-cyan font-oswald text-xl">{weapon.shopData?.cost || 0}</span>
                            </div>
                            <div className="text-white/40 text-sm font-rajdhani mt-1 uppercase">{weapon.category.split('::').pop()}</div>
                        </div>

                        {/* STATS BARS */}
                        <div className="space-y-4 mb-8">
                            <StatBar label="DAMAGE" value={damagePercent} icon={<Target size={14} />} />
                            <StatBar label="FIRE RATE" value={fireRatePercent} icon={<Zap size={14} />} />
                            <StatBar label="RELOAD" value={reloadSpeedInverse} icon={<BarChart2 size={14} />} />

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Mag Size</div>
                                    <div className="text-xl font-oswald text-white">{weapon.weaponStats?.magazineSize || "N/A"}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Wall Pen</div>
                                    <div className="text-xl font-oswald text-white text-sm pt-0.5">
                                        {weapon.weaponStats?.wallPenetration
                                            ? weapon.weaponStats.wallPenetration.split('::').pop()
                                            : "N/A"
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Damage Table */}
                        <div className="bg-white/5 p-4 rounded border border-white/10 mb-6">
                            <h4 className="text-xs text-white/50 uppercase mb-3 font-bold">Damage Profile (0-30m)</h4>
                            {weapon.weaponStats?.damageRanges?.[0] ? (
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <DamageBox part="HEAD" value={weapon.weaponStats.damageRanges[0].headDamage} color="text-valo-red" />
                                    <DamageBox part="BODY" value={weapon.weaponStats.damageRanges[0].bodyDamage} color="text-white" />
                                    <DamageBox part="LEGS" value={weapon.weaponStats.damageRanges[0].legDamage} color="text-white/60" />
                                </div>
                            ) : (
                                <div className="text-white/30 text-xs text-center">No damage data</div>
                            )}
                        </div>

                        {/* TIPS SECTION */}
                        {weapon.strategyGuide && weapon.strategyGuide.length > 0 && (
                            <div className="bg-gradient-to-br from-valo-red/10 to-transparent p-4 rounded border border-valo-red/20">
                                <h4 className="text-xs text-valo-red uppercase mb-3 font-bold flex items-center gap-2">
                                    <Info size={14} /> FIELD MANUAL // STRATEGY
                                </h4>
                                <ul className="space-y-2">
                                    {weapon.strategyGuide.map((tip, idx) => (
                                        <li key={idx} className="text-sm text-white/70 font-rajdhani flex gap-2">
                                            <span className="text-valo-red">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const StatBar = ({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) => (
    <div>
        <div className="flex justify-between text-xs text-white/60 mb-1 font-rajdhani uppercase tracking-wider items-center">
            <span className="flex items-center gap-2">{icon} {label}</span>
            <span>{Math.round(value)}%</span>
        </div>
        <div className="h-1 w-full bg-white/10 overflow-hidden relative rounded-full">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-valo-red to-red-600 rounded-full"
            />
        </div>
    </div>
);

const DamageBox = ({ part, value, color }: { part: string, value: number, color: string }) => (
    <div className="bg-black/20 p-2 rounded">
        <div className="text-[10px] text-white/30 font-bold mb-1">{part}</div>
        <div className={`text-xl font-oswald ${color} `}>{Math.floor(value)}</div>
    </div>
);

export default WeaponDetailModal;
