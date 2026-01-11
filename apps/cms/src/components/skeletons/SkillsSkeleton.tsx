import { Skeleton } from '../ui/Skeleton';

export function SkillsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-cms-border pb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-28 rounded-lg" />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 p-6 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        {/* Drag handle */}
                        <Skeleton className="w-4 h-4 mt-0.5" />

                        {/* Icon */}
                        <Skeleton className="w-10 h-10 rounded-lg" />

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-7 h-7 rounded" />
                            <Skeleton className="w-7 h-7 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
