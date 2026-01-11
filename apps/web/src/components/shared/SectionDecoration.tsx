import { useSettings } from '../../hooks/useSettings';

interface SectionDecorationProps {
    /** Position of the decoration relative to content */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Custom className for positioning adjustments */
    className?: string;
}

/**
 * Decorative curved lines SVG element.
 * Color automatically uses primary color from CMS settings.
 * Based on client's Figma design reference.
 */
export default function SectionDecoration({
    position = 'top-left',
    size = 'md',
    className = '',
}: SectionDecorationProps) {
    const { data: settings } = useSettings();
    const primaryColor = settings?.primaryColor || '#f37430';

    // Size dimensions
    const sizes = {
        sm: { width: 24, height: 24, strokeWidth: 2 },
        md: { width: 36, height: 36, strokeWidth: 2.5 },
        lg: { width: 48, height: 48, strokeWidth: 3 },
    };

    const { width, height, strokeWidth } = sizes[size];

    // Rotation based on position
    const rotations = {
        'top-left': 0,
        'top-right': 90,
        'bottom-right': 180,
        'bottom-left': 270,
    };

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none ${className}`}
            style={{ transform: `rotate(${rotations[position]}deg)` }}
            aria-hidden="true"
        >
            {/* Main curved line */}
            <path
                d="M8 40C8 24 24 8 40 8"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {/* Secondary accent line */}
            <path
                d="M16 40C16 28 28 16 40 16"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity="0.6"
            />
            {/* Small accent mark */}
            <path
                d="M4 32L12 24"
                stroke={primaryColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Sparkle/star decoration for titles.
 * Used near greeting bubbles like "Hello!"
 */
export function SparkleDecoration({
    size = 'md',
    className = '',
}: {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    const { data: settings } = useSettings();
    const primaryColor = settings?.primaryColor || '#f37430';

    const sizes = {
        sm: 16,
        md: 24,
        lg: 32,
    };

    const dimension = sizes[size];

    return (
        <svg
            width={dimension}
            height={dimension}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {/* Sparkle lines */}
            <path
                d="M12 2V6M12 18V22M2 12H6M18 12H22"
                stroke={primaryColor}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M5 5L7.5 7.5M16.5 16.5L19 19M5 19L7.5 16.5M16.5 7.5L19 5"
                stroke={primaryColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
            />
        </svg>
    );
}
