import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const cardsRef = useRef<HTMLDivElement>(null);

    const services = [
        {
            icon: '🎨',
            title: 'Brand Design',
            description:
                'Logo design, visual identity, brand guidelines, and complete branding solutions for businesses.',
        },
        {
            icon: '📱',
            title: 'UI/UX Design',
            description:
                'User interface and experience design for web and mobile applications with focus on usability.',
        },
        {
            icon: '📸',
            title: 'Content Creator',
            description:
                'Social media content, marketing materials, and visual storytelling for digital platforms.',
        },
    ];

    useEffect(() => {
        const cards = cardsRef.current?.querySelectorAll('.service-card');
        if (!cards) return;

        gsap.fromTo(
            cards,
            { y: 40, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: 'top 75%',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section className="section-container">
            <div className="text-center mb-golden-7">
                <h2 className="text-xl md:text-2xl font-bold mb-golden-3">
                    What I Can Do For You
                </h2>
                <p className="text-muted">
                    Specialized services tailored to your needs
                </p>
            </div>

            <div
                ref={cardsRef}
                className="grid md:grid-cols-3 gap-golden-5 max-w-5xl mx-auto"
            >
                {services.map((service) => (
                    <div
                        key={service.title}
                        className="service-card card text-center group"
                    >
                        <div className="text-4xl mb-golden-5 group-hover:scale-110 transition-transform duration-300">
                            {service.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-golden-3 group-hover:text-primary transition-colors">
                            {service.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
