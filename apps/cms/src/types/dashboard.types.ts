// Dashboard API types

export interface DashboardStats {
    totalProjects: number;
    visibleProjects: number;
    unreadMessages: number;
    totalMessages: number;
    skills: number;
    experiences: number;
    recentMessages: RecentMessage[];
}

export interface RecentMessage {
    id: string;
    name: string;
    email: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}
