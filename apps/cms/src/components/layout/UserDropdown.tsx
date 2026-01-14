import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * User dropdown menu component for the header
 * Displays user info, avatar, and navigation/logout options
 */
export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Extract username from email
    const username = user?.email?.split('@')[0] || 'Admin';

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard escape to close
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
        navigate('/login');
    };

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    const menuItems = [
        {
            label: 'Profile',
            icon: UserCircle,
            onClick: () => handleNavigate('/profile'),
        },
        {
            label: 'Settings',
            icon: Settings,
            onClick: () => handleNavigate('/settings'),
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-4 border-l border-cms-border hover:bg-cms-bg-hover rounded-lg transition-all p-2 -m-2"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-cms-accent/20 flex items-center justify-center overflow-hidden">
                    <User size={16} className="text-cms-accent" />
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-cms-text-primary">
                        {username}
                    </p>
                    <p className="text-xs text-cms-text-secondary">Administrator</p>
                </div>

                {/* Dropdown indicator */}
                <ChevronDown
                    size={16}
                    className={`hidden sm:block text-cms-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-cms-bg-secondary border border-cms-border rounded-xl shadow-lg overflow-hidden z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-cms-border bg-cms-bg-hover/50">
                        <p className="text-sm font-medium text-cms-text-primary truncate">
                            {username}
                        </p>
                        <p className="text-xs text-cms-text-secondary truncate">
                            {user?.email}
                        </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cms-text-primary hover:bg-cms-bg-hover transition-colors"
                            >
                                <item.icon size={18} className="text-cms-text-secondary" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-cms-border py-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cms-error hover:bg-cms-error/10 transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
