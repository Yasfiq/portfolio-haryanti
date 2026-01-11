import { describe, it, expect } from 'vitest';
import { cn, formatDate } from '../utils';

describe('cn utility', () => {
    it('should merge class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
        expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
    });

    it('should combine multiple tailwind classes', () => {
        // cn uses clsx + twMerge - just combines classes
        const result = cn('px-2 py-1', 'px-4');
        expect(result).toContain('py-1');
        expect(result).toContain('px-4');
    });

    it('should handle undefined values', () => {
        expect(cn('base', undefined, null, 'end')).toBe('base end');
    });
});

describe('formatDate utility', () => {
    it('should format date string correctly', () => {
        const result = formatDate('2024-01-15');
        expect(result).toContain('2024');
    });

    it('should handle Date object', () => {
        const date = new Date('2024-06-20');
        const result = formatDate(date);
        expect(result).toContain('2024');
    });

    it('should throw for invalid date', () => {
        // formatDate throws RangeError for invalid dates
        expect(() => formatDate('invalid')).toThrow();
    });
});
