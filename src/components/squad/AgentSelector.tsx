
import React, { useMemo } from 'react';
import type { Agent } from '../../services/api';
import { motion } from 'framer-motion';

interface AgentSelectorProps {
    agents: Agent[];
    onSelect: (agent: Agent) => void;
    selectedAgentIds: string[];
}

const ROLES = ['Duelist', 'Controller', 'Initiator', 'Sentinel'];

export const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, onSelect, selectedAgentIds }) => {
    const [filterRole, setFilterRole] = React.useState<string | null>(null);

    const filteredAgents = useMemo(() => {
        if (!filterRole) return agents;
        return agents.filter(a => a.role?.displayName === filterRole);
    }, [agents, filterRole]);

    return (
        <div className="bg-valo-black/50 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col h-full">
            <h3 className="text-white font-oswald text-xl uppercase mb-4 flex items-center justify-between">
                <span>Agent Roster</span>
                <span className="text-xs font-rajdhani text-white/40 tracking-widest">{filteredAgents.length} AVAILABLE</span>
            </h3>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setFilterRole(null)}
                    className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all border ${!filterRole
                        ? 'bg-valo-red border-valo-red text-white'
                        : 'bg-transparent border-white/10 text-white/50 hover:text-white'
                        }`}
                >
                    All
                </button>
                {ROLES.map(role => (
                    <button
                        key={role}
                        onClick={() => setFilterRole(role === filterRole ? null : role)}
                        className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-all border ${filterRole === role
                            ? 'bg-white text-valo-black border-white'
                            : 'bg-transparent border-white/10 text-white/50 hover:text-white'
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
                {filteredAgents.map((agent) => {
                    const isSelected = selectedAgentIds.includes(agent.uuid);
                    return (
                        <motion.button
                            key={agent.uuid}
                            onClick={() => !isSelected && onSelect(agent)}
                            disabled={isSelected}
                            whileHover={{ scale: isSelected ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-square relative rounded overflow-hidden border transition-all group ${isSelected
                                ? 'border-white/5 opacity-30 grayscale cursor-not-allowed'
                                : 'border-white/10 hover:border-valo-red cursor-pointer bg-black/20'
                                }`}
                        >
                            <img
                                src={agent.displayIcon}
                                alt={agent.displayName}
                                className="w-full h-full object-cover p-1"
                            />
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] sm:text-xs text-white uppercase font-bold text-center px-1">
                                    {agent.displayName}
                                </span>
                            </div>

                            <div className="absolute top-1 right-1 w-3 h-3 opacity-50">
                                <img src={agent.role?.displayIcon} alt="" className="w-full h-full invert" />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
