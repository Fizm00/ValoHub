
import React from 'react';
import { useMemo } from 'react';
import { analyzeSquad } from '../../utils/squadAnalysis';
import type { Agent } from '../../services/api';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisPanelProps {
    agents: (Agent | null)[];
    mapName?: string | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ agents, mapName }) => {
    const activeAgents = useMemo(() => agents.filter((a): a is Agent => a !== null), [agents]);

    const analysis = useMemo(() => analyzeSquad(activeAgents, mapName), [activeAgents, mapName]);

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'S': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]';
            case 'A': return 'text-emerald-400';
            case 'B': return 'text-blue-400';
            case 'C': return 'text-orange-400';
            case 'D': return 'text-orange-600';
            default: return 'text-red-600';
        }
    };

    return (
        <div className="bg-valo-black/80 backdrop-blur border border-white/10 rounded-xl p-6 h-full flex flex-col">
            <h3 className="text-white/50 text-xs font-rajdhani uppercase tracking-widest mb-4">TACTICAL ASSESSMENT</h3>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-white text-sm font-bold uppercase mb-1">Squad Rating</div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-6xl font-oswald font-bold ${getGradeColor(analysis.grade)}`}>
                            {analysis.grade}
                        </span>
                        <div className="text-white/30 text-xs font-mono">
                            TIER
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-white/30 text-[10px] uppercase">Composition Score</div>
                    <div className="text-2xl font-mono text-white">{Math.round(analysis.score)}/100</div>
                </div>
            </div>

            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {activeAgents.length === 0 ? (
                    <div className="text-white/20 text-center py-4 text-sm italic">
                        Assemble your squad to begin analysis...
                    </div>
                ) : (
                    analysis.tips.map((tip, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded border text-sm flex gap-3 items-start ${tip.type === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-200' :
                                tip.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' :
                                    tip.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-200' :
                                        'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                }`}
                        >
                            <span className="mt-0.5 shrink-0">
                                {tip.type === 'critical' || tip.type === 'warning' ? <AlertTriangle size={14} /> :
                                    tip.type === 'success' ? <CheckCircle size={14} /> :
                                        <Info size={14} />}
                            </span>
                            <span>{tip.message}</span>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-4 gap-2 text-center">
                {Object.entries(analysis.roles).map(([role, count]) => (
                    <div key={role} className="bg-white/5 rounded p-2">
                        <div className="text-[10px] text-white/40 uppercase truncate">{role}</div>
                        <div className={`text-xl font-oswald ${count === 0 ? 'text-white/20' : 'text-white'}`}>{count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
