import { Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserDropdown from './UserDropdown';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

/**
 * CMS Header component with page title, notifications, and user menu
 * Integrates with backend for real-time notification count and user profile
 */
export default function Header({ title, onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 bg-cms-bg-secondary border-b border-cms-border flex items-center justify-between px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-cms-text-secondary hover:text-cms-text-primary transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-cms-text-primary">{title}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <NotificationBell />

                {/* User menu */}
                <UserDropdown />
            </div>
        </header>
    );
}
