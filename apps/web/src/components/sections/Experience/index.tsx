import { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperiences } from '../../../hooks/useExperiences';
import type { Experience as ExperienceType } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_HEIGHT = 80;

// Fallback data when API is empty or loading
const fallbackExperiences: ExperienceType[] = [
    {
        id: '1',
        company: 'PT. Creative Studio',
        role: 'Senior Graphic Designer',
        startDate: '2022-01-01',
        endDate: undefined,
        isCurrent: true,
        description: [
            'Lead brand identity projects for major clients',
            'Mentor junior designers and review their work',
            'Client presentation & pitching',
        ],
        backgroundColor: undefined,
        order: 0,
        isVisible: true,
    },
    {
        id: '2',
        company: 'Digital Agency XYZ',
        role: 'Graphic Designer',
        startDate: '2021-01-01',
        endDate: '2022-01-01',
        isCurrent: false,
        description: [
            'Created visual content for social media campaigns',
            'Designed marketing materials and brand assets',
            'Collaborated with marketing team on strategies',
        ],
        backgroundColor: undefined,
        order: 1,
        isVisible: true,
    },
    {
        id: '3',
        company: 'Startup Inc.',
        role: 'Junior Designer',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        isCurrent: false,
        description: [
            'Assisted in creating UI/UX designs',
            'Produced graphics for web and mobile apps',
            'Learned industry best practices',
        ],
        backgroundColor: undefined,
        order: 2,
        isVisible: true,
    },
];

// Helper to get period string
const getPeriodString = (exp: ExperienceType) => {
    const startYear = new Date(exp.startDate).getFullYear();
    if (exp.isCurrent || !exp.endDate) {
        return `${startYear} - Present`;
    }
    const endYear = new Date(exp.endDate).getFullYear();
    return `${startYear} - ${endYear}`;
};

// Helper to get description as array
const getDescriptionArray = (description: string | string[]): string[] => {
    if (Array.isArray(description)) return description;
    try {
        const parsed = JSON.parse(description);
        return Array.isArray(parsed) ? parsed : [description];
    } catch {
        return [description];
    }
};

// Default gradient backgrounds for when no backgroundColor is set
const defaultGradients = [
    'bg-gradient-to-br from-primary/30 to-secondary/30',
    'bg-gradient-to-br from-secondary/30 to-tertiary/50',
    'bg-gradient-to-br from-tertiary/50 to-primary/20',
];

