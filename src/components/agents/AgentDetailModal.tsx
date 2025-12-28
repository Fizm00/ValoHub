import React from 'react';
import { motion } from 'framer-motion';
import type { Agent } from '../../services/api';
import { X } from 'lucide-react';

interface AgentDetailModalProps {
    agent: Agent;
    onClose: () => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {

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
                <div className="absolute top-0 left-0 w-2 h-20 bg-valo-red z-50" />
                <div className="absolute bottom-0 right-0 w-20 h-2 bg-valo-red z-50" />
                <div className="absolute top-4 right-12 flex gap-2 z-50">
                    <div className="w-2 h-2 bg-white/50" />
                    <div className="w-2 h-2 bg-white/20" />
                    <div className="w-2 h-2 bg-white/10" />
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-valo-red rotate-45 transform scale-0 group-hover:scale-100 transition-transform" />
                        <X size={32} className="relative z-10 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                </button>

                <div className="w-full md:w-[45%] relative bg-gradient-to-b from-[#1a1a1a] to-valo-black overflow-hidden flex items-end justify-center border-r border-white/5">
                    <div className="absolute top-10 left-0 w-full text-center pointer-events-none overflow-hidden">
                        <span className="text-[12rem] md:text-[16rem] font-oswald font-bold text-white/[0.03] leading-none tracking-tighter uppercase whitespace-nowrap">
                            {agent.role?.displayName}
                        </span>
                    </div>

                    <div className="absolute inset-0 opacity-30 bg-[url('/bg-noise.png')] mix-blend-overlay" />
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-valo-black to-transparent z-10" />

                    <motion.img
                        initial={{ x: -100, opacity: 0, scale: 1.1 }}
                        animate={{ x: 0, opacity: 1, scale: 1.35 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        src={agent.fullPortrait}
                        alt={agent.displayName}
                        className="relative z-20 h-full w-auto object-contain object-center"
                    />
                </div>

                <div className="w-full md:w-[55%] flex flex-col h-full bg-valo-black/50 relative z-40">
                    <div
                        className="overflow-y-auto custom-scrollbar p-6 md:p-16 h-full w-full touch-pan-y"
                        data-lenis-prevent
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 flex items-center justify-center border border-white/20 bg-white/5 skew-x-[-15deg]">
                                    <img src={agent.role?.displayIcon} alt={agent.role?.displayName} className="w-4 h-4 skew-x-[15deg] opacity-80" />
                                </div>
                                <span className="font-rajdhani text-valo-red uppercase tracking-[0.2em] text-sm font-bold">
                                    // {agent.role?.displayName} Class
                                </span>
                            </div>

                            <h2 className="text-7xl md:text-9xl font-oswald font-bold text-white uppercase mb-8 leading-[0.85] tracking-tight">
                                {agent.displayName}
                            </h2>

                            <div className="flex gap-6 mb-12">
                                <div className="w-1 bg-gradient-to-b from-valo-red to-transparent h-auto" />
                                <p className="text-white/70 font-rajdhani text-lg leading-relaxed max-w-xl">
                                    {agent.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-oswald text-white uppercase flex items-center gap-4">
                                    <span className="w-8 h-px bg-valo-red" />
                                    Abilities
                                </h3>

                                <div className="grid grid-cols-1 gap-2">
                                    {agent.abilities?.map((ability, idx) => (
                                        ability.displayIcon && (
                                            <div
                                                key={idx}
                                                className="group relative bg-white/5 border border-white/5 hover:border-valo-red/50 hover:bg-white/10 transition-all duration-300 p-4 flex gap-4 items-start overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-valo-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                                <div className="shrink-0 w-16 h-16 bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform z-10">
                                                    <img src={ability.displayIcon} alt={ability.displayName} className="w-10 h-10 object-contain" />
                                                </div>

                                                <div className="relative z-10">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <h4 className="text-xl font-bold font-oswald text-white uppercase group-hover:text-valo-red transition-colors">
                                                            {ability.displayName}
                                                        </h4>
                                                        <span className="text-xs font-rajdhani text-white/30 uppercase tracking-wider">
                                                            {ability.slot || 'Passive'}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/50 text-sm font-rajdhani leading-snug group-hover:text-white/70 transition-colors">
                                                        {ability.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AgentDetailModal;
