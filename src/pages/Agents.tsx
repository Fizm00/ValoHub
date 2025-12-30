import { useState, useMemo } from 'react';
import Section from '../components/ui/Section';
import { TechCard } from '../components/ui/TechCard';
import { type Agent } from '../services/api';
import { useAgents } from '../hooks/useValoData';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import AgentDetailModal from '../components/agents/AgentDetailModal';
import { cn } from '../lib/utils';

const Agents = () => {
    const { data: rawAgents = [], isLoading: loading } = useAgents();
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const agents = useMemo(() => {
        return rawAgents.filter((agent, index, self) =>
            index === self.findIndex((t) => (
                t.displayName === agent.displayName
            )) && agent.isPlayableCharacter
        );
    }, [rawAgents]);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const matchesSearch = agent.displayName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = selectedRole ? agent.role?.displayName === selectedRole : true;
            return matchesSearch && matchesRole;
        });
    }, [agents, searchQuery, selectedRole]);

    const roles = Array.from(new Set(agents.map(a => a.role?.displayName).filter(Boolean)));

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-valo-dark text-white">
                <div className="text-2xl font-oswald animate-pulse">LOADING AGENTS...</div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-valo-dark">
            <Section className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-8xl font-oswald font-bold text-white uppercase text-center mb-8"
                        >
                            Agent <span className="text-valo-red">Roster</span>
                        </motion.h1>

                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/5 p-6 border border-white/10 backdrop-blur-sm">
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-valo-red transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="SEARCH AGENT..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-valo-black/50 border border-white/10 px-12 py-3 text-white font-rajdhani uppercase focus:border-valo-red focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center">
                                <button
                                    onClick={() => setSelectedRole(null)}
                                    className={cn(
                                        "px-6 py-2 uppercase font-bold font-oswald border transition-all",
                                        selectedRole === null
                                            ? "bg-valo-red border-valo-red text-white"
                                            : "bg-transparent border-white/20 text-white/50 hover:border-white hover:text-white"
                                    )}
                                >
                                    All
                                </button>
                                {roles.map(role => (
                                    <button
                                        key={role as string}
                                        onClick={() => setSelectedRole(role as string)}
                                        className={cn(
                                            "px-6 py-2 uppercase font-bold font-oswald border transition-all",
                                            selectedRole === role
                                                ? "bg-valo-white text-valo-black border-white"
                                                : "bg-transparent border-white/20 text-white/50 hover:border-white hover:text-white"
                                        )}
                                    >
                                        {role as string}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredAgents.map((agent) => (
                                <motion.div
                                    layout
                                    key={agent.uuid}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setSelectedAgent(agent)}
                                    className="cursor-pointer"
                                >
                                    <TechCard className="group h-[500px] relative overflow-hidden flex flex-col justify-end p-0 border-white/5 hover:border-valo-red transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,70,85,0.3)]">
                                        <div className="absolute inset-0 bg-gradient-to-t from-valo-black via-transparent to-transparent z-10" />
                                        <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-0 group-hover:opacity-20 transition-opacity mix-blend-overlay z-10" />

                                        <img
                                            src={agent.fullPortrait || agent.displayIcon}
                                            alt={agent.displayName}
                                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                            loading="lazy"
                                        />

                                        <div className="relative z-20 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <h2 className="text-5xl font-oswald text-white uppercase mb-2 relative z-10 drop-shadow-lg">{agent.displayName}</h2>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-2 h-2 bg-valo-red rounded-full animate-pulse" />
                                                <span className="text-sm font-bold uppercase tracking-wider text-valo-white/80">{agent.role?.displayName}</span>
                                            </div>

                                            <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <p className="text-valo-red font-bold uppercase tracking-widest text-xs border-t border-white/20 pt-4 mt-2">
                                                    Click for Intel ///
                                                </p>
                                            </div>
                                        </div>
                                    </TechCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredAgents.length === 0 && (
                        <div className="text-center py-20 text-white/30 text-2xl font-oswald uppercase">
                            No Agents Found
                        </div>
                    )}
                </div>
            </Section>

            <AnimatePresence>
                {selectedAgent && (
                    <AgentDetailModal
                        agent={selectedAgent}
                        onClose={() => setSelectedAgent(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Agents;
