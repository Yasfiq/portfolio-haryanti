import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero';
import Showcase from '../components/sections/Showcase';
import Skills from '../components/sections/Skills';
// import Services from '../components/sections/Services'; // Temporarily hidden per client request
// import Experience from '../components/sections/Experience'; // Old version (backup)
import ExperienceV2 from '../components/sections/ExperienceV2';
import ContactCTA from '../components/sections/ContactCTA';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Haryanti - Graphic Designer & Content Creator</title>
                <meta
                    name="description"
                    content="Portfolio of Haryanti, a creative graphic designer and content creator specializing in brand design, UI/UX, and social media content."
                />
            </Helmet>

            {/* Hero Section - supports multiple templates per slide */}
            <Hero />

            <Showcase />
            <Skills />
            {/* <Services /> */}{/* Temporarily hidden per client request */}
            <ExperienceV2 />
            <ContactCTA />
        </>
    );
};

export default Home;
