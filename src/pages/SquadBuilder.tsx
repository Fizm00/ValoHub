import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type Agent, type MapData, fetchAgents, fetchMaps } from '../services/api'; // Update imports
import Section from '../components/ui/Section';
import { AgentSelector } from '../components/squad/AgentSelector';
import { TeamSlots } from '../components/squad/TeamSlots';
import { AnalysisPanel } from '../components/squad/AnalysisPanel';
import { Users, Map as MapIcon } from 'lucide-react';

const SquadBuilder = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [maps, setMaps] = useState<MapData[]>([]);
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const [squad, setSquad] = useState<(Agent | null)[]>([null, null, null, null, null]);

    useEffect(() => {
        const loadData = async () => {
            const [agentsData, mapsData] = await Promise.all([fetchAgents(), fetchMaps()]);
            setAgents(agentsData);
            setMaps(mapsData);
        };
        loadData();
    }, []);

    const handleSelectAgent = (agent: Agent) => {
        // Find first empty slot
        const emptyIndex = squad.indexOf(null);
        if (emptyIndex !== -1) {
            const newSquad = [...squad];
            newSquad[emptyIndex] = agent;
            setSquad(newSquad);
        }
    };

    const handleRemoveAgent = (index: number) => {
        const newSquad = [...squad];
        newSquad[index] = null;
        setSquad(newSquad);
    };

    return (
        <div className="min-h-screen bg-valo-dark pt-20 pb-0 flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-valo-red/10 blur-[100px] rounded-full pointer-events-none" />

            <Section className="relative z-10 max-w-7xl mx-auto flex-1 flex flex-col w-full h-full p-4 md:p-6 !py-6">
                {/* Header & Map Selector */}
                <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-valo-red/20 rounded border border-valo-red/50 text-valo-red">
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-oswald text-white uppercase leading-none">Squad Builder</h1>
                            <p className="text-white/40 font-rajdhani text-sm uppercase tracking-widest hidden md:block">
                                Tactical Team Composition Analysis Tool
                            </p>
                        </div>
                    </div>

                    {/* Map Dropdown */}
                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                        <MapIcon className="text-white/40" size={16} />
                        <select
                            className="bg-transparent text-white font-oswald uppercase text-lg outline-none cursor-pointer min-w-[200px]"
                            onChange={(e) => setSelectedMap(e.target.value || null)}
                            value={selectedMap || ""}
                        >
                            <option value="" className="bg-valo-dark text-white/50">Select Map (Optional)</option>
                            {maps.map(map => (
                                <option key={map.uuid} value={map.displayName} className="bg-valo-dark text-white">{map.displayName}</option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* Team Slots */}
                <div className="mb-6 shrink-0">
                    <TeamSlots agents={squad} onRemove={handleRemoveAgent} />
                </div>

                {/* Bottom Area: Grid + Analysis */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: Agent Selector (Takes 2/3) */}
                    <div className="lg:col-span-2 min-h-0 h-full flex flex-col">
                        <AgentSelector
                            agents={agents}
                            onSelect={handleSelectAgent}
                            selectedAgentIds={squad.filter(Boolean).map(a => a!.uuid)}
                        />
                    </div>

                    {/* RIGHT: Analysis Panel (Takes 1/3) */}
                    <div className="min-h-0 h-full flex flex-col">
                        <AnalysisPanel agents={squad} mapName={selectedMap} />
                    </div>
                </div>

            </Section>
        </div>
    );
};

export default SquadBuilder;
