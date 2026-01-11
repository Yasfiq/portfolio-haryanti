import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';

export function ProjectsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-cms-border">
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-12" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-10" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-14" />
                                </th>
                                <th className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-cms-border">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-4 h-4" />
                                            <Skeleton className="w-12 h-12 rounded-lg" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-28" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-24" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="w-8 h-8 rounded-lg" />
                                            <Skeleton className="w-8 h-8 rounded-lg" />
                                            <Skeleton className="w-8 h-8 rounded-lg" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export function ProjectEditSkeleton() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back button */}
            <Skeleton className="h-10 w-24 rounded-lg" />

            {/* Basic Info Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Media Card */}
            <div className="p-6 bg-cms-bg-card border border-cms-border rounded-xl space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            {/* Save button */}
            <div className="flex justify-end gap-4">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
        </div>
    );
}
