import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Service,
    CreateServiceInput,
    UpdateServiceInput,
    ReorderServiceInput
} from '../types/service.types';

// Query keys
export const serviceKeys = {
    all: ['services'] as const,
    list: () => [...serviceKeys.all, 'list'] as const,
};

// API functions
async function fetchServices(): Promise<Service[]> {
    return apiClient.get<Service[]>('/services');
}

async function createService(data: CreateServiceInput): Promise<Service> {
    return apiClient.post<Service>('/services', data);
}

async function updateService({ id, data }: { id: string; data: UpdateServiceInput }): Promise<Service> {
    return apiClient.put<Service>(`/services/${id}`, data);
}

async function deleteService(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/services/${id}`);
}

async function reorderServices(data: ReorderServiceInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/services/reorder', data);
}

/**
 * Hook to fetch all services
 */
export function useServices() {
    return useQuery({
        queryKey: serviceKeys.list(),
        queryFn: fetchServices,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to create a new service
 */
export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.list() });
        },
    });
}

/**
 * Hook to update a service
 */
export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.list() });
        },
    });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.list() });
        },
    });
}

/**
 * Hook to reorder services with optimistic updates
 */
export function useReorderServices() {
    const queryClient = useQueryClient();
    const cacheKey = serviceKeys.list();

    return useMutation({
        mutationFn: reorderServices,
        onMutate: async (newOrder: ReorderServiceInput) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });

            const previousServices = queryClient.getQueryData<Service[]>(cacheKey);

            if (previousServices) {
                const reorderedServices = newOrder.items
                    .map(item => previousServices.find(s => s.id === item.id)!)
                    .filter(Boolean);

                queryClient.setQueryData(cacheKey, reorderedServices);
            }

            return { previousServices };
        },
        onError: (_err, _newOrder, context) => {
            if (context?.previousServices) {
                queryClient.setQueryData(cacheKey, context.previousServices);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: serviceKeys.all });
        },
    });
}
