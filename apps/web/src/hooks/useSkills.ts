import { useQuery } from '@tanstack/react-query';
import type { Skill } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useSkills() {
    return useQuery<Skill[]>({
        queryKey: ['skills'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/skills`);
            if (!res.ok) throw new Error('Failed to fetch skills');
            return res.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
