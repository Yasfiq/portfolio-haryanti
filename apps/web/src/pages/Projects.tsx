import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProjects } from '../hooks/useProjects';
import { useCategories } from '../hooks/useCategories';
import type { Client } from '../types';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null); // null = All
    const gridRef = useRef<HTMLDivElement>(null);

    // Fetch data from API (now uses /clients endpoints)
    const { data: clients = [], isLoading: clientsLoading } = useProjects();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    // Filter clients by category (check if any of client's categories match)
    const filteredClients = useMemo(() => {
        if (!activeCategory) return clients;
        return clients.filter((client) =>
            client.categories?.some((cat) => cat.id === activeCategory)
        );
    }, [clients, activeCategory]);

    // Animation on filter change
    useEffect(() => {
        if (!gridRef.current || clientsLoading) return;

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
    }, [filteredClients, clientsLoading]);

    const isLoading = clientsLoading || categoriesLoading;

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
                    ) : filteredClients.length === 0 ? (
                        // Empty state
                        <div className="col-span-full text-center py-golden-7">
                            <p className="text-muted text-lg">
                                No projects found in this category
                            </p>
                        </div>
                    ) : (
                        // Project cards
                        filteredClients.map((client) => (
                            <ProjectCard key={client.id} client={client} />
                        ))
                    )}
                </div>
            </section>
        </>
    );
};

// Separate component for better performance with masonry layout
const ProjectCard = ({ client }: { client: Client }) => {
    return (
        <Link
            to={`/projects/${client.slug}`}
            className="project-card card group cursor-pointer mb-golden-5 break-inside-avoid block"
        >
            {/* Thumbnail/Cover */}
            <div className="relative bg-secondary/20 rounded-lg overflow-hidden">
                {client.thumbnailUrl ? (
                    <img
                        src={client.thumbnailUrl}
                        alt={client.name}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
                )}
            </div>

            {/* Client Info */}
            <div className="pt-golden-4 flex items-start gap-golden-3">
                {/* Logo */}
                {client.logoUrl && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-secondary/20">
                        <img
                            src={client.logoUrl}
                            alt={`${client.name} logo`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                        {client.name}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default Projects;
