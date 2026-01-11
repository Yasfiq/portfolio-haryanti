import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        'w-full bg-cms-bg-secondary border rounded-lg px-4 py-3',
                        'text-cms-text-primary placeholder:text-cms-text-muted',
                        'focus:outline-none focus:ring-1 transition-colors duration-200',
                        // Dark theme calendar picker icon
                        '[&::-webkit-calendar-picker-indicator]:filter',
                        '[&::-webkit-calendar-picker-indicator]:invert',
                        '[&::-webkit-calendar-picker-indicator]:opacity-60',
                        '[&::-webkit-calendar-picker-indicator]:hover:opacity-100',
                        '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
                        error
                            ? 'border-cms-error focus:border-cms-error focus:ring-cms-error'
                            : 'border-cms-border focus:border-cms-accent focus:ring-cms-accent',
                        className
                    )}
                    {...props}
                />
                {error && <p className="text-xs text-cms-error mt-1">{error}</p>}
                {helperText && !error && (
                    <p className="text-xs text-cms-text-muted mt-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