const Experience = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLDivElement>(null);
    const ctxRef = useRef<gsap.Context | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPinned, setIsPinned] = useState(false);

    // Fetch experiences from API
    const { data: apiExperiences } = useExperiences();

    // Use API data or fallback
    const experiences = useMemo(() => {
        if (apiExperiences && apiExperiences.length > 0) {
            return apiExperiences.sort((a, b) => a.order - b.order);
        }
        return fallbackExperiences;
    }, [apiExperiences]);

    // Use useLayoutEffect for synchronous cleanup BEFORE React removes DOM nodes
    useLayoutEffect(() => {
        return () => {
            const experienceTrigger = ScrollTrigger.getById('experience-horizontal-scroll');
            if (experienceTrigger) {
                experienceTrigger.kill(true);
            }
            if (ctxRef.current) {
                ctxRef.current.revert();
                ctxRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const panels = panelsRef.current;

        if (!container || !panels) return;

        const allPanels = panels.querySelectorAll('.experience-panel');
        const panelCount = allPanels.length;

        const getScrollAmount = () => {
            return -(panels.scrollWidth - window.innerWidth);
        };

        ctxRef.current = gsap.context(() => {
            gsap.to(panels, {
                x: getScrollAmount,
                ease: 'none',
                scrollTrigger: {
                    id: 'experience-horizontal-scroll',
                    trigger: container,
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1,
                    end: () => `+=${panels.scrollWidth - window.innerWidth}`,
                    invalidateOnRefresh: true,
                    onToggle: (self) => {
                        setIsPinned(self.isActive);
                    },
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const newIndex = Math.min(
                            Math.floor(progress * panelCount),
                            panelCount - 1
                        );
                        setActiveIndex(newIndex);
                    },
                },
            });
        }, container);

        return () => {
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };
    }, [experiences.length]);

    // Get background style for a panel
    const getPanelBackground = (exp: ExperienceType) => {
        if (exp.backgroundColor) {
            return { backgroundColor: exp.backgroundColor };
        }
        // Use default gradient class instead
        return {};
    };

    const getPanelClassName = (exp: ExperienceType, index: number) => {
        const baseClass = 'experience-panel full-page relative flex items-center justify-start';
        if (exp.backgroundColor) {
            return baseClass;
        }
        // Use default gradient if no backgroundColor
        return `${baseClass} ${defaultGradients[index % defaultGradients.length]}`;
    };

    // Timeline indicator component
    const TimelineIndicator = () => (
        <div
            className="fixed left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300"
            style={{
                top: `${NAVBAR_HEIGHT + 20}px`,
                opacity: isPinned ? 1 : 0,
                pointerEvents: isPinned ? 'auto' : 'none',
            }}
        >
            <div className="flex items-center gap-1 md:gap-2 bg-background/80 backdrop-blur-lg px-3 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-secondary/20">
                {experiences.map((exp, index) => (
                    <div key={exp.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === activeIndex
                                    ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                                    : 'bg-secondary/50'
                                    }`}
                            />
                            <span
                                className={`text-[10px] md:text-xs mt-1 md:mt-2 transition-colors ${index === activeIndex ? 'text-primary' : 'text-muted'
                                    }`}
                            >
                                {new Date(exp.startDate).getFullYear()}
                            </span>
                            <span
                                className={`hidden md:block text-[10px] text-center max-w-[80px] truncate transition-colors ${index === activeIndex ? 'text-foreground' : 'text-muted'
                                    }`}
                            >
                                {exp.role.split(' ')[0]}
                            </span>
                        </div>
                        {index < experiences.length - 1 && (
                            <div className="w-8 md:w-16 h-0.5 bg-secondary/30 mx-1 md:mx-2">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{
                                        width: index < activeIndex ? '100%' : '0%',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden">
            {/* Timeline - render in portal when pinned to avoid GSAP conflicts */}
            {isPinned
                ? createPortal(<TimelineIndicator />, document.body)
                : <TimelineIndicator />
            }

            {/* Experience Panels */}
            <div
                ref={panelsRef}
                className="flex h-full"
                style={{ width: `${experiences.length * 100}vw` }}
            >
                {experiences.map((exp, index) => (
                    <div
                        key={exp.id}
                        className={getPanelClassName(exp, index)}
                        style={getPanelBackground(exp)}
                    >
                        <div className="absolute inset-0 bg-background/80" />
                        <div className="relative z-10 max-w-xl px-6 md:px-0 md:ml-golden-8">
                            <div className="flex items-center gap-3 md:gap-golden-4 mb-4 md:mb-golden-5">
                                {exp.logoUrl ? (
                                    <img
                                        src={exp.logoUrl}
                                        alt={exp.company}
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl md:text-4xl">🏢</span>
                                )}
                                <span className="text-base md:text-xl font-medium">{exp.company}</span>
                            </div>
                            {/* CHANGED: Reduced role font size per client request (#8) */}
                            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-golden-3">
                                {exp.role}
                            </h3>
                            <p className="text-primary text-sm md:text-base font-medium mb-4 md:mb-golden-5">
                                {getPeriodString(exp)}
                            </p>
                            <ul className="space-y-2 md:space-y-golden-3">
                                {getDescriptionArray(exp.description).map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 md:gap-golden-3 text-muted text-sm md:text-base">
                                        <span className="text-primary">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;
