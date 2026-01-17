import { useRef, useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHeroSlides } from '../../../hooks/useHeroSlides';
import HeroFunSlide from './HeroFunSlide';
import HeroClassicPanel from './HeroClassicPanel';
import type { HeroSlide, ClassicSchemaContent, FunSchemaContent } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_HEIGHT = 90;
const MOBILE_NAVBAR_HEIGHT = 48;

// Reference desktop width for mobile scaling
const DESKTOP_REFERENCE_WIDTH = 1024;

// Fallback data while loading or if API fails
const fallbackSlide: HeroSlide = {
    id: 'fallback-1',
    title: "Hello, I'm Haryanti",
    template: 'classic',
    schema: {
        title: "Hello, I'm Haryanti",
        leftTitle: 'Graphic Designer',
        leftSubtitle: 'Skilled in visual design for branding & marketing.',
        rightTitle: 'Content Creator',
        rightSubtitle: 'Crafting engaging stories that resonate with audiences',
        imageUrl: '',
    } as ClassicSchemaContent,
    backgroundColor: undefined,
    backgroundFrom: undefined,
    backgroundTo: undefined,
    order: 0,
    isVisible: true,
};

const Hero = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch hero slides from API
    const { data: heroSlides, isLoading, error } = useHeroSlides();

    // Use API data or fallback
    const slides = useMemo(() => {
        if (heroSlides && heroSlides.length > 0) {
            return heroSlides;
        }
        return [fallbackSlide];
    }, [heroSlides]);

    const navHeight = isMobile ? MOBILE_NAVBAR_HEIGHT : NAVBAR_HEIGHT;

    // Check if we should use horizontal scroll
    // Desktop: only if more than 1 slide
    // Mobile: always (to scroll single panel content or multiple slides)
    const useHorizontalScroll = isMobile ? true : slides.length > 1;

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;
        const panelsContainer = panelsRef.current;

        if (!section || !trigger || !panelsContainer || isLoading) return;

        // Calculate scroll amount
        let totalScrollWidth: number;

        if (isMobile) {
            // Mobile: scroll through desktop-width content
            totalScrollWidth = (slides.length * DESKTOP_REFERENCE_WIDTH) - window.innerWidth;
        } else {
            // Desktop: scroll through panels
            if (!useHorizontalScroll) return;
            totalScrollWidth = (slides.length - 1) * window.innerWidth;
        }

        if (totalScrollWidth <= 0) return;

        // Create the horizontal scroll animation
        const scrollTween = gsap.to(panelsContainer, {
            x: -totalScrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: trigger,
                start: `top ${navHeight}px`,
                end: () => `+=${totalScrollWidth}`,
                scrub: 1,
                pin: section,
                pinSpacing: true,
                anticipatePin: 1,
                onUpdate: () => {
                    if (section.style.position === 'fixed') {
                        section.style.top = `${navHeight}px`;
                    }
                },
                onToggle: (self) => {
                    if (self.isActive && section.style.position === 'fixed') {
                        section.style.top = `${navHeight}px`;
                    }
                },
            },
        });

        // MutationObserver for pin position
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (section.style.position === 'fixed' && section.style.top === '0px') {
                        section.style.top = `${navHeight}px`;
                    }
                }
            });
        });

        observer.observe(section, { attributes: true, attributeFilter: ['style'] });

        return () => {
            scrollTween.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            observer.disconnect();
        };
    }, [slides, isLoading, isMobile, navHeight, useHorizontalScroll]);

    // Mobile needs extra padding for bottom navigation (60px)
    const bottomPadding = isMobile ? 60 : 0;
    const heroHeight = `calc(100vh - ${navHeight}px - ${bottomPadding}px)`;

    // Loading state
    if (isLoading) {
        return (
            <>
                <div style={{ height: `${navHeight}px` }} />
                <section
                    className="w-full overflow-hidden bg-background flex items-center justify-center"
                    style={{ height: heroHeight }}
                >
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20" />
                        <div className="w-48 h-4 rounded bg-secondary/30" />
                    </div>
                </section>
            </>
        );
    }

    // Error state - show fallback
    if (error) {
        console.error('Failed to load hero slides:', error);
    }

    // Single slide on desktop - render without horizontal scroll
    if (!isMobile && !useHorizontalScroll) {
        const slide = slides[0];

        if (slide.template === 'fun') {
            const schema = slide.schema as FunSchemaContent;
            return (
                <HeroFunSlide
                    greeting={schema.greeting}
                    name={schema.name}
                    role={schema.role}
                    quotes={schema.quotes}
                    experience={schema.experience}
                    imageUrl={schema.imageUrl}
                    backgroundColor={slide.backgroundColor}
                    backgroundFrom={slide.backgroundFrom}
                    backgroundTo={slide.backgroundTo}
                />
            );
        }

        // Classic template - single panel
        const schema = slide.schema as ClassicSchemaContent;
        return (
            <>
                <div style={{ height: `${navHeight}px` }} />
                <section
                    className="w-full overflow-hidden bg-background"
                    style={{ height: heroHeight }}
                >
                    <HeroClassicPanel
                        slide={slide}
                        schema={schema}
                        index={0}
                    />
                </section>
            </>
        );
    }

    // Calculate total width for panels container
    const containerWidth = isMobile
        ? slides.length * DESKTOP_REFERENCE_WIDTH
        : slides.length * 100; // vw units for desktop

    // Horizontal scroll (mobile always, desktop when multiple slides)
    return (
        <>
            {/* Spacer for navbar */}
            <div style={{ height: `${navHeight}px` }} />

            {/* Trigger element for scroll */}
            <div ref={triggerRef}>
                {/* Section that gets pinned */}
                <section
                    ref={sectionRef}
                    className="w-full overflow-hidden bg-background"
                    style={{ height: heroHeight }}
                >
                    <div
                        ref={panelsRef}
                        className="flex h-full"
                        style={{
                            width: isMobile ? `${containerWidth}px` : `${containerWidth}vw`
                        }}
                    >
                        {slides.map((slide, index) => {
                            // Panel width: desktop-sized on mobile, 100vw on desktop
                            const panelStyle = {
                                width: isMobile ? `${DESKTOP_REFERENCE_WIDTH}px` : '100vw',
                                height: '100%',
                                flexShrink: 0,
                            };

                            // Render each panel based on its template
                            if (slide.template === 'fun') {
                                const schema = slide.schema as FunSchemaContent;
                                return (
                                    <div
                                        key={slide.id}
                                        className="hero-panel"
                                        style={panelStyle}
                                    >
                                        <HeroFunSlide
                                            greeting={schema.greeting}
                                            name={schema.name}
                                            role={schema.role}
                                            quotes={schema.quotes}
                                            experience={schema.experience}
                                            imageUrl={schema.imageUrl}
                                            backgroundColor={slide.backgroundColor}
                                            backgroundFrom={slide.backgroundFrom}
                                            backgroundTo={slide.backgroundTo}
                                            isInHorizontalScroll={true}
                                        />
                                    </div>
                                );
                            }

                            // Classic template
                            const schema = slide.schema as ClassicSchemaContent;
                            return (
                                <div key={slide.id} style={panelStyle}>
                                    <HeroClassicPanel
                                        slide={slide}
                                        schema={schema}
                                        index={index}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Hero;
