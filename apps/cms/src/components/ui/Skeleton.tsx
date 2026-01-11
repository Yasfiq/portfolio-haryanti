import { type ReactNode, type CSSProperties } from 'react';
import clsx from 'clsx';

interface SkeletonProps {
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
}

// Base skeleton component with pulse animation
export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div
            className={clsx(
                'animate-pulse bg-cms-bg-secondary rounded',
                className
            )}
            style={style}
        />
    );
}

// Text skeleton - single line
export function SkeletonText({ className, width = 'w-full' }: { className?: string; width?: string }) {
    return (
        <Skeleton className={clsx('h-4', width, className)} />
    );
}

// Card-shaped skeleton
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={clsx('bg-cms-bg-card border border-cms-border rounded-xl p-6', className)}>
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
}

// Circle skeleton (for avatars)
export function SkeletonCircle({ size = 40 }: { size?: number }) {
    return (
        <Skeleton
            className="rounded-full"
            style={{ width: size, height: size }}
        />
    );
}

// Message item skeleton
export function SkeletonMessageItem() {
    return (
        <div className="flex items-start gap-3 p-3">
            <Skeleton className="w-2 h-2 rounded-full mt-2" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}
