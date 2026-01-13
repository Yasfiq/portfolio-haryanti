import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToastHelpers } from './context/ToastContext';
import { OfflineProvider } from './context/OfflineContext';
import { authEvents, type LogoutReason } from './lib/apiClient';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HeroSlides from './pages/HeroSlides';
import Clients from './pages/Clients';
import Experience from './pages/Experience';
import ExperienceEdit from './pages/ExperienceEdit';
import Skills from './pages/Skills';
import Services from './pages/Services';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Education from './pages/Education';

import './index.css';

// Auth Event Listener - handles auto-logout from API client
function AuthEventListener() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToastHelpers();

    useEffect(() => {
        const unsubscribe = authEvents.on('logout', (reason?: LogoutReason) => {
            logout();
            navigate('/login', { replace: true });

            // Show appropriate toast based on reason
            switch (reason) {
                case 'session_expired':
                    toast.warning('Session Expired', 'Your session has expired. Please login again.');
                    break;
                case 'unauthorized':
                    toast.error('Unauthorized', 'You are not authorized to access this resource.');
                    break;
                case 'no_token':
                    toast.info('Login Required', 'Please login to continue.');
                    break;
                default:
                    // Manual logout - no toast needed
                    break;
            }
        });

        return unsubscribe;
    }, [logout, navigate, toast]);

    return null;
}

// Protected Route wrapper
function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-cms-bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-cms-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-cms-text-secondary text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <AuthEventListener />
            <Outlet />
        </>
    );
}

// Public Route wrapper (redirects to dashboard if already logged in)
function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-cms-bg-primary flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cms-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <OfflineProvider>
                    <AuthProvider>
                        <Routes>
                            {/* Public routes */}
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<Login />} />
                            </Route>

                            {/* Protected routes with dashboard layout */}
                            <Route element={<ProtectedRoute />}>
                                <Route element={<DashboardLayout />}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="hero-slides" element={<HeroSlides />} />
                                    <Route path="clients" element={<Clients />} />
                                    <Route path="experience" element={<Experience />} />
                                    <Route path="experience/new" element={<ExperienceEdit />} />
                                    <Route path="experience/:id" element={<ExperienceEdit />} />
                                    <Route path="skills" element={<Skills />} />
                                    <Route path="services" element={<Services />} />
                                    <Route path="messages" element={<Messages />} />
                                    <Route path="settings" element={<Settings />} />
                                    <Route path="education" element={<Education />} />
                                </Route>
                            </Route>

                            {/* Catch-all redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthProvider>
                </OfflineProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
