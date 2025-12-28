import React, { useMemo } from 'react';
import Section from '../ui/Section';
import type { MapData } from '../../services/api';

// Static Tactical Data for major maps (fallback for others)
const TACTICAL_INTEL: Record<string, { attack: string; defend: string; composition: string }> = {
    "Ascent": {
        attack: "Control Mid courtyard to split defenses. Use smokes to block Market and Pizza.",
        defend: "Prioritize holding Mid. Closing button doors early can delay rushes but limits retake options.",
        composition: "Sova, Omen, Killjoy, Jett, KAY/O"
    },
    "Bind": {
        attack: "Use teleporters to rotate quickly. Control Showers (A) or Hookah (B) for pincer attacks.",
        defend: "Sage walls on Tube or Hookah are effective. Watch for teleporter audio cues.",
        composition: "Raze, Brimstone, Skye, Viper, Cypher"
    },
    "Haven": {
        attack: "Threaten all 3 sites. A steady default spread puts pressure on rotators.",
        defend: "Don't over-rotate. Garage control is crucial for holding C and B sites.",
        composition: "Breach, Jett, Omen, Killjoy, Sova"
    },
    "Breeze": {
        attack: "Viper wall is essential for entry. fight for Hall control to split A site.",
        defend: "Operator usage on long angles (Mid, B Main) is highly effective.",
        composition: "Viper, Jett, Skye, Kayo, Chamber"
    },
    "Split": {
        attack: "Mid control is non-negotiable. Split pushes through Heaven are key to taking sites.",
        defend: "Sage wall Mid often stops fast plays. Heavy utility usage in tight chokes works best.",
        composition: "Raze, Sage, Omen, Skye, Cypher"
    },
    "Icebox": {
        attack: "Plant on B usually requires a Sage wall. Gridlock Mid to cut off rotations.",
        defend: "Playing vertical angles on A site pipes creates unexpected crossfires.",
        composition: "Viper, Sage, Sova, Reyna, Chamber"
    },
    "Lotus": {
        attack: "Break the breakable door early for faster rotates. A/C control squeezes B.",
        defend: "The rotating doors make noise; use that info. Aggressive pushes on C mound work well.",
        composition: "Omen, Raze, Fade, Killjoy, Viper"
    },
    "Sunset": {
        attack: "Mid control allows splits on both sites. Spam the market door.",
        defend: "Cypher trips on B Main are very strong. Hold Mid tiles with an Operator.",
        composition: "Raze, Omen, Gekko, Cypher, Breach"
    }
};

const DEFAULT_INTEL = {
    attack: "Focus on trade fragging and clearing corners. Use utility to gain space.",
    defend: "Hold crossfires with teammates. Don't peek alone if you have the numbers advantage.",
    composition: "Balanced: 2 Duelist, 1 Smoker, 1 Sentinel, 1 Initiator"
};

const TacticalBriefing = ({ maps }: { maps: MapData[] }) => {
    // Pick a random map or cycle them (using first for stability or random for fun)
    // For "Daily" feel, we could use the date to seed, but random on load is fine for now
    const featuredMap = useMemo(() => {
        if (!maps || maps.length === 0) return null;
        // Simple random pick
        const randomIndex = Math.floor(Math.random() * maps.length);
        return maps[randomIndex];
    }, [maps]);

    const intel = featuredMap ? (TACTICAL_INTEL[featuredMap.displayName] || DEFAULT_INTEL) : DEFAULT_INTEL;

    if (!featuredMap) return null;

    return (
        <Section className="py-12 md:pb-24 relative overflow-hidden border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-5 mix-blend-overlay" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left: Map Visual */}
                    <div className="lg:w-1/2 relative group">
                        <div className="aspect-video bg-valo-dark relative overflow-hidden border border-white/10">
                            {/* Image */}
                            <img
                                src={featuredMap.splash}
                                alt={featuredMap.displayName}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                            />
                            {/* Overlay UI */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-6 left-6">
                                <div className="bg-valo-red text-white text-xs font-bold px-2 py-1 inline-block mb-2">
                                    PRIORITY SECTOR
                                </div>
                                <h3 className="text-5xl font-oswald text-white uppercase">{featuredMap.displayName}</h3>
                                <p className="text-white/60 font-rajdhani">{featuredMap.coordinates || "UNKNOWN COORDINATES"}</p>
                            </div>

                            {/* Decoration */}
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/20" />
                            <div className="absolute bottom-4 right-4 text-right">
                                <div className="text-[10px] text-white/30 font-mono">SECTOR_ID</div>
                                <div className="text-xl font-mono text-white/50">{featuredMap.uuid.substring(0, 8)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Briefing File */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-8 relative">
                            <h2 className="text-4xl font-oswald text-white uppercase mb-2">
                                <span className="text-valo-red">///</span> Tactical Briefing
                            </h2>
                            <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                        </div>

                        <div className="space-y-8">
                            {/* Mission Objectives */}
                            <div>
                                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-valo-red" />
                                    Attack Strategy
                                </h4>
                                <p className="text-lg text-white font-rajdhani leading-relaxed border-l border-white/10 pl-4 text-justify">
                                    {intel.attack}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <div className="w-1 h-3 bg-green-500" />
                                    Defense Strategy
                                </h4>
                                <p className="text-lg text-white font-rajdhani leading-relaxed border-l border-white/10 pl-4 text-justify">
                                    {intel.defend}
                                </p>
                            </div>

                            {/* Squad Recs */}
                            <div className="bg-white/5 border border-white/10 p-6">
                                <h4 className="text-xs font-mono text-valo-red uppercase mb-2">RECOMMENDED SQUAD</h4>
                                <div className="text-xl font-oswald text-white tracking-wide">
                                    {intel.composition}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Section>
    );
};

export default TacticalBriefing;
