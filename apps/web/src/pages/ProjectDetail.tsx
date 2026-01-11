import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProjectBySlug } from '../hooks/useProjects';

const ProjectDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data: project, isLoading, error } = useProjectBySlug(slug);

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
    if (error || !project) {
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

    return (
        <>
            <Helmet>
                <title>{project.title} - Haryanti</title>
                <meta name="description" content={project.summary} />
            </Helmet>

            <article className="pt-24">
                {/* Hero */}
                <section className="section-container">
                    <div className="max-w-4xl mx-auto">
                        {/* Simplified: Removed category badge per client request */}
                        <h1 className="text-2xl md:text-3xl font-bold mb-golden-5">
                            {project.title}
                        </h1>
                        {/* Simplified: Removed client/year info per client request */}
                    </div>

                    {/* Hero Image / Video */}
                    <div className="aspect-video bg-secondary/20 rounded-2xl mb-golden-8 overflow-hidden">
                        {project.videoUrl ? (
                            <video
                                src={project.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                poster={project.thumbnailUrl}
                            />
                        ) : project.thumbnailUrl ? (
                            <img
                                src={project.thumbnailUrl}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        )}
                    </div>
                </section>

                {/* Summary */}
                {project.summary && (
                    <section className="section-container py-golden-6">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg text-muted leading-relaxed">
                                {project.summary}
                            </p>
                        </div>
                    </section>
                )}

                {/* Case Study - Hidden per client request (Problem/Solution/Result removed) */}

                {/* Gallery */}
                {project.gallery && project.gallery.length > 0 && (
                    <section className="section-container py-golden-6">
                        <h2 className="text-xl font-semibold mb-golden-5">Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-golden-5">
                            {project.gallery.map((image) => (
                                <div
                                    key={image.id}
                                    className="aspect-[4/3] bg-secondary/20 rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={image.url}
                                        alt={`${project.title} gallery`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
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
                        <p className="text-muted text-sm">
                            {project.likes > 0 && `${project.likes} likes`}
                        </p>
                    </div>
                </section>
            </article>
        </>
    );
};

export default ProjectDetail;
