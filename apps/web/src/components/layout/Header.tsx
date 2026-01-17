import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../hooks/useSettings';

const Header = () => {
    const { data: settings } = useSettings();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Update scrolled state for styling
                    setIsScrolled(currentScrollY > 50);

                    // Show/hide logic
                    if (currentScrollY < 50) {
                        // Always show at top
                        setIsVisible(true);
                    } else if (currentScrollY < lastScrollY.current) {
                        // Scrolling up - show
                        setIsVisible(true);
                    } else if (currentScrollY > lastScrollY.current + 10) {
                        // Scrolling down (with threshold) - hide
                        setIsVisible(false);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative py-2 px-4 text-sm font-medium transition-all duration-300 rounded-full ${isActive
            ? 'text-foreground bg-white'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`;

    // Get branding from settings
    const siteName = settings?.siteName || 'HARYANTI';
    const logoUrl = settings?.logoUrl;

    return (
        <>
            {/* Mobile: Full-width sitename bar */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="bg-white shadow-md px-4 py-3">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2"
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={siteName}
                                className="h-6 w-auto object-contain"
                            />
                        ) : (
                            <span className="text-base font-semibold text-primary tracking-wide">
                                {siteName.toUpperCase()}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* Desktop: Floating navbar */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-4 md:p-6 hidden md:block ${isVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                {/* Floating Navbar Container */}
                <div
                    className={`mx-auto max-w-4xl transition-all duration-500 ${isScrolled
                        ? 'bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/20'
                        : 'bg-neutral-900/90 backdrop-blur-lg'
                        } rounded-full px-4 md:px-8 py-3`}
                >
                    <div className="flex items-center justify-between">
                        {/* Logo / Site Name */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={siteName}
                                    className="h-8 w-auto object-contain"
                                />
                            ) : (
                                <span className="text-lg font-bold text-white hover:text-primary transition-colors">
                                    {siteName.toUpperCase()}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <nav className="flex items-center gap-1">
                            <NavLink to="/" end className={navLinkClass}>
                                Home
                            </NavLink>
                            <NavLink to="/projects" className={navLinkClass}>
                                Projects
                            </NavLink>
                            <NavLink to="/about" className={navLinkClass}>
                                About
                            </NavLink>
                            <NavLink to="/contact" className={navLinkClass}>
                                Contact
                            </NavLink>
                        </nav>

                        {/* CTA Button - uses primary color from CMS */}
                        <Link
                            to="/contact"
                            className="inline-flex px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
