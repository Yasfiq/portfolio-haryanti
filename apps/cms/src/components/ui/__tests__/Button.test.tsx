import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button component', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('renders with primary variant', () => {
        render(<Button variant="primary">Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-cms-accent');
    });

    it('renders with secondary variant', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-cms-border');
    });

    it('renders with danger variant', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button');
        // Danger variant uses bg-cms-error/10 for subtle appearance
        expect(button).toHaveClass('text-cms-error');
    });

    it('shows loading state', () => {
        render(<Button isLoading>Loading</Button>);
        const button = screen.getByRole('button');
        // isLoading disables the button
        expect(button).toBeDisabled();
    });

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        let clicked = false;
        render(<Button onClick={() => (clicked = true)}>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        let clicked = false;
        render(<Button disabled onClick={() => (clicked = true)}>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(false);
    });
});
