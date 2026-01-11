import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { DashboardStats } from '../types/dashboard.types';

const DASHBOARD_QUERY_KEY = ['dashboard', 'stats'];

async function fetchDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
}

export function useDashboardStats() {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEY,
        queryFn: fetchDashboardStats,
        // Refetch every 30 seconds to keep stats fresh
        refetchInterval: 30 * 1000,
        // Keep showing stale data while refetching
        staleTime: 10 * 1000,
    });
}
