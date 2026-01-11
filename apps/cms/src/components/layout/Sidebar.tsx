import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    User,
    FolderOpen,
    Briefcase,
    Lightbulb,
    GraduationCap,
    Wrench,
    Mail,
    Settings,
    LogOut,
    X,
    Layers,
    Tag,
    Building,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/hero-slides', icon: Layers, label: 'Hero Slides' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/categories', icon: Tag, label: 'Categories' },
    { path: '/clients', icon: Building, label: 'Clients' },
    { path: '/experience', icon: Briefcase, label: 'Experience' },
    { path: '/skills', icon: Lightbulb, label: 'Skills' },
    { path: '/education', icon: GraduationCap, label: 'Education', hidden: true }, // Temporarily hidden per client request
    { path: '/services', icon: Wrench, label: 'Services', hidden: true }, // Temporarily hidden per client request
    { path: '/messages', icon: Mail, label: 'Messages' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout } = useAuth();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-full w-64 bg-cms-bg-secondary border-r border-cms-border z-50',
                    'transform transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-cms-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cms-accent flex items-center justify-center">
                            <span className="text-black font-bold text-sm">H</span>
                        </div>
                        <span className="font-semibold text-cms-text-primary">CMS</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-cms-text-secondary hover:text-cms-text-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.filter(item => !item.hidden).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                                    'transition-all duration-200',
                                    isActive
                                        ? 'bg-cms-accent/10 text-cms-accent'
                                        : 'text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-hover'
                                )
                            }
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-cms-border">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
