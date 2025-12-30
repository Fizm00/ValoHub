export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    savedCrosshairs?: string[];
    savedSkins?: (string | any)[];
    savedSquads?: string[];
}

export interface AuthResponse {
    result: User;
    token: string;
}

export interface Agent {
    uuid: string;
    displayName: string;
    description: string;
    developerName: string;
    displayIcon: string;
    displayIconSmall: string;
    bustPortrait: string;
    fullPortrait: string;
    killfeedPortrait: string;
    background: string;
    backgroundGradientColors: string[];
    isPlayableCharacter: boolean;
    role: {
        uuid: string;
        displayName: string;
        description: string;
        displayIcon: string;
    };
    abilities: {
        slot: string;
        displayName: string;
        description: string;
        displayIcon: string;
    }[];
}

export interface MapData {
    uuid: string;
    displayName: string;
    narrativeDescription: string;
    tacticalDescription: string;
    coordinates: string;
    displayIcon: string;
    listViewIcon: string;
    splash: string;
    assetPath: string;
    mapUrl: string;
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
    releaseDate?: string;
    callouts?: {
        regionName: string;
        superRegionName: string;
        location: { x: number; y: number };
    }[];
}

export interface Weapon {
    uuid: string;
    displayName: string;
    category: string;
    displayIcon: string;
    killStreamIcon: string;
    assetPath: string;
    shopData: {
        cost: number;
        category: string;
        categoryText: string;
        gridPosition: { row: number; column: number };
        image: string;
        newImage: string;
        newImage2: string;
        assetPath: string;
    };
    weaponStats?: {
        fireRate: number;
        magazineSize: number;
        runSpeedMultiplier: number;
        equipTimeSeconds: number;
        reloadTimeSeconds: number;
        firstBulletAccuracy: number;
        shotgunPelletCount: number;
        wallPenetration: string;
        feature: string;
        fireMode: string;
        altFireType: string;
        adsStats?: {
            zoomMultiplier: number;
            fireRate: number;
            runSpeedMultiplier: number;
            burstCount: number;
            firstBulletAccuracy: number;
        };
        damageRanges: {
            rangeStartMeters: number;
            rangeEndMeters: number;
            headDamage: number;
            bodyDamage: number;
            legDamage: number;
        }[];
    };
    skins: {
        uuid: string;
        displayName: string;
        themeUuid: string;
        contentTierUuid: string;
        displayIcon: string;
        wallpaper: string | null;
        chromas: {
            uuid: string;
            displayName: string;
            displayIcon: string | null;
            fullRender: string;
            swatch: string | null;
            streamedVideo: string | null;
        }[];
        levels: {
            uuid: string;
            displayName: string;
            levelItem: string | null;
            displayIcon: string | null;
            streamedVideo: string | null;
        }[];
    }[];
    strategyGuide?: string[];
}

export interface ContentTier {
    uuid: string;
    displayName: string;
    displayIcon: string;
    rank: number;
    highlightColor: string;
}

const BASE_URL = 'http://localhost:5000/api';

export const fetchAgents = async (): Promise<Agent[]> => {
    const response = await fetch(`${BASE_URL}/agents`);
    const data = await response.json();
    return data;
};

export const fetchMaps = async (): Promise<MapData[]> => {
    const response = await fetch(`${BASE_URL}/maps`);
    const data = await response.json();
    return data;
};

export const fetchWeapons = async (): Promise<Weapon[]> => {
    const response = await fetch(`${BASE_URL}/weapons`);
    const data = await response.json();
    return data;
};

export const fetchCrosshairs = async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/crosshairs`);
    const data = await response.json();
    return data;
};

export const fetchContentTiers = async (): Promise<ContentTier[]> => {
    try {
        const response = await fetch('https://valorant-api.com/v1/contenttiers');
        const json = await response.json();
        return json.data;
    } catch (e) {
        console.error("Failed to fetch content tiers", e);
        return [];
    }
};

export const toggleSavedCrosshair = async (crosshairId: string, token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-crosshairs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ crosshairId })
    });
    if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to save crosshair");
    }
    return response.json();
};

export const getSavedCrosshairs = async (token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-crosshairs`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

// --- SKINS ---
export const toggleSavedSkin = async (skinId: string, token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-skins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ skinId })
    });
    if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to save skin");
    }
    return response.json();
};

export const getSavedSkins = async (token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-skins`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

// --- SQUADS ---
export const saveSquad = async (squadData: { name: string, map: string, agents: string[] }, token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-squads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(squadData)
    });
    if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to save squad");
    }
    return response.json();
};

export const getSavedSquads = async (token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-squads`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

export const deleteSavedSquad = async (squadId: string, token: string) => {
    const response = await fetch(`${BASE_URL}/user/saved-squads/${squadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
};

export const triggerSync = async () => {
    const response = await fetch(`${BASE_URL}/sync`, { method: 'POST' });
    return response.json();
};
