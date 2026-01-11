import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Message } from '../types/message.types';

// Query keys
export const messageKeys = {
    all: ['messages'] as const,
    list: () => [...messageKeys.all, 'list'] as const,
    detail: (id: string) => [...messageKeys.all, 'detail', id] as const,
};

// API functions
async function fetchMessages(): Promise<Message[]> {
    return apiClient.get<Message[]>('/messages');
}

async function fetchMessage(id: string): Promise<Message> {
    return apiClient.get<Message>(`/messages/${id}`);
}

async function toggleMessageRead(id: string): Promise<Message> {
    return apiClient.patch<Message>(`/messages/${id}/read`);
}

async function deleteMessage(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/messages/${id}`);
}

/**
 * Hook to fetch all messages
 */
export function useMessages() {
    return useQuery({
        queryKey: messageKeys.list(),
        queryFn: fetchMessages,
        staleTime: 30 * 1000, // 30 seconds - messages may come frequently
    });
}

/**
 * Hook to fetch a single message
 */
export function useMessage(id: string) {
    return useQuery({
        queryKey: messageKeys.detail(id),
        queryFn: () => fetchMessage(id),
        enabled: !!id,
    });
}

/**
 * Hook to toggle message read status
 */
export function useToggleMessageRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleMessageRead,
        onSuccess: (updatedMessage) => {
            // Update the specific message in the list cache
            queryClient.setQueryData<Message[]>(messageKeys.list(), (oldMessages) => {
                if (!oldMessages) return oldMessages;
                return oldMessages.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                );
            });
            // Also update the detail cache if exists
            queryClient.setQueryData(messageKeys.detail(updatedMessage.id), updatedMessage);
        },
    });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMessage,
        onSuccess: (_, deletedId) => {
            // Remove the message from the list cache
            queryClient.setQueryData<Message[]>(messageKeys.list(), (oldMessages) => {
                if (!oldMessages) return oldMessages;
                return oldMessages.filter((msg) => msg.id !== deletedId);
            });
            // Invalidate to ensure count is accurate
            queryClient.invalidateQueries({ queryKey: messageKeys.list() });
        },
    });
}
