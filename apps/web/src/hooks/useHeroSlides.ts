import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { HeroSlide } from '../types';

/**
 * Fetch visible hero slides (sorted by order)
 */
export function useHeroSlides() {
    return useQuery({
        queryKey: ['hero-slides'],
        queryFn: () => api.get<HeroSlide[]>('/hero-slides/visible'),
    });
}
