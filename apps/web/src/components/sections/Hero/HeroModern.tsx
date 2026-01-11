import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useProfile } from '../../../hooks/useProfile';
import { useSettings } from '../../../hooks/useSettings';

/**
 * HeroModern - New Hero Template
 * Features:
 * - "Hello!" greeting bubble with decorative lines
 * - Profile photo with colored background (from CMS primary color)
 * - Name and title with subtle animations
 * - Clean, modern layout
 */
const HeroModern = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const greetingRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    const { data: profile } = useProfile();
    const { data: settings } = useSettings();

    // Get primary color from settings or use default
    const primaryColor = settings?.primaryColor || '#f97316'; // orange default

    // Entrance animations
    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Greeting bubble animation
        tl.fromTo(
            greetingRef.current,
            { y: 30, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8 }
        );

        // Photo animation
        tl.fromTo(
            photoRef.current,
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8 },
            '-=0.5'
        );

        // Text animation
        tl.fromTo(
            textRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            '-=0.4'
        );

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background pt-24 pb-16"
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle gradient */}
                <div
                    className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: primaryColor }}
                />
                <div
                    className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-golden-5 md:px-golden-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Greeting Bubble with Decorative Lines */}
                    <div ref={greetingRef} className="relative mb-8">
                        {/* Decorative lines */}
                        <svg
                            className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-8 opacity-40"
                            viewBox="0 0 48 32"
                            fill="none"
                        >
                            <path
                                d="M4 16C12 4 24 4 32 16C40 28 48 28 48 16"
                                stroke={primaryColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="4" cy="16" r="3" fill={primaryColor} />
                        </svg>

                        {/* Greeting Bubble */}
                        <div
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2"
                            style={{
                                borderColor: `${primaryColor}40`,
                                backgroundColor: `${primaryColor}10`
                            }}
                        >
                            <span
                                className="text-3xl animate-bounce"
                                style={{ animationDuration: '2s' }}
                            >
                                👋
                            </span>
                            <span className="text-xl font-medium text-foreground">
                                Hello!
                            </span>
                        </div>

                        {/* Decorative lines - right */}
                        <svg
                            className="absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-8 opacity-40 rotate-180"
                            viewBox="0 0 48 32"
                            fill="none"
                        >
                            <path
                                d="M4 16C12 4 24 4 32 16C40 28 48 28 48 16"
                                stroke={primaryColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <circle cx="4" cy="16" r="3" fill={primaryColor} />
                        </svg>
                    </div>

                    {/* Profile Photo with BREAKOUT Effect (#12) */}
                    <div
                        ref={photoRef}
                        className="relative mb-8"
                    >
                        {/* Background circle - colored */}
                        <div
                            className="w-48 h-48 md:w-64 md:h-64 rounded-full relative"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {/* This div just provides the colored circle background */}
                        </div>

                        {/* Photo container - positioned to "break out" of the circle */}
                        {profile?.avatarUrl && (
                            <div
                                className="absolute inset-0 flex items-end justify-center"
                                style={{
                                    // Allow image to overflow the container
                                    overflow: 'visible',
                                    // Position from bottom of circle
                                    bottom: '-10%',
                                }}
                            >
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full max-w-[120%] object-contain object-bottom drop-shadow-2xl"
                                    style={{
                                        // Make image larger than container to create breakout effect
                                        transform: 'scale(1.25) translateY(-8%)',
                                        // Filter for PNG transparency edge softening
                                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                                    }}
                                />
                            </div>
                        )}

                        {/* Fallback initial when no photo */}
                        {!profile?.avatarUrl && (
                            <div className="absolute inset-0 flex items-center justify-center text-6xl text-white/80">
                                {profile?.name?.charAt(0) || 'H'}
                            </div>
                        )}

                        {/* Decorative floating elements */}
                        <div
                            className="absolute -top-4 -right-4 w-6 h-6 rounded-full animate-pulse"
                            style={{ backgroundColor: primaryColor, opacity: 0.6 }}
                        />
                        <div
                            className="absolute -bottom-2 -left-6 w-4 h-4 rounded-full animate-pulse"
                            style={{ backgroundColor: primaryColor, opacity: 0.4, animationDelay: '0.5s' }}
                        />
                    </div>

                    {/* Name and Title */}
                    <div ref={textRef}>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                            {profile?.name || 'Haryanti'}
                        </h1>
                        <p className="text-lg md:text-xl text-muted max-w-xl mx-auto">
                            {profile?.title || 'Graphic Designer & Content Creator'}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <a
                                href="/projects"
                                className="px-6 py-3 rounded-full font-medium text-white transition-all hover:scale-105"
                                style={{ backgroundColor: primaryColor }}
                            >
                                View My Work
                            </a>
                            <a
                                href="/contact"
                                className="px-6 py-3 rounded-full font-medium border-2 transition-all hover:scale-105"
                                style={{
                                    borderColor: primaryColor,
                                    color: primaryColor
                                }}
                            >
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-sm text-muted">Scroll Down</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-muted"
                >
                    <path
                        d="M10 4V16M10 16L5 11M10 16L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </section>
    );
};

export default HeroModern;
