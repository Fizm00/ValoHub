import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Agent, saveSquad } from '../services/api';
import { useAgents, useMaps } from '../hooks/useValoData';
import Section from '../components/ui/Section';
import { AgentSelector } from '../components/squad/AgentSelector';
import { TeamSlots } from '../components/squad/TeamSlots';
import { AnalysisPanel } from '../components/squad/AnalysisPanel';
import { Users, Map as MapIcon, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquadSchema, type SquadFormValues } from '../lib/validations';

const SquadBuilder = () => {
    const { user, token, updateUser } = useAuth();
    const { data: agents = [] } = useAgents();
    const { data: maps = [] } = useMaps();
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const [squad, setSquad] = useState<(Agent | null)[]>([null, null, null, null, null]);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // React Hook Form for validation
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset
    } = useForm<SquadFormValues>({
        resolver: zodResolver(SquadSchema)
    });

    const handleSelectAgent = (agent: Agent) => {
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

    const handleOpenSaveModal = () => {
        if (!user || !token) {
            alert("Please login to save squads!");
            return;
        }
        if (!selectedMap) {
            alert("Please select a map first!");
            return;
        }
        if (squad.every(a => a === null)) {
            alert("Squad cannot be empty!");
            return;
        }

        // Prepare form
        setValue('squadName', `${selectedMap} Strat`);
        setShowSaveModal(true);
    };

    const onConfirmSave = async (data: SquadFormValues) => {
        try {
            const agentIds = squad.filter(Boolean).map(a => a!.uuid);
            const response = await saveSquad({
                name: data.squadName,
                map: selectedMap!,
                agents: agentIds
            }, token!);

            if (response._id) {
                setShowSaveModal(false);
                const newSavedSquads = [...(user!.savedSquads || []), response._id];
                updateUser({ ...user!, savedSquads: newSavedSquads });
                alert("Squad Saved Successfully!");
                reset(); // Reset form
            }
        } catch (error) {
            console.error("Failed to save squad", error);
            alert("Failed to save squad");
        }
    };

    return (
        <div className="min-h-screen bg-valo-dark pt-20 pb-0 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-valo-red/10 blur-[100px] rounded-full pointer-events-none" />

            <Section className="relative z-10 max-w-7xl mx-auto flex-1 flex flex-col w-full h-full p-4 md:p-6 !py-6">
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

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                            <MapIcon className="text-white/40" size={16} />
                            <select
                                className="bg-transparent text-white font-oswald uppercase text-lg outline-none cursor-pointer min-w-[200px]"
                                onChange={(e) => setSelectedMap(e.target.value || null)}
                                value={selectedMap || ""}
                            >
                                <option value="" className="bg-valo-dark text-white/50">Select Map</option>
                                {maps.map(map => (
                                    <option key={map.uuid} value={map.displayName} className="bg-valo-dark text-white">{map.displayName}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleOpenSaveModal}
                            disabled={isSubmitting} // Use form loading state if binding is complex, but here modal opens first
                            className="px-6 py-2 bg-white hover:bg-gray-200 text-valo-dark font-bold font-rajdhani uppercase tracking-widest clip-corner-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            Save Squad
                        </button>
                    </div>
                </header>

                <div className="mb-6 shrink-0">
                    <TeamSlots agents={squad} onRemove={handleRemoveAgent} />
                </div>
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-0 h-full flex flex-col">
                        <AgentSelector
                            agents={agents}
                            onSelect={handleSelectAgent}
                            selectedAgentIds={squad.filter(Boolean).map(a => a!.uuid)}
                        />
                    </div>
                    <div className="min-h-0 h-full flex flex-col">
                        <AnalysisPanel agents={squad} mapName={selectedMap} />
                    </div>
                </div>

            </Section>

            {/* Save Squad Modal */}
            <AnimatePresence>
                {showSaveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-valo-dark border border-white/10 p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(255,70,85,0.2)]"
                        >
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-valo-red" />

                            <h3 className="text-2xl font-oswald text-white uppercase mb-6 flex items-center gap-2">
                                <Save className="text-valo-red" /> Save Strategy
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-white/50 tracking-wider mb-2 block">Squad Name</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        {...register('squadName')}
                                        placeholder={`${selectedMap || 'My'} Strat`}
                                        className={`w-full bg-black/30 border ${errors.squadName ? 'border-red-500' : 'border-white/10'} p-3 text-white focus:border-valo-red outline-none transition-colors`}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSubmit(onConfirmSave)();
                                            }
                                        }}
                                    />
                                    {errors.squadName && <p className="text-xs text-red-500 mt-1">{errors.squadName.message}</p>}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowSaveModal(false)}
                                        className="flex-1 py-3 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit(onConfirmSave)}
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-valo-red text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Confirm Save'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SquadBuilder;
