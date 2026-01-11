import { Skeleton } from '../ui/Skeleton';

export function ProfileSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Basic Info Card */}
            <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                <div className="mb-6">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <Skeleton className="h-9 w-32 rounded-lg" />
                    </div>

                    {/* Name & Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-11 w-full rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Resume Card */}
            <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                <div className="mb-6">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-44 rounded-lg" />
            </div>

            {/* Social Links Card */}
            <div className="bg-cms-bg-card border border-cms-border rounded-xl p-6">
                <div className="mb-6">
                    <Skeleton className="h-6 w-28 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
