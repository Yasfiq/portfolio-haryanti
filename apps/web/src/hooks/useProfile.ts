import { useQuery } from '@tanstack/react-query';
import type { Profile } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useProfile() {
    return useQuery<Profile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/profile`);
            if (!res.ok) throw new Error('Failed to fetch profile');
            return res.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
