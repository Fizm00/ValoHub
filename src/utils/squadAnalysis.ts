
import type { Agent } from '../services/api';

export interface CompositionTip {
    type: 'warning' | 'info' | 'success' | 'critical';
    message: string;
}

export interface SquadAnalysisResult {
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    score: number; // 0-100
    tips: CompositionTip[];
    roles: Record<string, number>;
}

// Role Definitions (based on standard Valorant roles)
const ROLES = {
    DUELIST: 'Duelist',
    CONTROLLER: 'Controller',
    INITIATOR: 'Initiator',
    SENTINEL: 'Sentinel'
};

// Map Specific Meta Data (Comprehensive Rules)
const MAP_META: Record<string, { S_Tier: string[], F_Tier: string[], essentialRole?: string, note?: string }> = {
    "Ascent": {
        S_Tier: ["Sova", "Jett", "Omen", "Killjoy", "KAY/O"],
        F_Tier: ["Viper", "Harbor", "Brimstone"],
        essentialRole: ROLES.INITIATOR,
        note: "Sova/Kayo is king here for wallbangs and info."
    },
    "Bind": {
        S_Tier: ["Raze", "Skye", "Brimstone", "Viper", "Gekko"],
        F_Tier: ["Jett", "Neon"], // Jett harder to use without updraft spots
        essentialRole: ROLES.CONTROLLER,
        note: "Raze nades and teleporters are a perfect match."
    },
    "Breeze": {
        S_Tier: ["Viper", "Jett", "Sova", "Chamber", "KAY/O", "Yoru"],
        F_Tier: ["Brimstone", "Omen", "Raze", "Phoenix", "Breach"], // Short range utility sucks here
        essentialRole: ROLES.CONTROLLER,
        note: "Long range fights. Viper wall is mandatory. Sova/Kayo for info."
    },
    "Fracture": {
        S_Tier: ["Breach", "Raze", "Brimstone", "Neon", "Fade"],
        F_Tier: ["Sova", "Reyna"], // Sova darts hard to land
        essentialRole: ROLES.INITIATOR,
        note: "Breach stun is unstoppable on these lanes."
    },
    "Haven": {
        S_Tier: ["Breach", "Sova", "Jett", "Killjoy", "Omen"],
        F_Tier: ["Viper", "Brimstone"],
        essentialRole: ROLES.INITIATOR,
        note: "3 Sites means you need fast rotations and retake util."
    },
    "Icebox": {
        S_Tier: ["Viper", "Sova", "Sage", "Jett", "Reyna", "Gekko"],
        F_Tier: ["Brimstone", "Phoenix", "Cypher", "Breach"],
        essentialRole: ROLES.CONTROLLER,
        note: "Verticality is key. Plant B requires sage wall or control."
    },
    "Lotus": {
        S_Tier: ["Omen", "Raze", "Breach", "Killjoy", "Fade"],
        F_Tier: ["Brimstone", "Reyna"],
        essentialRole: ROLES.INITIATOR,
        note: "With 3 sites and rotating doors, flexibility is key."
    },
    "Pearl": {
        S_Tier: ["Harbor", "Viper", "Jett", "KAY/O", "Skye"],
        F_Tier: ["Sova", "Brimstone"],
        essentialRole: ROLES.CONTROLLER,
        note: "B Long is a sniper/Viper playground."
    },
    "Split": {
        S_Tier: ["Raze", "Sage", "Omen", "Skye", "Breach", "Cypher"],
        F_Tier: ["Sova", "Brimstone"],
        essentialRole: ROLES.SENTINEL,
        note: "Mid control is everything. Sage wall/Cypher trips are huge."
    },
    "Sunset": {
        S_Tier: ["Raze", "Omen", "Cypher", "Breach", "Fade"],
        F_Tier: ["Viper", "Brimstone"],
        essentialRole: ROLES.INITIATOR,
        note: "Fighting for Main control requires heavy suppression."
    }
};

