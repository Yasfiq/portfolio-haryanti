import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import FloatingWhatsApp from '../shared/FloatingWhatsApp';

const Layout = () => {
    const location = useLocation();

    // Scroll to top and refresh ScrollTrigger on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        // Give time for the DOM to update before refreshing ScrollTrigger
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <MobileNav />
            <FloatingWhatsApp />
        </div>
    );
};

export default Layout;
