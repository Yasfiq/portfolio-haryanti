import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHeroSlides } from '../../../hooks/useHeroSlides';
import HeroFunSlide from './HeroFunSlide';
import HeroClassicPanel from './HeroClassicPanel';
import type { HeroSlide, ClassicSchemaContent, FunSchemaContent } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_HEIGHT = 90;

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

    // Fetch hero slides from API
    const { data: heroSlides, isLoading, error } = useHeroSlides();

    // Use API data or fallback
    const slides = useMemo(() => {
        if (heroSlides && heroSlides.length > 0) {
            return heroSlides;
        }
        return [fallbackSlide];
    }, [heroSlides]);

    // Check if we should use horizontal scroll (more than 1 slide)
    const useHorizontalScroll = slides.length > 1;

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;
        const panelsContainer = panelsRef.current;

        // Only apply horizontal scroll if we have multiple slides
        if (!section || !trigger || !panelsContainer || isLoading || !useHorizontalScroll) return;

        const panelCount = slides.length;
        const panelWidth = window.innerWidth;
        const totalScrollWidth = (panelCount - 1) * panelWidth;

        // Create the horizontal scroll animation
        const scrollTween = gsap.to(panelsContainer, {
            x: -totalScrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: trigger,
                start: `top ${NAVBAR_HEIGHT}px`,
                end: () => `+=${totalScrollWidth}`,
                scrub: 1,
                pin: section,
                pinSpacing: true,
                anticipatePin: 1,
                onUpdate: () => {
                    if (section.style.position === 'fixed') {
                        section.style.top = `${NAVBAR_HEIGHT}px`;
                    }
                },
                onToggle: (self) => {
                    if (self.isActive && section.style.position === 'fixed') {
                        section.style.top = `${NAVBAR_HEIGHT}px`;
                    }
                },
            },
        });

        // MutationObserver for pin position
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (section.style.position === 'fixed' && section.style.top === '0px') {
                        section.style.top = `${NAVBAR_HEIGHT}px`;
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
    }, [slides, isLoading, useHorizontalScroll]);

    const heroHeight = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

    // Loading state
    if (isLoading) {
        return (
            <>
                <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
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

    // Single slide - render based on template (no horizontal scroll)
    if (!useHorizontalScroll) {
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
                <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
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

    // Multiple slides - horizontal scroll
    return (
        <>
            {/* Spacer for navbar */}
            <div style={{ height: `${NAVBAR_HEIGHT}px` }} />

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
                        style={{ width: `${slides.length * 100}vw` }}
                    >
                        {slides.map((slide, index) => {
                            // Render each panel based on its template
                            if (slide.template === 'fun') {
                                const schema = slide.schema as FunSchemaContent;
                                return (
                                    <div
                                        key={slide.id}
                                        className="hero-panel flex-shrink-0"
                                        style={{ width: '100vw', height: '100%' }}
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
                                <HeroClassicPanel
                                    key={slide.id}
                                    slide={slide}
                                    schema={schema}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Hero;
