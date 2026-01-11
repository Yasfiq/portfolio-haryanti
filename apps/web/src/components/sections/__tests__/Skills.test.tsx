import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skills from '../Skills';

// Mock GSAP
vi.mock('gsap', () => ({
    default: {
        registerPlugin: vi.fn(),
        fromTo: vi.fn(),
    },
}));

vi.mock('gsap/ScrollTrigger', () => ({
    ScrollTrigger: {
        getAll: vi.fn(() => []),
    },
}));

describe('Skills component', () => {
    it('renders section title', () => {
        render(<Skills />);
        expect(screen.getByText(/Skills & Expertise/i)).toBeInTheDocument();
    });

    it('displays hard skills category', () => {
        render(<Skills />);
        expect(screen.getByText('Hard Skills')).toBeInTheDocument();
    });

    it('displays soft skills category', () => {
        render(<Skills />);
        expect(screen.getByText('Soft Skills')).toBeInTheDocument();
    });

    it('shows hard skill items', () => {
        render(<Skills />);
        expect(screen.getByText('Adobe PS')).toBeInTheDocument();
        expect(screen.getByText('Figma')).toBeInTheDocument();
        expect(screen.getByText('Canva Pro')).toBeInTheDocument();
    });

    it('shows soft skill items', () => {
        render(<Skills />);
        expect(screen.getByText('Communication')).toBeInTheDocument();
        expect(screen.getByText('Problem Solving')).toBeInTheDocument();
        expect(screen.getByText('Time Management')).toBeInTheDocument();
    });

    it('shows soft skill descriptions', () => {
        render(<Skills />);
        expect(screen.getByText(/Clear & effective communication/i)).toBeInTheDocument();
        expect(screen.getByText(/Creative solutions for complex/i)).toBeInTheDocument();
    });
});
