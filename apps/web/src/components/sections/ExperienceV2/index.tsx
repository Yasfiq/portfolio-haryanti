import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useExperiences } from '../../../hooks/useExperiences';
import type { Experience as ExperienceType } from '../../../types';

// ============================================================================
// CONSTANTS
// ============================================================================
const NAVBAR_HEIGHT = 80;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Format date range string */
const formatPeriod = (exp: ExperienceType): string => {
    const startYear = new Date(exp.startDate).getFullYear();
    if (exp.isCurrent || !exp.endDate) {
        return `${startYear} - Present`;
    }
    return `${startYear} - ${new Date(exp.endDate).getFullYear()}`;
};

/** Parse description to array format */
const parseDescription = (description: string | string[]): string[] => {
    if (Array.isArray(description)) return description;
    try {
        const parsed = JSON.parse(description);
        return Array.isArray(parsed) ? parsed : [description];
    } catch {
        return [description];
    }
};

// Default gradient backgrounds
const GRADIENT_CLASSES = [
    'from-primary/30 to-secondary/30',
    'from-secondary/30 to-tertiary/50',
    'from-tertiary/50 to-primary/20',
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TimelineProps {
    experiences: ExperienceType[];
    activeIndex: number;
    isVisible: boolean;
}

const Timeline = ({ experiences, activeIndex, isVisible }: TimelineProps) => (
    <div
        className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
        style={{
            top: `${NAVBAR_HEIGHT + 20}px`,
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'auto' : 'none',
            transform: `translateX(-50%) translateY(${isVisible ? 0 : -20}px)`,
        }}
    >
        <div className="flex items-center gap-1 md:gap-2 bg-background/80 backdrop-blur-lg px-3 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-secondary/20">
            {experiences.map((exp, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;

                return (
                    <div key={exp.id} className="flex items-center">
                        {/* Dot and labels */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300
                  ${isActive
                                        ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                                        : isPast
                                            ? 'bg-primary/70'
                                            : 'bg-secondary/50'
                                    }
                `}
                            />
                            <span
                                className={`
                  text-[10px] md:text-xs mt-1 md:mt-2 transition-colors duration-300
                  ${isActive ? 'text-primary font-medium' : 'text-muted'}
                `}
                            >
                                {new Date(exp.startDate).getFullYear()}
                            </span>
                            <span
                                className={`
                  hidden md:block text-[10px] text-center max-w-[80px] truncate transition-colors duration-300
                  ${isActive ? 'text-foreground' : 'text-muted'}
                `}
                            >
                                {exp.role.split(' ')[0]}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < experiences.length - 1 && (
                            <div className="w-8 md:w-16 h-0.5 bg-secondary/30 mx-1 md:mx-2 overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: isPast ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

interface ExperiencePanelProps {
    experience: ExperienceType;
    index: number;
}

const ExperiencePanel = ({ experience, index }: ExperiencePanelProps) => {
    const hasCustomBg = Boolean(experience.backgroundColor);
    const gradientClass = GRADIENT_CLASSES[index % GRADIENT_CLASSES.length];

    return (
        <div
            className={`
        w-screen h-full flex-shrink-0 relative flex items-center snap-start
        ${!hasCustomBg ? `bg-gradient-to-br ${gradientClass}` : ''}
      `}
            style={hasCustomBg ? { backgroundColor: experience.backgroundColor } : undefined}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80" />

            {/* Content */}
            <div className="relative z-10 max-w-xl px-6 md:px-0 md:ml-golden-8">
                {/* Company header */}
                <div className="flex items-center gap-3 md:gap-golden-4 mb-4 md:mb-golden-5">
                    {experience.logoUrl ? (
                        <img
                            src={experience.logoUrl}
                            alt={experience.company}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <span className="text-3xl md:text-4xl">🏢</span>
                    )}
                    <span className="text-base md:text-xl font-medium">
                        {experience.company}
                    </span>
                </div>

                {/* Role */}
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-golden-3">
                    {experience.role}
                </h3>

                {/* Period */}
                <p className="text-primary text-sm md:text-base font-medium mb-4 md:mb-golden-5">
                    {formatPeriod(experience)}
                </p>

                {/* Description */}
                <ul className="space-y-2 md:space-y-golden-3">
                    {parseDescription(experience.description).map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2 md:gap-golden-3 text-muted text-sm md:text-base"
                        >
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ExperienceV2 = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Fetch experiences from API
    const { data: apiExperiences, isLoading } = useExperiences();

    // Memoized sorted experiences - NO FALLBACK
    const experiences = useMemo(() => {
        if (apiExperiences && apiExperiences.length > 0) {
            return [...apiExperiences].sort((a, b) => a.order - b.order);
        }
        return [];
    }, [apiExperiences]);

    // Calculate scroll amount for horizontal scroll
    const getScrollWidth = useCallback(() => {
        if (!trackRef.current) return 0;
        return trackRef.current.scrollWidth - window.innerWidth;
    }, []);

    // Handle scroll
    useEffect(() => {
        const section = sectionRef.current;
        if (!section || experiences.length === 0) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const scrollWidth = getScrollWidth();

            // Check if section is in view
            const inView = sectionTop <= 0 && sectionTop > -(sectionHeight - viewportHeight);
            setIsInView(inView);

            if (inView && scrollWidth > 0) {
                // Calculate progress (0 to 1)
                const progress = Math.min(Math.max(-sectionTop / (sectionHeight - viewportHeight), 0), 1);
                setScrollProgress(progress);

                // Calculate active panel index
                const panelCount = experiences.length;
                const newIndex = Math.min(
                    Math.floor(progress * panelCount),
                    panelCount - 1
                );
                setActiveIndex(newIndex);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [experiences.length, getScrollWidth]);

    // Calculate transform based on scroll progress
    const translateX = useMemo(() => {
        const scrollWidth = getScrollWidth();
        return -scrollProgress * scrollWidth;
    }, [scrollProgress, getScrollWidth]);

    // Calculate section height (viewport height * number of panels for scroll distance)
    const sectionHeight = useMemo(() => {
        return `${experiences.length * 100}vh`;
    }, [experiences.length]);

    // Don't render if no experiences and not loading
    if (!isLoading && experiences.length === 0) {
        return null;
    }

    // Show loading state
    if (isLoading) {
        return (
            <section className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted">Loading experiences...</p>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Timeline - fixed position */}
            <Timeline
                experiences={experiences}
                activeIndex={activeIndex}
                isVisible={isInView}
            />

            <section
                ref={sectionRef}
                className="relative w-full"
                style={{ height: sectionHeight }}
                aria-label="Experience Timeline"
            >
                {/* Sticky container */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Horizontal scroll track */}
                    <div
                        ref={trackRef}
                        className="flex h-full transition-transform duration-100 ease-out will-change-transform"
                        style={{
                            width: `${experiences.length * 100}vw`,
                            transform: `translateX(${translateX}px)`,
                        }}
                    >
                        {experiences.map((exp, index) => (
                            <ExperiencePanel key={exp.id} experience={exp} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ExperienceV2;
