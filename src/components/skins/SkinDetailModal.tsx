import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Sparkles, Heart } from 'lucide-react';
import type { ContentTier } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toggleSavedSkin } from '../../services/api';

interface SkinDetailModalProps {
    skin: any;
    onClose: () => void;
    contentTier?: ContentTier;
}

const SkinDetailModal: React.FC<SkinDetailModalProps> = ({ skin, onClose, contentTier }) => {
    const { user, token, updateUser } = useAuth();
    const defaultChroma = skin.chromas[0];
    const [selectedChroma, setSelectedChroma] = useState(defaultChroma);
    const [selectedLevel, setSelectedLevel] = useState(skin.levels[skin.levels.length - 1]);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setSelectedChroma(skin.chromas[0]);
        setSelectedLevel(skin.levels[skin.levels.length - 1]);
        setActiveVideo(null);

        if (user && user.savedSkins) {
            const isSavedCheck = user.savedSkins.some((s: any) => {
                if (typeof s === 'string') return s === skin.uuid || s === skin._id;
                return s.uuid === skin.uuid || s._id === skin._id;
            });
            setIsSaved(isSavedCheck);
        }
    }, [skin, user]);



    // Simplified price mapping based on content tiers
    const getPriceEstimate = (tierName: string | undefined) => {
        if (!tierName) return '?? CREDS';
        const lower = tierName.toLowerCase();
        if (lower.includes('select')) return '875 VP';
        if (lower.includes('deluxe')) return '1,275 VP';
        if (lower.includes('premium')) return '1,775 VP';
        if (lower.includes('ultra')) return '2,475 VP';
        if (lower.includes('exclusive')) return 'VARIES';
        return 'UNKNOWN';
    };

    const price = getPriceEstimate(contentTier?.displayName);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-valo-dark border border-white/10 w-full max-w-7xl h-[85vh] overflow-hidden rounded-xl shadow-2xl flex flex-col md:flex-row relative"
                onClick={(e) => e.stopPropagation()}
            >


                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-valo-red rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="w-full md:w-3/4 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center h-full p-8 overflow-hidden group">

                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {skin.wallpaper && <img src={skin.wallpaper} className="w-full h-full object-cover blur-sm" alt="" />}
                        {!skin.wallpaper && <div className="w-full h-full bg-[url('https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png')] bg-no-repeat bg-center opacity-5 mix-blend-overlay"></div>}
                    </div>

                    <AnimatePresence mode='wait'>
                        {activeVideo ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full flex flex-col items-center justify-center relative z-10"
                            >
                                <video
                                    src={activeVideo}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full rounded shadow-lg border border-white/10"
                                />
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-rajdhani uppercase tracking-widest text-sm transition-colors"
                                >
                                    Close Video
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="image"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="relative z-10 w-full h-full flex items-center justify-center"
                            >
                                <img
                                    src={selectedChroma?.fullRender || selectedChroma?.displayIcon || skin.levels[0]?.displayIcon}
                                    alt={selectedChroma?.displayName}
                                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-8 left-8 z-10">
                        <h2 className="text-6xl font-oswald text-white uppercase italic tracking-tighter drop-shadow-lg">
                            {skin.displayName}
                        </h2>
                        <div className="flex items-center gap-6 mt-4">
                            {contentTier && (
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                    <img src={contentTier.displayIcon} alt={contentTier.displayName} className="h-6 w-auto" />
                                    <span className="font-rajdhani text-lg text-white/90 uppercase tracking-widest" style={{ color: contentTier.highlightColor }}>
                                        {contentTier.displayName}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <span className="font-rajdhani text-lg text-white/90 uppercase tracking-widest">
                                    {price}
                                </span>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                animate={{ scale: isSaved ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.4 }}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!user || !token) {
                                        alert("Please login to save skins!");
                                        return;
                                    }

                                    // Store previous state for rollback
                                    const previousState = isSaved;

                                    // Optimistic Update
                                    setIsSaved(!previousState);

                                    try {
                                        setIsSaving(true);
                                        const response = await toggleSavedSkin(skin.uuid, token);

                                        if (response && response.savedSkins) {
                                            // Success: Update global context
                                            updateUser({ ...user, savedSkins: response.savedSkins });
                                            // Note: changes to 'user' will trigger the useEffect, verifying the state
                                        } else {
                                            throw new Error("Invalid response from server");
                                        }
                                    } catch (error) {
                                        console.error("Failed to save skin", error);
                                        setIsSaved(previousState); // Revert state UI
                                        // Show user friendly error
                                        alert("Can't save right now. Server connection lost.");
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                disabled={isSaving}
                                className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors duration-300 ${isSaved
                                    ? 'bg-valo-red text-white shadow-[0_0_15px_rgba(255,70,85,0.4)] hover:bg-red-600'
                                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaving ? "animate-pulse" : ""} />
                                {isSaved ? "Saved" : "Save"}
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/4 bg-valo-dark border-l border-white/10 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar shadow-2xl z-20">

                    {skin.chromas && skin.chromas.length > 1 && (
                        <div>
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> Variants
                            </h3>
                            <div className="grid grid-cols-4 gap-3">
                                {skin.chromas.map((chroma: any) => (
                                    <button
                                        key={chroma.uuid}
                                        onClick={() => {
                                            setSelectedChroma(chroma);
                                            setActiveVideo(null);
                                        }}
                                        className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${selectedChroma.uuid === chroma.uuid
                                            ? 'border-valo-red scale-105 shadow-[0_0_10px_rgba(255,70,85,0.4)]'
                                            : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                                            }`}
                                        title={chroma.displayName}
                                    >
                                        <img src={chroma.swatch || chroma.displayIcon} alt={chroma.displayName} className="w-full h-full object-cover" />
                                        {chroma.streamedVideo && (
                                            <div className="absolute top-0 right-0 p-0.5 bg-black/60 rounded-bl text-white">
                                                <Play size={8} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {skin.levels && skin.levels.length > 0 && (
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Sparkles size={14} /> Upgrades & VFX
                            </h3>
                            <div className="space-y-2">
                                {skin.levels.map((level: any, index: number) => (
                                    <div
                                        key={level.uuid}
                                        className={`p-3 rounded bg-white/5 border border-white/5 flex items-center justify-between transition-colors hover:bg-white/10 ${selectedLevel?.uuid === level.uuid ? 'border-l-4 border-l-valo-red bg-white/10' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-xs font-bold text-white/60">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-rajdhani text-white uppercase tracking-wide truncate max-w-[120px]">
                                                {level.displayName || `Level ${index + 1}`}
                                            </span>
                                        </div>

                                        {level.streamedVideo && (
                                            <button
                                                onClick={() => setActiveVideo(level.streamedVideo)}
                                                className="p-1.5 hover:bg-valo-red rounded text-white/60 hover:text-white transition-colors"
                                                title="Preview Effect"
                                            >
                                                <Play size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SkinDetailModal;
