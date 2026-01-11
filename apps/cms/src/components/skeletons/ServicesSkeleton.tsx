import { Skeleton } from '../ui/Skeleton';

export function ServicesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col p-6 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        {/* Icon */}
                        <Skeleton className="w-12 h-12 rounded-xl mb-4" />

                        {/* Content */}
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-cms-border">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
