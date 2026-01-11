import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: 'bg-cms-bg-hover text-cms-text-primary',
        success: 'bg-cms-success/10 text-cms-success',
        warning: 'bg-cms-warning/10 text-cms-warning',
        error: 'bg-cms-error/10 text-cms-error',
        info: 'bg-cms-accent/10 text-cms-accent',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
