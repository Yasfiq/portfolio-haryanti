import { useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFeaturedProjects } from '../../../hooks/useProjects';
import SectionDecoration from '../../shared/SectionDecoration';
import type { Project } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

// Fallback data while loading or if API fails
const fallbackProjects: Partial<Project>[] = [
    { id: 'fallback-1', title: 'Project 1', slug: 'project-1', category: { id: '1', name: 'Brand Design', slug: 'brand' } },
    { id: 'fallback-2', title: 'Project 2', slug: 'project-2', category: { id: '2', name: 'UI/UX', slug: 'uiux' } },
    { id: 'fallback-3', title: 'Project 3', slug: 'project-3', category: { id: '3', name: 'Social Media', slug: 'social' } },
    { id: 'fallback-4', title: 'Project 4', slug: 'project-4', category: { id: '4', name: 'Packaging', slug: 'packaging' } },
];

const Showcase = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    // Fetch featured projects from API
    const { data: apiProjects, isLoading, error } = useFeaturedProjects(4);

    // Use API data or fallback
    const projects = useMemo(() => {
        if (apiProjects && apiProjects.length > 0) {
            return apiProjects;
        }
        return fallbackProjects as Project[];
    }, [apiProjects]);

    useEffect(() => {
        const container = containerRef.current;
        const cards = cardsRef.current;

        if (!container || !cards || isLoading) return;

        // Parallax effect on cards
        const cardElements = cards.querySelectorAll('.project-card');
        cardElements.forEach((card, index) => {
            gsap.fromTo(
                card,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [projects, isLoading]);

    // Log error but don't block UI
    if (error) {
        console.error('Failed to load featured projects:', error);
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <section ref={containerRef} className="section-container">
                <div className="mb-golden-6">
                    <h2 className="text-xl md:text-2xl font-bold mb-golden-3">
                        Featured Work
                    </h2>
                    <p className="text-muted">Selected projects from my portfolio</p>
                </div>

                {/* Loading skeletons */}
                <div className="horizontal-scroll-container gap-golden-5 pb-golden-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="card min-w-[280px] md:min-w-[320px] animate-pulse"
                        >
                            <div className="aspect-[4/3] bg-secondary/20 rounded-lg mb-golden-4" />
                            <div className="h-5 bg-secondary/20 rounded w-3/4 mb-golden-2" />
                            <div className="h-4 bg-secondary/10 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={containerRef} className="section-container">
            {/* Section Title with Decoration */}
            <div className="relative mb-golden-6">
                <SectionDecoration
                    position="top-left"
                    size="md"
                    className="absolute -top-2 -left-2 md:-left-4"
                />
                <h2 className="text-xl md:text-2xl font-bold mb-golden-3">
                    Featured Work
                </h2>
                <p className="text-muted">Selected projects from my portfolio</p>
            </div>

            {/* Horizontal scroll container */}
            <div
                ref={cardsRef}
                className="horizontal-scroll-container gap-golden-5 pb-golden-5"
            >
                {projects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.slug}`}
                        className="project-card card min-w-[280px] max-w-[320px] md:min-w-[320px] md:max-w-[360px] flex-shrink-0 group"
                    >
                        <div className="aspect-[4/3] bg-secondary/20 rounded-lg mb-golden-4 overflow-hidden relative">
                            {project.thumbnailUrl ? (
                                <img
                                    src={project.thumbnailUrl}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-500" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold mb-golden-2 group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-muted text-sm">
                            {project.category?.name || 'Project'}
                        </p>
                    </Link>
                ))}
            </div>

            {/* View All Link */}
            <div className="text-right mt-golden-4">
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                    View All Projects
                    <span>→</span>
                </Link>
            </div>
        </section>
    );
};

export default Showcase;
