import { Skeleton } from '../ui/Skeleton';

export function ExperiencesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-36 rounded-lg" />
            </div>

            {/* Experience List */}
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 p-6 bg-cms-bg-card border border-cms-border rounded-xl"
                    >
                        {/* Drag handle */}
                        <Skeleton className="w-5 h-5 mt-1" />

                        {/* Logo */}
                        <Skeleton className="w-12 h-12 rounded-lg" />

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>

                            <div className="space-y-1 mt-3">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
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

export function ExperienceEditSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back button */}
            <Skeleton className="h-5 w-32" />

            {/* Basic Info Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Description Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
