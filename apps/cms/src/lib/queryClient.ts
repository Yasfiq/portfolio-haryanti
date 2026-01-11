import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data dianggap fresh selama 30 detik
            staleTime: 30 * 1000,
            // Cache data selama 5 menit
            gcTime: 5 * 60 * 1000,
            // Retry 3x dengan exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch saat window focus
            refetchOnWindowFocus: true,
            // Jangan refetch saat reconnect (offline handler akan handle ini)
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry mutations 1x
            retry: 1,
        },
    },
});
