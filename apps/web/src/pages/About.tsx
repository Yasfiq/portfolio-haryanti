import { Helmet } from 'react-helmet-async';
import { useProfile } from '../hooks/useProfile';
import { useSettings } from '../hooks/useSettings';
import Skills from '../components/sections/Skills';

const About = () => {
    const { data: profile } = useProfile();
    const { data: settings } = useSettings();

    // Get data from APIs with fallbacks
    const siteName = settings?.siteName || 'Haryanti';
    const title = profile?.title || 'Graphic Designer & Content Creator';
    const aboutBio = profile?.aboutBio || 'With years of experience in the creative industry, I specialize in creating stunning brand identities, user interfaces, and engaging content that connects with audiences. I believe in the power of visual storytelling and work closely with my clients to bring their visions to life.';
    const aboutImageUrl = profile?.aboutImageUrl;
    const primaryColor = settings?.primaryColor || '#f97316';

    return (
        <>
            <Helmet>
                <title>About - {siteName}</title>
                <meta
                    name="description"
                    content={`Learn more about ${siteName}, ${title.toLowerCase()}.`}
                />
            </Helmet>

            <section className="section-container pt-32">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Section - 2 Column Layout */}
                    <div className="grid md:grid-cols-2 gap-golden-7 items-start mb-golden-8">
                        {/* Photo */}
                        <div className="w-full max-w-md mx-auto">
                            {aboutImageUrl ? (
                                <img
                                    src={aboutImageUrl}
                                    alt={siteName}
                                    className="w-full h-full"
                                />
                            ) : (
                                /* Fallback placeholder */
                                <div
                                    className="aspect-square rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <span
                                        className="text-6xl md:text-8xl font-bold"
                                        style={{ color: 'rgba(255,255,255,0.8)' }}
                                    >
                                        {siteName.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-golden-4">
                                Hello, I'm {siteName}
                            </h1>
                            <p className="text-lg text-primary font-medium mb-golden-5">
                                {title}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-muted leading-relaxed whitespace-pre-line">
                            {aboutBio}
                        </p>
                    </div>
                </div>
            </section>

            {/* Skills Section - Same as Home Page */}
            <Skills />
        </>
    );
};

export default About;
