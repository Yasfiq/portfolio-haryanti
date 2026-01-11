import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    HeroSlide,
    CreateHeroSlideInput,
    UpdateHeroSlideInput,
    ReorderHeroSlideInput
} from '../types/heroSlide.types';

// Query keys
export const heroSlideKeys = {
    all: ['heroSlides'] as const,
    list: () => [...heroSlideKeys.all, 'list'] as const,
};

// API functions
async function fetchHeroSlides(): Promise<HeroSlide[]> {
    return apiClient.get<HeroSlide[]>('/hero-slides');
}

async function createHeroSlide(data: CreateHeroSlideInput): Promise<HeroSlide> {
    return apiClient.post<HeroSlide>('/hero-slides', data);
}

async function updateHeroSlide({ id, data }: { id: string; data: UpdateHeroSlideInput }): Promise<HeroSlide> {
    return apiClient.put<HeroSlide>(`/hero-slides/${id}`, data);
}

async function toggleHeroSlideVisibility(id: string): Promise<HeroSlide> {
    return apiClient.patch<HeroSlide>(`/hero-slides/${id}/visibility`, {});
}

async function deleteHeroSlide(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/hero-slides/${id}`);
}

async function reorderHeroSlides(data: ReorderHeroSlideInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/hero-slides/reorder', data);
}

/**
 * Hook to fetch all hero slides
 */
export function useHeroSlides() {
    return useQuery({
        queryKey: heroSlideKeys.list(),
        queryFn: fetchHeroSlides,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new hero slide
 */
export function useCreateHeroSlide() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHeroSlide,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: heroSlideKeys.list() });
        },
    });
}

/**
 * Hook to update a hero slide
 */
export function useUpdateHeroSlide() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateHeroSlide,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: heroSlideKeys.list() });
        },
    });
}

/**
 * Hook to toggle hero slide visibility with optimistic update
 */
export function useToggleHeroSlideVisibility() {
    const queryClient = useQueryClient();
    const cacheKey = heroSlideKeys.list();

    return useMutation({
        mutationFn: toggleHeroSlideVisibility,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousSlides = queryClient.getQueryData<HeroSlide[]>(cacheKey);

            if (previousSlides) {
                const updatedSlides = previousSlides.map(slide =>
                    slide.id === id ? { ...slide, isVisible: !slide.isVisible } : slide
                );
                queryClient.setQueryData(cacheKey, updatedSlides);
            }

            return { previousSlides };
        },
        onError: (_err, _id, context) => {
            if (context?.previousSlides) {
                queryClient.setQueryData(cacheKey, context.previousSlides);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: heroSlideKeys.all });
        },
    });
}

/**
 * Hook to delete a hero slide
 */
export function useDeleteHeroSlide() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHeroSlide,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: heroSlideKeys.list() });
        },
    });
}

/**
 * Hook to reorder hero slides with optimistic updates
 */
export function useReorderHeroSlides() {
    const queryClient = useQueryClient();
    const cacheKey = heroSlideKeys.list();

    return useMutation({
        mutationFn: reorderHeroSlides,
        onMutate: async (newOrder: ReorderHeroSlideInput) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousSlides = queryClient.getQueryData<HeroSlide[]>(cacheKey);

            if (previousSlides) {
                const reorderedSlides = newOrder.items
                    .map(item => previousSlides.find(s => s.id === item.id)!)
                    .filter(Boolean);

                queryClient.setQueryData(cacheKey, reorderedSlides);
            }

            return { previousSlides };
        },
        onError: (_err, _newOrder, context) => {
            if (context?.previousSlides) {
                queryClient.setQueryData(cacheKey, context.previousSlides);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: heroSlideKeys.all });
        },
    });
}
