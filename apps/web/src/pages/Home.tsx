import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import HeroModern from '../components/sections/Hero/HeroModern';
import Showcase from '../components/sections/Showcase';
import Skills from '../components/sections/Skills';
// import Services from '../components/sections/Services'; // Temporarily hidden per client request
import Experience from '../components/sections/Experience';
import ContactCTA from '../components/sections/ContactCTA';
import { useSettings } from '../hooks/useSettings';

const Home = () => {
    const { data: settings } = useSettings();

    // Choose Hero template based on CMS settings (default to 'slides')
    const heroTemplate = settings?.heroTemplate || 'slides';

    return (
        <>
            <Helmet>
                <title>Haryanti - Graphic Designer & Content Creator</title>
                <meta
                    name="description"
                    content="Portfolio of Haryanti, a creative graphic designer and content creator specializing in brand design, UI/UX, and social media content."
                />
            </Helmet>

            {/* Hero Template Switcher */}
            {heroTemplate === 'modern' ? <HeroModern /> : <Hero />}

            <Showcase />
            <Skills />
            {/* <Services /> */}{/* Temporarily hidden per client request */}
            <Experience />
            <ContactCTA />
        </>
    );
};

export default Home;
