import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHeroSlides } from '../../../hooks/useHeroSlides';

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_HEIGHT = 90;

// Fallback data while loading or if API fails
const fallbackPanels = [
    {
        id: 'fallback-1',
        title: "Hello, I'm Haryanti",
        leftTitle: 'Graphic Designer',
        leftSubtitle: 'Skilled in visual design for branding & marketing.',
        rightTitle: 'Content Creator',
        rightSubtitle: 'Crafting engaging stories that resonate with audiences',
        imageUrl: undefined as string | undefined,
        backgroundColor: undefined as string | undefined,
        backgroundFrom: undefined as string | undefined,
        backgroundTo: undefined as string | undefined,
        order: 0,
        isVisible: true,
    },
];

const Hero = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLDivElement>(null);

    // Fetch hero slides from API
    const { data: heroSlides, isLoading, error } = useHeroSlides();

    // Use API data or fallback
    const panels = useMemo(() => {
        if (heroSlides && heroSlides.length > 0) {
            return heroSlides;
        }
        return fallbackPanels;
    }, [heroSlides]);

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;
        const panelsContainer = panelsRef.current;

        if (!section || !trigger || !panelsContainer || isLoading) return;

        const panelCount = panels.length;
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
    }, [panels, isLoading]);

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

    // Helper to get background style for a panel
    const getPanelBackground = (panel: typeof panels[0]) => {
        if (panel.backgroundFrom && panel.backgroundTo) {
            return `linear-gradient(135deg, ${panel.backgroundFrom}, ${panel.backgroundTo})`;
        }
        if (panel.backgroundColor) {
            return panel.backgroundColor;
        }
        return 'transparent';
    };

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
                        style={{ width: `${panels.length * 100}vw` }}
                    >
                        {panels.map((panel, index) => {
                            const bgStyle = getPanelBackground(panel);
                            const hasBackground = bgStyle !== 'transparent';

                            return (
                                <div
                                    key={panel.id}
                                    className="hero-panel flex flex-col flex-shrink-0 relative"
                                    style={{
                                        width: '100vw',
                                        height: '100%',
                                        background: bgStyle,
                                    }}
                                >
                                    {/* Overlay for better text readability on colored backgrounds */}
                                    {hasBackground && (
                                        <div className="absolute inset-0 bg-background/60 pointer-events-none" />
                                    )}

                                    {/* Top - Title */}
                                    <div className="relative z-10 h-[10%] md:h-[15%] flex items-center justify-center px-4">
                                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
                                            {panel.title}
                                        </h1>
                                    </div>

                                    {/* Main Content - Mobile: Vertical Stack, Desktop: 3-column */}
                                    <div className="relative z-10 flex-1 flex flex-col md:flex-row">

                                        {/* Desktop: Left Text */}
                                        <div className="hidden md:flex w-[25%] items-center justify-center px-golden-4">
                                            <div className="text-left max-w-xs">
                                                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                                                    {panel.leftTitle}
                                                </h3>
                                                <p className="text-xs md:text-sm text-muted leading-relaxed">
                                                    {panel.leftSubtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Center - Image */}
                                        <div className="w-full md:w-[50%] flex items-center justify-center p-4 md:p-golden-5 order-1 md:order-none flex-shrink-0 h-[45%] md:h-auto">
                                            <div className="relative w-full h-full max-w-sm md:max-w-lg flex items-center justify-center">
                                                {panel.imageUrl ? (
                                                    <img
                                                        src={panel.imageUrl}
                                                        alt={panel.title}
                                                        className="w-full h-full object-contain rounded-2xl md:rounded-3xl"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl md:rounded-3xl flex items-center justify-center">
                                                        <span className="text-muted text-sm">Image {index + 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mobile: Content Below Image */}
                                        <div className="flex md:hidden flex-col items-center justify-start px-6 py-4 order-2 flex-1 overflow-y-auto">
                                            <div className="text-center max-w-sm">
                                                <h3 className="text-base font-semibold text-foreground mb-2">
                                                    {panel.leftTitle}
                                                </h3>
                                                <p className="text-sm text-muted leading-relaxed">
                                                    {panel.leftSubtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Desktop: Right Text */}
                                        <div className="hidden md:flex w-[25%] items-center justify-center px-golden-4">
                                            <div className="text-right max-w-xs">
                                                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                                                    {panel.rightTitle}
                                                </h3>
                                                <p className="text-xs md:text-sm text-muted leading-relaxed">
                                                    {panel.rightSubtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom spacing */}
                                    {/* <div className="relative z-10 h-[5%] md:h-[10%]" /> */}
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
