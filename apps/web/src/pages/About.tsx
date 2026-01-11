import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About - Haryanti</title>
                <meta
                    name="description"
                    content="Learn more about Haryanti, a passionate graphic designer and content creator."
                />
            </Helmet>

            <section className="section-container pt-32">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Section */}
                    <div className="grid md:grid-cols-2 gap-golden-7 items-center mb-golden-8">
                        {/* Avatar */}
                        <div className="aspect-square bg-secondary/20 rounded-2xl overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        </div>

                        {/* Bio */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-golden-4">
                                Hello, I'm Haryanti
                            </h1>
                            <p className="text-lg text-primary font-medium mb-golden-5">
                                Graphic Designer & Content Creator
                            </p>
                            <p className="text-muted leading-relaxed mb-golden-5">
                                With over 4 years of experience in the creative industry, I
                                specialize in creating stunning brand identities, user
                                interfaces, and engaging social media content that connects with
                                audiences.
                            </p>
                            <p className="text-muted leading-relaxed">
                                I believe in the power of visual storytelling and work closely
                                with my clients to bring their visions to life.
                            </p>
                        </div>
                    </div>

                    {/* Skills Section Placeholder */}
                    <div className="mb-golden-8">
                        <h2 className="text-xl font-bold mb-golden-5 text-center">
                            Skills & Expertise
                        </h2>
                        <p className="text-muted text-center">
                            Skills section will be implemented here
                        </p>
                    </div>

                    {/* Education Timeline Placeholder */}
                    <div>
                        <h2 className="text-xl font-bold mb-golden-5 text-center">
                            Education
                        </h2>
                        <p className="text-muted text-center">
                            Education timeline will be implemented here
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
