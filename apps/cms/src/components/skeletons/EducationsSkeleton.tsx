import { Skeleton } from '../ui/Skeleton';

export function EducationsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

            {/* Education Cards */}
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="p-6 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon placeholder */}
                            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                                <Skeleton className="w-8 h-8 rounded-lg" />
                                <Skeleton className="w-8 h-8 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
