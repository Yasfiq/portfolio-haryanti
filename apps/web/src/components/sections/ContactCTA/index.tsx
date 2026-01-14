import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import SectionDecoration from '../../shared/SectionDecoration';
import { useSettings } from '../../../hooks/useSettings';

const ContactCTA = () => {
    const { data: settings } = useSettings();
    const containerRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);

    // Get CTA content from settings with fallbacks
    const ctaHeading = settings?.ctaHeading || 'Have a project in mind?';
    const ctaDescription = settings?.ctaDescription || "Let's create something amazing together. I'm always excited to work on new and challenging projects.";
    const ctaButtonText = settings?.ctaButtonText || "Let's Talk ✨";

    // Generate random orbs
    const orbs = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 4 + 4,
    }));

    useEffect(() => {
        const container = containerRef.current;
        const orbsContainer = orbsRef.current;

        if (!container || !orbsContainer) return;

        // Animate orbs floating
        const orbElements = orbsContainer.querySelectorAll('.floating-orb-item');
        orbElements.forEach((orb, index) => {
            gsap.to(orb, {
                y: 'random(-30, 30)',
                x: 'random(-20, 20)',
                duration: orbs[index]?.duration || 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: orbs[index]?.delay || 0,
            });
        });

        // Parallax effect on mouse move
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / 50;
            const moveY = (clientY - centerY) / 50;

            orbElements.forEach((orb, index) => {
                const depth = (index % 3) + 1;
                gsap.to(orb, {
                    x: moveX * depth,
                    y: moveY * depth,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            });
        };

        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="section-container relative overflow-hidden"
        >
            {/* Floating Orbs Background */}
            <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
                {orbs.map((orb) => (
                    <div
                        key={orb.id}
                        className="floating-orb-item absolute rounded-full bg-primary/10 blur-xl"
                        style={{
                            width: orb.size,
                            height: orb.size,
                            left: `${orb.x}%`,
                            top: `${orb.y}%`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Section Title with Decoration */}
                <div className="relative inline-block">
                    <SectionDecoration
                        position="top-left"
                        size="md"
                        className="absolute -top-6 -left-10 md:-left-14"
                    />
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-golden-5">
                        {ctaHeading}
                    </h2>
                    <SectionDecoration
                        position="bottom-right"
                        size="sm"
                        className="absolute -bottom-2 -right-8 md:-right-12"
                    />
                </div>
                <p className="text-muted text-lg mb-golden-7">
                    {ctaDescription}
                </p>

                {/* CTA Button */}
                <Link
                    to="/contact"
                    className="magnetic-btn text-lg px-golden-7 py-golden-5"
                    data-cursor-hover
                >
                    {ctaButtonText}
                </Link>
            </div>
        </section>
    );
};

export default ContactCTA;
