import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjects } from '../hooks/useProjects';
import { useCategories } from '../hooks/useCategories';
import type { Project } from '../types';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null); // null = All
    const gridRef = useRef<HTMLDivElement>(null);

    // Fetch data from API
    const { data: projects = [], isLoading: projectsLoading } = useProjects();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    // Filter projects by category
    const filteredProjects = useMemo(() => {
        if (!activeCategory) return projects;
        return projects.filter(
            (project) => project.category?.id === activeCategory
        );
    }, [projects, activeCategory]);

    // Animation on filter change
    useEffect(() => {
        if (!gridRef.current || projectsLoading) return;

        const cards = gridRef.current.querySelectorAll('.project-card');
        gsap.fromTo(
            cards,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
            }
        );
    }, [filteredProjects, projectsLoading]);

    const isLoading = projectsLoading || categoriesLoading;

    return (
        <>
            <Helmet>
                <title>Projects - Haryanti</title>
                <meta
                    name="description"
                    content="Browse my portfolio of design projects including brand design, UI/UX, and content creation work."
                />
            </Helmet>

            <section className="section-container pt-32">
                <div className="text-center mb-golden-7">
                    <h1 className="text-2xl md:text-3xl font-bold mb-golden-4">
                        My Projects
                    </h1>
                    <p className="text-muted text-lg">
                        Selected works from my portfolio
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-golden-3 mb-golden-7">
                    {/* All button */}
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-golden-5 py-golden-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === null
                            ? 'bg-primary text-white'
                            : 'bg-tertiary/50 text-muted hover:text-foreground hover:bg-tertiary'
                            }`}
                    >
                        All
                    </button>

                    {/* Category buttons */}
                    {categoriesLoading ? (
                        // Loading skeleton for categories
                        [1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-24 h-10 rounded-full bg-tertiary/30 animate-pulse"
                            />
                        ))
                    ) : (
                        categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-golden-5 py-golden-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                                    ? 'bg-primary text-white'
                                    : 'bg-tertiary/50 text-muted hover:text-foreground hover:bg-tertiary'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))
                    )}
                </div>

                {/* Projects Masonry Grid */}
                <div
                    ref={gridRef}
                    className="columns-1 md:columns-2 lg:columns-3 gap-golden-5"
                    style={{ columnFill: 'balance' }}
                >
                    {isLoading ? (
                        // Loading skeletons with varying heights
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="card animate-pulse mb-golden-5 break-inside-avoid"
                                style={{ height: `${200 + (i % 3) * 80}px` }}
                            >
                                <div className="w-full h-full bg-secondary/20 rounded-lg" />
                            </div>
                        ))
                    ) : filteredProjects.length === 0 ? (
                        // Empty state
                        <div className="col-span-full text-center py-golden-7">
                            <p className="text-muted text-lg">
                                No projects found in this category
                            </p>
                        </div>
                    ) : (
                        // Project cards
                        filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                </div>
            </section>
        </>
    );
};

// Separate component for better performance with masonry layout
const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <Link
            to={`/projects/${project.slug}`}
            className="project-card card group cursor-pointer mb-golden-5 break-inside-avoid block"
        >
            <div className="bg-secondary/20 rounded-lg overflow-hidden">
                {project.thumbnailUrl ? (
                    <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
                )}
            </div>
            <div className="pt-golden-4">
                <h3 className="text-lg font-semibold mb-golden-2 group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                {/* Simplified: Only show summary, removed category/year per client request */}
                <p className="text-muted text-sm line-clamp-2">
                    {project.summary}
                </p>
            </div>
        </Link>
    );
};

export default Projects;
