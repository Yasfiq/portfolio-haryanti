import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `relative py-2 px-4 text-sm font-medium transition-all duration-300 rounded-full ${isActive
            ? 'text-white bg-white/10'
            : 'text-white/70 hover:text-white hover:bg-white/5'
        }`;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-4 md:p-6">
            {/* Floating Navbar Container */}
            <div
                className={`mx-auto max-w-4xl transition-all duration-500 ${isScrolled
                        ? 'bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/20'
                        : 'bg-neutral-900/90 backdrop-blur-lg'
                    } rounded-full px-4 md:px-8 py-3`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-lg font-bold text-white hover:text-primary transition-colors"
                    >
                        HARYANTI
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <nav className="hidden md:flex items-center gap-1">
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

                    {/* CTA Button */}
                    <Link
                        to="/contact"
                        className="hidden md:inline-flex px-5 py-2 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Let's Talk
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
