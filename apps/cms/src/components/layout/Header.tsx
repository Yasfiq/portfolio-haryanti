import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-cms-bg-secondary border-b border-cms-border flex items-center justify-between px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-cms-text-secondary hover:text-cms-text-primary transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-cms-text-primary">{title}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-hover rounded-lg transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-cms-accent rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-cms-border">
                    <div className="w-8 h-8 rounded-full bg-cms-accent/20 flex items-center justify-center">
                        <User size={16} className="text-cms-accent" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-cms-text-primary">
                            {user?.email?.split('@')[0] || 'Admin'}
                        </p>
                        <p className="text-xs text-cms-text-secondary">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
