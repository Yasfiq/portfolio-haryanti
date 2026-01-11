import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Skill,
    SkillCategory,
    CreateSkillInput,
    UpdateSkillInput,
    ReorderSkillInput
} from '../types/skill.types';

// Query keys
export const skillKeys = {
    all: ['skills'] as const,
    list: (category?: SkillCategory) => [...skillKeys.all, 'list', category] as const,
};

// API functions
async function fetchSkills(category?: SkillCategory): Promise<Skill[]> {
    const endpoint = category ? `/skills?category=${category}` : '/skills';
    return apiClient.get<Skill[]>(endpoint);
}

async function createSkill(data: CreateSkillInput): Promise<Skill> {
    return apiClient.post<Skill>('/skills', data);
}

async function updateSkill({ id, data }: { id: string; data: UpdateSkillInput }): Promise<Skill> {
    return apiClient.put<Skill>(`/skills/${id}`, data);
}

async function deleteSkill(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/skills/${id}`);
}

async function reorderSkills(data: ReorderSkillInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/skills/reorder', data);
}

/**
 * Hook to fetch all skills (optionally filtered by category)
 */
export function useSkills(category?: SkillCategory) {
    return useQuery({
        queryKey: skillKeys.list(category),
        queryFn: () => fetchSkills(category),
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new skill
 */
export function useCreateSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSkill,
        onSuccess: () => {
            // Invalidate all skill lists
            queryClient.invalidateQueries({ queryKey: skillKeys.all });
        },
    });
}

/**
 * Hook to update a skill
 */
export function useUpdateSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: skillKeys.all });
        },
    });
}

/**
 * Hook to delete a skill
 */
export function useDeleteSkill() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: skillKeys.all });
        },
    });
}

/**
 * Hook to reorder skills with optimistic updates
 * Works with the unfiltered skills list cache
 */
export function useReorderSkills(category: SkillCategory) {
    const queryClient = useQueryClient();
    // Use unfiltered cache key to match useSkills() without parameter
    const cacheKey = skillKeys.list(undefined);

    return useMutation({
        mutationFn: reorderSkills,
        // Optimistic update
        onMutate: async (newOrder: ReorderSkillInput) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousSkills = queryClient.getQueryData<Skill[]>(cacheKey);

            if (previousSkills) {
                // Separate skills by category
                const otherCategorySkills = previousSkills.filter(s => s.category !== category);
                const categorySkills = previousSkills.filter(s => s.category === category);

                // Reorder only the affected category
                const reorderedCategorySkills = newOrder.items
                    .map(item => categorySkills.find(skill => skill.id === item.id)!)
                    .filter(Boolean);

                // Merge back: other category + reordered category
                const mergedSkills = [...otherCategorySkills, ...reorderedCategorySkills];

                queryClient.setQueryData(cacheKey, mergedSkills);
            }

            return { previousSkills };
        },
        onError: (_err, _newOrder, context) => {
            if (context?.previousSkills) {
                queryClient.setQueryData(cacheKey, context.previousSkills);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: skillKeys.all });
        },
    });
}

