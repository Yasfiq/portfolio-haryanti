import { Skeleton } from '../ui/Skeleton';

export function MessagesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-cms-bg-card border border-cms-border rounded-xl overflow-hidden">
                <div className="divide-y divide-cms-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-4">
                            {/* Icon */}
                            <Skeleton className="w-5 h-5 rounded mt-1" />

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-4 w-full" />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="w-8 h-8 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
