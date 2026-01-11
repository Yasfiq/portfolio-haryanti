import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md', ...props }: CardProps) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                'bg-cms-bg-card border border-cms-border rounded-xl',
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-cms-text-primary">{title}</h2>
                {description && (
                    <p className="text-sm text-cms-text-secondary mt-1">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export default Card;
