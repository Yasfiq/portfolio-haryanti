import { FolderOpen, Eye, Mail, MailOpen, Lightbulb, Briefcase, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';
import { useDashboardStats } from '../hooks/useDashboard';
import { useToastHelpers } from '../context/ToastContext';
import { useEffect } from 'react';
import type { RecentMessage } from '../types/dashboard.types';

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    if (diffInDays < 7) return `${diffInDays} hari lalu`;

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function Dashboard() {
    const { data, isLoading, isError, error } = useDashboardStats();
    const toast = useToastHelpers();

    // Show error toast when fetch fails
    useEffect(() => {
        if (isError && error) {
            toast.error('Gagal memuat data', error.message);
        }
    }, [isError, error, toast]);

    // Loading state - show skeleton
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    // Error state
    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Dashboard
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md">
                    Terjadi kesalahan saat memuat data. Silakan coba lagi nanti atau refresh halaman.
                </p>
            </div>
        );
    }

    // Build stats array from API data
    const stats = [
        { label: 'Total Projects', value: data.totalProjects, icon: FolderOpen, color: 'text-cms-accent' },
        { label: 'Visible Projects', value: data.visibleProjects, icon: Eye, color: 'text-cms-success' },
        { label: 'Unread Messages', value: data.unreadMessages, icon: Mail, color: 'text-cms-warning' },
        { label: 'Total Messages', value: data.totalMessages, icon: MailOpen, color: 'text-cms-text-secondary' },
        { label: 'Skills', value: data.skills, icon: Lightbulb, color: 'text-blue-400' },
        { label: 'Experiences', value: data.experiences, icon: Briefcase, color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-cms-bg-secondary ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-cms-text-primary">{stat.value}</p>
                            <p className="text-sm text-cms-text-secondary">{stat.label}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-cms-text-primary">Recent Messages</h3>
                        <a href="/messages" className="text-sm text-cms-accent hover:text-cms-accent-hover">
                            View All →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {data.recentMessages.length === 0 ? (
                            <p className="text-cms-text-muted text-sm py-4 text-center">
                                Belum ada pesan
                            </p>
                        ) : (
                            data.recentMessages.map((msg: RecentMessage) => (
                                <div
                                    key={msg.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-cms-bg-hover transition-colors"
                                >
                                    <div className={`w-2 h-2 rounded-full mt-2 ${msg.isRead ? 'bg-cms-text-muted' : 'bg-cms-accent'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-medium text-cms-text-primary truncate">{msg.name}</p>
                                            <span className="text-xs text-cms-text-muted whitespace-nowrap">
                                                {formatRelativeTime(msg.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-cms-text-secondary truncate">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Quick Links */}
                <Card>
                    <h3 className="text-lg font-semibold text-cms-text-primary mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href="/projects/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-cms-bg-secondary border border-cms-border hover:border-cms-accent hover:bg-cms-bg-hover transition-all"
                        >
                            <FolderOpen size={20} className="text-cms-accent" />
                            <span className="text-sm font-medium text-cms-text-primary">Add Project</span>
                        </a>
                        <a
                            href="/profile"
                            className="flex items-center gap-3 p-4 rounded-xl bg-cms-bg-secondary border border-cms-border hover:border-cms-accent hover:bg-cms-bg-hover transition-all"
                        >
                            <Eye size={20} className="text-cms-accent" />
                            <span className="text-sm font-medium text-cms-text-primary">Edit Profile</span>
                        </a>
                        <a
                            href="/skills"
                            className="flex items-center gap-3 p-4 rounded-xl bg-cms-bg-secondary border border-cms-border hover:border-cms-accent hover:bg-cms-bg-hover transition-all"
                        >
                            <Lightbulb size={20} className="text-cms-accent" />
                            <span className="text-sm font-medium text-cms-text-primary">Manage Skills</span>
                        </a>
                        <a
                            href="/experience"
                            className="flex items-center gap-3 p-4 rounded-xl bg-cms-bg-secondary border border-cms-border hover:border-cms-accent hover:bg-cms-bg-hover transition-all"
                        >
                            <Briefcase size={20} className="text-cms-accent" />
                            <span className="text-sm font-medium text-cms-text-primary">Add Experience</span>
                        </a>
                    </div>
                </Card>
            </div>

            {/* Portfolio Preview Link */}
            <Card className="bg-gradient-to-r from-cms-accent/10 to-cms-accent/5 border-cms-accent/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-cms-text-primary">Preview Portfolio</h3>
                        <p className="text-sm text-cms-text-secondary mt-1">
                            Lihat tampilan portfolio Anda
                        </p>
                    </div>
                    <a
                        href="http://localhost:3000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-cms-accent text-black font-medium rounded-lg hover:bg-cms-accent-hover transition-colors"
                    >
                        Open Portfolio →
                    </a>
                </div>
            </Card>
        </div>
    );
}
