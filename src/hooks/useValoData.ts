import { useQuery } from '@tanstack/react-query';
import {
    fetchAgents,
    fetchMaps,
    fetchWeapons,
    fetchContentTiers,
    type Agent,
    type MapData,
    type Weapon,
    type ContentTier
} from '../services/api';

export const useAgents = () => {
    return useQuery<Agent[]>({
        queryKey: ['agents'],
        queryFn: fetchAgents
    });
};

export const useMaps = () => {
    return useQuery<MapData[]>({
        queryKey: ['maps'],
        queryFn: fetchMaps
    });
};

export const useWeapons = () => {
    return useQuery<Weapon[]>({
        queryKey: ['weapons'],
        queryFn: fetchWeapons
    });
};

export const useContentTiers = () => {
    return useQuery<ContentTier[]>({
        queryKey: ['contentTiers'],
        queryFn: fetchContentTiers
    });
};
