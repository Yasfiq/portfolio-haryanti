import { Skeleton } from '../ui/Skeleton';

export function SettingsSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Branding Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-48" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>

                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
            </div>

            {/* Color Theme Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-56" />
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="w-24 h-9 rounded-lg" />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-10 rounded-lg" />
                            <Skeleton className="flex-1 h-10 rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-10 rounded-lg" />
                            <Skeleton className="flex-1 h-10 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* CTA Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}
