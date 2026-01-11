import { useQuery } from '@tanstack/react-query';
import type { Experience } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useExperiences() {
    return useQuery<Experience[]>({
        queryKey: ['experiences'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/experiences`);
            if (!res.ok) throw new Error('Failed to fetch experiences');
            return res.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