export const analyzeSquad = (currentAgents: Agent[], mapName?: string | null): SquadAnalysisResult => {
    const tips: CompositionTip[] = [];
    let score = 100;

    // 0. Empty Check
    if (currentAgents.length === 0) {
        return { grade: 'F', score: 0, tips: [{ type: 'info', message: "Select 5 agents to evaluate your squad." }], roles: {} };
    }

    // 1. Count Roles
    const roleCounts: Record<string, number> = {
        [ROLES.DUELIST]: 0,
        [ROLES.CONTROLLER]: 0,
        [ROLES.INITIATOR]: 0,
        [ROLES.SENTINEL]: 0
    };

    currentAgents.forEach(agent => {
        const role = agent.role?.displayName;
        if (role && roleCounts[role] !== undefined) {
            roleCounts[role]++;
        }
    });

    // 2. Critical Missing Roles
    // A standard meta comp usually needs at least 1 Smoker (Controller)
    if (roleCounts[ROLES.CONTROLLER] === 0) {
        score -= 25;
        tips.push({ type: 'critical', message: "No Smokes (Controller)! Critical weakness." });
    } else if (roleCounts[ROLES.CONTROLLER] > 2) {
        score -= 15;
        tips.push({ type: 'warning', message: "Too many Controllers. You might lack entry power." });
    } else {
        tips.push({ type: 'success', message: "Good smoke coverage." });
    }

    // 3. Duelist Balance
    if (roleCounts[ROLES.DUELIST] === 0) {
        score -= 20;
        tips.push({ type: 'warning', message: "No Duelist. Entry fragging will be very difficult." });
    } else if (roleCounts[ROLES.DUELIST] > 2) {
        score -= 10 * (roleCounts[ROLES.DUELIST] - 2);
        tips.push({ type: 'warning', message: `Triple+ Duelist setup. High risk, requires aggressive play.` });
    }

    // 4. Info Gathering (Initiators)
    if (roleCounts[ROLES.INITIATOR] === 0) {
        score -= 15;
        tips.push({ type: 'warning', message: "No Initiator. You have no info gathering tools." });
    }

    // 5. Flank Watch (Sentinels)
    if (roleCounts[ROLES.SENTINEL] === 0) {
        score -= 10; // Playable but risky
        tips.push({ type: 'info', message: "No Sentinel. careful of flanks!" });
    }

    // 6. Agent Specific Synergies (Simple Examples)
    const agentNames = currentAgents.map(a => a.displayName);
    const hasJett = agentNames.includes('Jett');
    const hasBreach = agentNames.includes('Breach');

    if (hasJett && hasBreach) {
        score += 5;
        tips.push({ type: 'success', message: "Combo Detected: Breach Stun + Jett Dash is lethal!" });
    }

    const hasSage = agentNames.includes('Sage');
    if (hasSage && !agentNames.includes('Skye') && roleCounts[ROLES.INITIATOR] === 0) {
        tips.push({ type: 'info', message: "Sage allows for safe plants, but you still need info." });
    }

    // 7. Map Specific Analysis (Enhanced)
    if (mapName && MAP_META[mapName]) {
        const meta = MAP_META[mapName];
        let mapSuitabilityScore = 0;

        // S-Tier Bonus
        const sTierPicks = currentAgents.filter(a => meta.S_Tier.includes(a.displayName));
        if (sTierPicks.length > 0) {
            mapSuitabilityScore += sTierPicks.length * 5;
            score += sTierPicks.length * 4;
            tips.push({ type: 'success', message: `${mapName} EXPERT: ${sTierPicks.map(a => a.displayName).join(', ')} are top-tier here.` });
        }

        // F-Tier Penalty (Severe)
        const fTierPicks = currentAgents.filter(a => meta.F_Tier.includes(a.displayName));
        if (fTierPicks.length > 0) {
            mapSuitabilityScore -= fTierPicks.length * 10;
            score -= fTierPicks.length * 8; // Heavy penalty
            tips.push({ type: 'warning', message: `${mapName} WARNING: ${fTierPicks.map(a => a.displayName).join(', ')} are very weak on this map!` });
        }

        // Essential Role Specific Check
        if (meta.essentialRole && roleCounts[meta.essentialRole] === 0) {
            score -= 15;
            tips.push({ type: 'critical', message: `${mapName} usually requires a strong ${meta.essentialRole}.` });
        }

        // Specific Note
        if (meta.note) {
            tips.push({ type: 'info', message: `MAP TIP: ${meta.note}` });
        }
    }

    // 8. Determine Grade
    let grade: SquadAnalysisResult['grade'] = 'F';

    // Penalize incomplete squads heavily
    if (currentAgents.length < 5) {
        score = Math.max(0, score - (5 - currentAgents.length) * 15);
        tips.push({ type: 'info', message: `Add ${5 - currentAgents.length} more agents.` });
    }

    if (score >= 95) grade = 'S';
    else if (score >= 82) grade = 'A';
    else if (score >= 65) grade = 'B';
    else if (score >= 45) grade = 'C';
    else grade = 'D';

    if (score < 30) grade = 'F';

    return {
        grade,
        score: Math.max(0, Math.min(100, score)),
        tips,
        roles: roleCounts
    };
};
