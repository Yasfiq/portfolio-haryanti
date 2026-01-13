import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useClient } from '../hooks/useClients';

const ProjectDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: client, isLoading, error } = useClient(slug);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Loading state
    if (isLoading) {
        return (
            <>
                <Helmet>
                    <title>Loading... - Haryanti</title>
                </Helmet>
                <article className="pt-24 animate-pulse">
                    <section className="section-container">
                        <div className="max-w-4xl mx-auto">
                            <div className="h-4 bg-secondary/30 rounded w-24 mb-golden-3" />
                            <div className="h-8 bg-secondary/30 rounded w-2/3 mb-golden-5" />
                            <div className="flex gap-golden-5 mb-golden-7">
                                <div className="h-4 bg-secondary/20 rounded w-32" />
                                <div className="h-4 bg-secondary/20 rounded w-24" />
                            </div>
                        </div>
                        <div className="aspect-video bg-secondary/20 rounded-2xl mb-golden-8" />
                    </section>
                </article>
            </>
        );
    }

    // Error or not found
    if (error || !client) {
        return (
            <>
                <Helmet>
                    <title>Project Not Found - Haryanti</title>
                </Helmet>
                <section className="section-container pt-32 text-center">
                    <h1 className="text-2xl font-bold mb-golden-4">
                        Project Not Found
                    </h1>
                    <p className="text-muted mb-golden-6">
                        The project you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        ← Back to Projects
                    </Link>
                </section>
            </>
        );
    }

    // Get categories and determine which gallery to show
    const categories = client.categories ?? [];
    const currentCategory = activeCategory
        ? categories.find((c) => c.id === activeCategory)
        : categories[0]; // Default to first category

    const currentImages = currentCategory?.images ?? [];

    return (
        <>
            <Helmet>
                <title>{client.name} - Haryanti</title>
                <meta name="description" content={`Project gallery for ${client.name}`} />
            </Helmet>

            <article className="pt-24">
                {/* Header */}
                <section className="section-container">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl md:text-3xl font-bold mb-golden-5">
                            {client.name}
                        </h1>
                        {/* Show categories count */}
                        <p className="text-muted mb-golden-5">
                            {categories.length} categories •{' '}
                            {categories.reduce((acc, cat) => acc + (cat.images?.length ?? 0), 0)} images
                        </p>
                    </div>

                    {/* Hero Image */}
                    {client.thumbnailUrl && (
                        <div className="aspect-video bg-secondary/20 rounded-2xl mb-golden-8 overflow-hidden">
                            <img
                                src={client.thumbnailUrl}
                                alt={client.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </section>

                {/* Category Tabs */}
                {categories.length > 0 && (
                    <section className="section-container py-golden-6">
                        <div className="flex flex-wrap gap-golden-3 mb-golden-6">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-golden-5 py-golden-3 rounded-full text-sm font-medium transition-all duration-300 ${(activeCategory === category.id || (!activeCategory && category.id === categories[0]?.id))
                                        ? 'bg-primary text-white'
                                        : 'bg-tertiary/50 text-muted hover:text-foreground hover:bg-tertiary'
                                        }`}
                                >
                                    {category.name}
                                    <span className="ml-2 text-xs opacity-70">
                                        ({category.images?.length ?? 0})
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Masonry Gallery for Current Category */}
                        {currentImages.length > 0 ? (
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-golden-4">
                                {currentImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="mb-golden-4 break-inside-avoid rounded-xl overflow-hidden bg-secondary/20"
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${client.name} - ${currentCategory?.name}`}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-golden-7">
                                <p className="text-muted">No images in this category</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Empty state if no categories */}
                {categories.length === 0 && (
                    <section className="section-container py-golden-6 text-center">
                        <p className="text-muted">No gallery available for this project</p>
                    </section>
                )}

                {/* Navigation */}
                <section className="section-container py-golden-7">
                    <div className="flex justify-between items-center border-t border-secondary/20 pt-golden-6">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                </section>
            </article>
        </>
    );
};

export default ProjectDetail;
