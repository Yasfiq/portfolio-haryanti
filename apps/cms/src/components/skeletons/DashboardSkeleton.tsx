import { SkeletonCard, SkeletonMessageItem, Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages Skeleton */}
                <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonMessageItem key={i} />
                        ))}
                    </div>
                </div>

                {/* Quick Links Skeleton */}
                <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                    <Skeleton className="h-5 w-28 mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Preview Skeleton */}
            <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
