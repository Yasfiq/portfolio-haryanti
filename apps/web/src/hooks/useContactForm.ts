import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface SendMessageResponse {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

/**
 * Hook for sending contact form messages to the backend
 * Uses React Query mutation for proper state management
 */
export function useContactForm() {
    return useMutation<SendMessageResponse, Error, ContactFormData>({
        mutationFn: async (data: ContactFormData) => {
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Failed to send message');
            }

            return response.json();
        },
    });
}
