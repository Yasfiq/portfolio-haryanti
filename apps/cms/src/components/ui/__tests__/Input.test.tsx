import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input component', () => {
    it('renders with default props', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
        render(<Input label="Email" placeholder="Enter email" />);
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('shows error message', () => {
        render(<Input error="This field is required" />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styling when error is present', () => {
        render(<Input error="Error" data-testid="input" />);
        const input = screen.getByTestId('input');
        expect(input).toHaveClass('border-cms-error');
    });

    it('handles text input', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Type here" />);

        const input = screen.getByPlaceholderText('Type here');
        await user.type(input, 'Hello World');

        expect(input).toHaveValue('Hello World');
    });

    it('supports password type', () => {
        render(<Input type="password" placeholder="Password" />);
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });

    it('handles disabled state', () => {
        render(<Input disabled placeholder="Disabled" />);
        expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('renders with custom className', () => {
        render(<Input className="custom-class" data-testid="input" />);
        expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });
});
