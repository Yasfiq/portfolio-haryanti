import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type {
    Portfolio,
    PortfolioImage,
    ClientCategory,
    CreatePortfolioInput,
    UpdatePortfolioInput,
    ReorderPortfolioInput,
    AddGalleryImageInput,
    RemoveGalleryImagesInput,
    CreateClientCategoryInput,
    UpdateClientCategoryInput,
} from '../types/portfolio.types';

// Query keys
export const portfolioKeys = {
    all: ['portfolios'] as const,
    list: (filters?: { visible?: boolean }) => [...portfolioKeys.all, 'list', filters] as const,
    detail: (id: string) => [...portfolioKeys.all, 'detail', id] as const,
    bySlug: (slug: string) => [...portfolioKeys.all, 'slug', slug] as const,
    categories: ['portfolios', 'categories'] as const,
    categoriesByClient: (clientId: string) => ['portfolios', 'categories', 'client', clientId] as const,
};

// ========== Portfolio API functions ==========

async function fetchPortfolios(): Promise<Portfolio[]> {
    return apiClient.get<Portfolio[]>('/portfolios');
}

async function fetchPortfolio(id: string): Promise<Portfolio> {
    return apiClient.get<Portfolio>(`/portfolios/${id}`);
}

async function createPortfolio(data: CreatePortfolioInput): Promise<Portfolio> {
    return apiClient.post<Portfolio>('/portfolios', data);
}

async function updatePortfolio({ id, data }: { id: string; data: UpdatePortfolioInput }): Promise<Portfolio> {
    return apiClient.put<Portfolio>(`/portfolios/${id}`, data);
}

async function deletePortfolio(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/portfolios/${id}`);
}

async function togglePortfolioVisibility(id: string): Promise<Portfolio> {
    return apiClient.patch<Portfolio>(`/portfolios/${id}/visibility`);
}

async function reorderPortfolios(data: ReorderPortfolioInput): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>('/portfolios/reorder', data);
}

async function addGalleryImage({ portfolioId, data }: { portfolioId: string; data: AddGalleryImageInput }): Promise<PortfolioImage> {
    return apiClient.post<PortfolioImage>(`/portfolios/${portfolioId}/gallery`, data);
}

async function removeGalleryImages({ portfolioId, data }: { portfolioId: string; data: RemoveGalleryImagesInput }): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/portfolios/${portfolioId}/gallery`, data);
}

// ========== Category API functions ==========

async function fetchAllCategories(): Promise<ClientCategory[]> {
    return apiClient.get<ClientCategory[]>('/portfolios/categories');
}

async function fetchCategoriesByClient(clientId: string): Promise<ClientCategory[]> {
    return apiClient.get<ClientCategory[]>(`/portfolios/client/${clientId}/categories`);
}

async function createCategory({ clientId, data }: { clientId: string; data: CreateClientCategoryInput }): Promise<ClientCategory> {
    return apiClient.post<ClientCategory>(`/portfolios/client/${clientId}/categories`, data);
}

async function updateCategory({ id, data }: { id: string; data: UpdateClientCategoryInput }): Promise<ClientCategory> {
    return apiClient.put<ClientCategory>(`/portfolios/categories/${id}`, data);
}

async function deleteCategory(id: string): Promise<ClientCategory> {
    return apiClient.delete<ClientCategory>(`/portfolios/categories/${id}`);
}

// ========== Portfolio Hooks ==========

export function usePortfolios() {
    return useQuery({
        queryKey: portfolioKeys.list(),
        queryFn: fetchPortfolios,
        staleTime: 5 * 60 * 1000,
    });
}

export function usePortfolio(id: string | undefined) {
    return useQuery({
        queryKey: portfolioKeys.detail(id!),
        queryFn: () => fetchPortfolio(id!),
        enabled: !!id && id !== 'new',
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreatePortfolio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPortfolio,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
        },
    });
}

export function useUpdatePortfolio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePortfolio,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
            queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(data.id) });
        },
    });
}

export function useDeletePortfolio() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePortfolio,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
        },
    });
}

export function useTogglePortfolioVisibility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: togglePortfolioVisibility,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: portfolioKeys.list() });
            const previousPortfolios = queryClient.getQueryData<Portfolio[]>(portfolioKeys.list());

            if (previousPortfolios) {
                queryClient.setQueryData(
                    portfolioKeys.list(),
                    previousPortfolios.map(p =>
                        p.id === id ? { ...p, isVisible: !p.isVisible } : p
                    )
                );
            }

            return { previousPortfolios };
        },
        onError: (_err, _id, context) => {
            if (context?.previousPortfolios) {
                queryClient.setQueryData(portfolioKeys.list(), context.previousPortfolios);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
        },
    });
}

export function useReorderPortfolios() {
    const queryClient = useQueryClient();
    const cacheKey = portfolioKeys.list();

    return useMutation({
        mutationFn: reorderPortfolios,
        onMutate: async (newOrder: ReorderPortfolioInput) => {
            await queryClient.cancelQueries({ queryKey: cacheKey });
            const previousPortfolios = queryClient.getQueryData<Portfolio[]>(cacheKey);

            if (previousPortfolios) {
                const reorderedPortfolios = newOrder.items
                    .map(item => previousPortfolios.find(p => p.id === item.id)!)
                    .filter(Boolean);

                queryClient.setQueryData(cacheKey, reorderedPortfolios);
            }

            return { previousPortfolios };
        },
        onError: (_err, _newOrder, context) => {
            if (context?.previousPortfolios) {
                queryClient.setQueryData(cacheKey, context.previousPortfolios);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
        },
    });
}

export function useAddGalleryImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addGalleryImage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(variables.portfolioId) });
        },
    });
}

export function useRemoveGalleryImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeGalleryImages,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(variables.portfolioId) });
        },
    });
}

// ========== Category Hooks ==========

export function useClientCategories() {
    return useQuery({
        queryKey: portfolioKeys.categories,
        queryFn: fetchAllCategories,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCategoriesByClient(clientId: string | undefined) {
    return useQuery({
        queryKey: portfolioKeys.categoriesByClient(clientId!),
        queryFn: () => fetchCategoriesByClient(clientId!),
        enabled: !!clientId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.categories });
            queryClient.invalidateQueries({ queryKey: portfolioKeys.categoriesByClient(variables.clientId) });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.categories });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: portfolioKeys.categories });
        },
    });
}
