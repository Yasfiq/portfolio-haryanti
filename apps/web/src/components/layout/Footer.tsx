import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { useProfile } from '../../hooks/useProfile';

const Footer = () => {
    const { data: settings } = useSettings();
    const { data: profile } = useProfile();
    const currentYear = new Date().getFullYear();

    // Get branding from settings
    const siteName = settings?.siteName || 'Haryanti';

    // Get contact email from profile
    const contactEmail = profile?.email || 'hello@haryanti.com';

    // Build social links dynamically from profile data
    const allSocialLinks = [
        {
            name: 'LinkedIn',
            url: profile?.linkedinUrl,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            url: profile?.instagramUrl,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
        {
            name: 'Pinterest',
            url: profile?.pinterestUrl,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0a12 12 0 0 0-4.373 23.178c-.07-.633-.134-1.606.028-2.298.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.683 0 1.012.512 1.012 1.127 0 .687-.437 1.714-.663 2.668-.189.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12 12 0 1 0 12 0z" />
                </svg>
            ),
        },
        {
            name: 'Email',
            url: `mailto:${contactEmail}`,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
        },
    ];

    // Filter to only show social links that have URLs set (Email is always shown)
    const socialLinks = allSocialLinks.filter(link =>
        link.name === 'Email' || (link.url && link.url.trim() !== '')
    );

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <footer className="relative pb-28 md:pb-8">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto px-6 md:px-8 pt-12 md:pt-16">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">

                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <Link to="/" className="inline-block group">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                {siteName}
                            </h3>
                            <p className="text-sm text-primary">{profile?.title || 'Graphic Designer & Content Creator'}</p>
                        </Link>
                        <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs mx-auto md:mx-0">
                            {profile?.bio?.substring(0, 120) || 'Creating visual stories that captivate and inspire. Let\'s bring your vision to life.'}
                            {profile?.bio && profile.bio.length > 120 && '...'}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-sm text-muted hover:text-primary transition-colors duration-300"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Resume Download */}
                        {profile?.resumeUrl && (
                            <a
                                href={profile.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary transition-all duration-300 hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Resume
                            </a>
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="text-center md:text-right">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Connect
                        </h4>
                        <div className="flex items-center justify-center md:justify-end gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary/10 border border-secondary/20 text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                                    aria-label={link.name}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-muted">
                            {contactEmail}
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-secondary/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-muted">
                            © {currentYear} {siteName}. All rights reserved.
                        </p>
                        <p className="text-xs text-muted/60">
                            Crafted with <span className="text-primary">♥</span> in Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
