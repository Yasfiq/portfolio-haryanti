import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSettings } from '../../../hooks/useSettings';

interface HeroFunSlideProps {
    greeting?: string;
    name?: string;
    role?: string;
    quotes?: string;
    experience?: string;
    imageUrl?: string;
    backgroundColor?: string;
    backgroundFrom?: string;
    backgroundTo?: string;
    isInHorizontalScroll?: boolean; // Use less padding when in horizontal scroll mode
}

const HeroFunSlide = ({
    greeting,
    name,
    role,
    quotes,
    experience,
    imageUrl,
    backgroundColor,
    backgroundFrom,
    backgroundTo,
    isInHorizontalScroll = false,
}: HeroFunSlideProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { data: settings } = useSettings();
    const primaryColor = settings?.primaryColor || '#f97316';

    const getBackgroundStyle = () => {
        if (backgroundFrom && backgroundTo) {
            return `linear-gradient(135deg, ${backgroundFrom}, ${backgroundTo})`;
        }
        if (backgroundColor) {
            return backgroundColor;
        }
        return 'transparent';
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
        return () => { tl.kill(); };
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen relative overflow-hidden bg-background"
            style={{ background: getBackgroundStyle() }}
        >
            <div className={`container mx-auto px-4 md:px-8 lg:px-16 xl:px-24 ${isInHorizontalScroll ? 'pt-8 md:pt-10' : 'pt-28 md:pt-32 lg:pt-36'}`}>
                {/* Hello Bubble */}
                <div className="flex justify-center mb-3">
                    <div className="relative">
                        <svg className="absolute -left-10 md:-left-12 top-1/2 -translate-y-1/2 w-8 h-6" viewBox="0 0 40 24" fill="none">
                            <path d="M4 12C10 4 18 4 26 12C34 20 40 18 40 12" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
                            <circle cx="4" cy="12" r="2.5" fill={primaryColor} />
                        </svg>
                        <div className="px-5 py-2 rounded-full border-2 bg-white" style={{ borderColor: `${primaryColor}40` }}>
                            <span className="text-sm md:text-base font-medium text-foreground">{greeting || 'Hello!'}</span>
                        </div>
                        <svg className="absolute -right-10 md:-right-12 top-1/2 -translate-y-1/2 w-8 h-6 rotate-180" viewBox="0 0 40 24" fill="none">
                            <path d="M4 12C10 4 18 4 26 12C34 20 40 18 40 12" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
                            <circle cx="4" cy="12" r="2.5" fill={primaryColor} />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-4 relative z-[1]">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="italic text-foreground">I'm </span>
                        <span style={{ color: primaryColor }}>{name || 'Haryanti'}</span>
                        <span className="text-foreground">,</span>
                    </h1>
                    <div className="relative inline-block">
                        <svg className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-5 md:w-7 h-6" viewBox="0 0 24 32" fill="none">
                            <path d="M4 4L12 12L4 20L12 28" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold" style={{ color: primaryColor }}>
                            {role || 'Graphic Designer'}
                        </h2>
                    </div>
                </div>

                {/* Main 3-column layout with circle and person */}
                <div className="flex items-center justify-between relative">
                    {/* Left: Quote */}
                    <div className="hidden md:block w-1/4 self-center pr-4">
                        <div className="max-w-[250px]">
                            <svg className="w-8 h-8 lg:w-10 lg:h-10 mb-2" viewBox="0 0 32 32" fill="none">
                                <path d="M10 8C6 8 3 11 3 15C3 19 6 22 10 22C10 22 9 26 4 28C4 28 14 27 14 15C14 11 12 8 10 8ZM24 8C20 8 17 11 17 15C17 19 20 22 24 22C24 22 23 26 18 28C18 28 28 27 28 15C28 11 26 8 24 8Z" fill={primaryColor} opacity="0.5" />
                            </svg>
                            <p className="text-xs md:text-sm text-foreground leading-relaxed">
                                {quotes || 'Your bio or quote will appear here...'}
                            </p>
                        </div>
                    </div>

                    {/* Center: Circle + Person */}
                    <div className="flex-1 flex justify-center relative">
                        <div className="relative flex flex-col items-center">
                            {/* Orange semi-circle - large circle with bottom half hidden beyond viewport */}
                            <div
                                className="absolute -bottom-32 md:-bottom-40 lg:-bottom-48 xl:-bottom-56 w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] lg:w-[36rem] lg:h-[36rem] xl:w-[44rem] xl:h-[44rem] rounded-full z-[1]"
                                style={{ backgroundColor: primaryColor }}
                            />

                            {/* Person image - taller to break out from circle */}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={name || 'Profile'}
                                    className="relative z-[2] w-auto h-[55vh] md:h-[60vh] lg:h-[65vh] max-h-[550px] md:max-h-[600px] lg:max-h-[700px] object-contain object-bottom"
                                    style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))' }}
                                />
                            )}

                            {!imageUrl && (
                                <div className="relative z-[2] w-56 h-72 flex items-center justify-center text-7xl text-white/80 font-bold">
                                    {name?.charAt(0) || '?'}
                                </div>
                            )}

                            {/* Decorative dots */}
                            <div className="absolute top-1/3 -left-4 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />
                            <div className="absolute bottom-1/4 -right-6 w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />
                        </div>
                    </div>

                    {/* Right: Experience */}
                    <div className="hidden md:block w-1/4 self-center text-right pl-4">
                        <div className="flex flex-col items-end">
                            <div className="flex gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <svg key={i} className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 20 20" fill={primaryColor}>
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-none">
                                {experience || '2 Years'}
                            </p>
                            <p className="text-sm text-muted">Experience</p>
                        </div>
                    </div>
                </div>

                {/* Mobile: Quote and Experience */}
                <div className="md:hidden flex justify-between px-2 mt-4">
                    <div className="max-w-[45%]">
                        <svg className="w-6 h-6 mb-1" viewBox="0 0 32 32" fill="none">
                            <path d="M10 8C6 8 3 11 3 15C3 19 6 22 10 22C10 22 9 26 4 28C4 28 14 27 14 15C14 11 12 8 10 8ZM24 8C20 8 17 11 17 15C17 19 20 22 24 22C24 22 23 26 18 28C18 28 28 27 28 15C28 11 26 8 24 8Z" fill={primaryColor} opacity="0.5" />
                        </svg>
                        <p className="text-xs text-foreground leading-relaxed line-clamp-4">{quotes}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex gap-0.5 justify-end mb-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <svg key={i} className="w-3 h-3" viewBox="0 0 20 20" fill={primaryColor}>
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-xl font-black text-foreground">{experience || '2 Years'}</p>
                        <p className="text-xs text-muted">Experience</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroFunSlide;
