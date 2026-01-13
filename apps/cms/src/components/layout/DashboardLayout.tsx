import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/profile': 'Profile',
    '/hero-slides': 'Hero Slides',
    '/portfolios': 'Portfolios',
    '/portfolios/new': 'New Portfolio',
    '/clients': 'Clients',
    '/experience': 'Experience',
    '/experience/new': 'New Experience',
    '/skills': 'Skills',
    '/education': 'Education',
    '/services': 'Services',
    '/messages': 'Messages',
    '/settings': 'Settings',
};

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Get page title based on current path
    const getTitle = () => {
        // Check for exact match first
        if (pageTitles[location.pathname]) {
            return pageTitles[location.pathname];
        }
        // Check for portfolio edit
        if (location.pathname.startsWith('/portfolios/') && location.pathname !== '/portfolios/new') {
            return 'Edit Portfolio';
        }
        return 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-cms-bg-primary">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="lg:ml-64">
                <Header
                    title={getTitle()}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
