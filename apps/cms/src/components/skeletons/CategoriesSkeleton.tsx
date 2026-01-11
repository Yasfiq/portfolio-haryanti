import { Skeleton } from '../ui/Skeleton';

export function CategoriesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Subheader */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Categories List */}
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        {/* Drag handle */}
                        <Skeleton className="w-5 h-5" />

                        {/* Icon */}
                        <Skeleton className="w-10 h-10 rounded-lg" />

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-8 h-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
