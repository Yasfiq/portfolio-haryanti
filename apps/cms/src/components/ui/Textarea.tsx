import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full bg-cms-bg-secondary border rounded-lg px-4 py-3 min-h-[120px] resize-y',
                        'text-cms-text-primary placeholder:text-cms-text-muted',
                        'focus:outline-none focus:ring-1 transition-colors duration-200',
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

Textarea.displayName = 'Textarea';

export default Textarea;
