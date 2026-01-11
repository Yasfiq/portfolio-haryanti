import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Project,
    ProjectImage,
    CreateProjectInput,
    UpdateProjectInput,
    ReorderProjectInput,
    AddGalleryImageInput,
    RemoveGalleryImagesInput
} from '../types/project.types';

// Query keys
export const projectKeys = {
    all: ['projects'] as const,
    list: (filters?: { visible?: boolean }) => [...projectKeys.all, 'list', filters] as const,
    detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
    bySlug: (slug: string) => [...projectKeys.all, 'slug', slug] as const,
};

// API functions
async function fetchProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>('/projects');
}

async function fetchProject(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
}

async function createProject(data: CreateProjectInput): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
}

async function updateProject({ id, data }: { id: string; data: UpdateProjectInput }): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
}

async function deleteProject(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/projects/${id}`);
}

async function toggleProjectVisibility(id: string): Promise<Project> {
    return apiClient.patch<Project>(`/projects/${id}/visibility`);
}

async function reorderProjects(data: ReorderProjectInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/projects/reorder', data);
}

async function addGalleryImage({ projectId, data }: { projectId: string; data: AddGalleryImageInput }): Promise<ProjectImage> {
    return apiClient.post<ProjectImage>(`/projects/${projectId}/gallery`, data);
}

async function removeGalleryImages({ projectId, data }: { projectId: string; data: RemoveGalleryImagesInput }): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/projects/${projectId}/gallery`, data);
}

/**
 * Hook to fetch all projects
 */
export function useProjects() {
    return useQuery({
        queryKey: projectKeys.list(),
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(id: string | undefined) {
    return useQuery({
        queryKey: projectKeys.detail(id!),
        queryFn: () => fetchProject(id!),
        enabled: !!id && id !== 'new',
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
        },
    });
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.id) });
        },
    });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
        },
    });
}

/**
 * Hook to toggle project visibility
 */
export function useToggleProjectVisibility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleProjectVisibility,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: projectKeys.list() });
            const previousProjects = queryClient.getQueryData<Project[]>(projectKeys.list());

            if (previousProjects) {
                queryClient.setQueryData(
                    projectKeys.list(),
                    previousProjects.map(p =>
                        p.id === id ? { ...p, isVisible: !p.isVisible } : p
                    )
                );
            }

            return { previousProjects };
        },
        onError: (_err, _id, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(projectKeys.list(), context.previousProjects);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
        },
    });
}

/**
 * Hook to reorder projects with optimistic updates
 */
export function useReorderProjects() {
    const queryClient = useQueryClient();
    const cacheKey = projectKeys.list();

    return useMutation({
        mutationFn: reorderProjects,
        onMutate: async (newOrder: ReorderProjectInput) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });
            const previousProjects = queryClient.getQueryData<Project[]>(cacheKey);

            if (previousProjects) {
                const reorderedProjects = newOrder.items
                    .map(item => previousProjects.find(p => p.id === item.id)!)
                    .filter(Boolean);

                queryClient.setQueryData(cacheKey, reorderedProjects);
            }

            return { previousProjects };
        },
        onError: (_err, _newOrder, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(cacheKey, context.previousProjects);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        },
    });
}

/**
 * Hook to add gallery image to a project
 */
export function useAddGalleryImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addGalleryImage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
        },
    });
}

/**
 * Hook to remove gallery images from a project
 */
export function useRemoveGalleryImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeGalleryImages,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
        },
    });
}

