import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

// Mock GSAP
vi.mock('gsap', () => ({
    default: {
        registerPlugin: vi.fn(),
        to: vi.fn(() => ({
            kill: vi.fn(),
        })),
    },
}));

vi.mock('gsap/ScrollTrigger', () => ({
    ScrollTrigger: {
        getAll: vi.fn(() => []),
    },
}));

describe('Hero component', () => {
    it('renders without crashing', () => {
        render(<Hero />);
        // Should render the first panel title
        expect(screen.getByText(/Hello, I'm Haryanti/i)).toBeInTheDocument();
    });

    it('displays all panel titles', () => {
        render(<Hero />);
        expect(screen.getByText(/Hello, I'm Haryanti/i)).toBeInTheDocument();
        expect(screen.getByText(/Creating Visual Stories/i)).toBeInTheDocument();
        expect(screen.getByText(/Bringing Ideas to Life/i)).toBeInTheDocument();
        expect(screen.getByText(/Let's Work Together/i)).toBeInTheDocument();
    });

    it('shows role titles', () => {
        render(<Hero />);
        expect(screen.getByText(/Graphic Designer/i)).toBeInTheDocument();
        expect(screen.getByText(/Content Creator/i)).toBeInTheDocument();
    });

    it('has scroll indicator', () => {
        render(<Hero />);
        expect(screen.getByText('Scroll')).toBeInTheDocument();
    });
});
