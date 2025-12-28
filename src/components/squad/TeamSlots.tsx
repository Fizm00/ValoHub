
import React from 'react';
import type { Agent } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface TeamSlotsProps {
    agents: (Agent | null)[];
    onRemove: (index: number) => void;
}

export const TeamSlots: React.FC<TeamSlotsProps> = ({ agents, onRemove }) => {
    return (
        <div className="grid grid-cols-5 gap-2 md:gap-4 h-[30vh] md:h-[40vh] w-full max-w-6xl mx-auto mb-8">
            {agents.map((agent, index) => (
                <div
                    key={index}
                    className={`relative rounded-lg border-2 overflow-hidden group transition-all duration-500 ${agent
                        ? 'border-white/20 bg-valo-black/80'
                        : 'border-white/5 border-dashed bg-white/5 flex items-center justify-center'
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {agent ? (
                            <motion.div
                                key={agent.uuid}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full h-full relative"
                            >
                                <img
                                    src={agent.fullPortrait || agent.displayIcon}
                                    alt={agent.displayName}
                                    className="absolute inset-0 w-full h-full object-cover object-top scale-125 translate-y-4 md:translate-y-8 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col items-center">
                                    <img src={agent.role?.displayIcon} className="w-4 h-4 invert opacity-70 mb-1" />
                                    <span className="text-white font-oswald uppercase text-lg md:text-2xl leading-none shadow-black drop-shadow-md">
                                        {agent.displayName}
                                    </span>
                                    <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                                        {agent.role?.displayName}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onRemove(index)}
                                    className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white p-1 rounded transition-all opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
                                >
                                    <X size={16} />
                                </button>
                            </motion.div>
                        ) : (
                            <div className="text-white/10 flex flex-col items-center gap-2 animate-pulse">
                                <Plus size={32} />
                                <span className="text-xs font-rajdhani uppercase tracking-widest">Empty Slot</span>
                            </div>
                        )}
                    </AnimatePresence>

                    {!agent && (
                        <div className="absolute top-2 left-3 text-4xl font-oswald text-white/5 font-bold select-none">
                            0{index + 1}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
