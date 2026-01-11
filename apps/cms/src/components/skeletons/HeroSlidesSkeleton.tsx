import { Skeleton } from '../ui/Skeleton';

export function HeroSlidesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Subheader */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-28 rounded-lg" />
            </div>

            {/* Slides List */}
            <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 p-6 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        {/* Drag handle */}
                        <Skeleton className="w-5 h-5 mt-2" />

                        {/* Preview */}
                        <Skeleton className="w-24 h-16 rounded-lg" />

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-8 h-8 rounded" />
                            <Skeleton className="w-8 h-8 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
