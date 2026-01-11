import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const name = 'HARYANTI';

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 20;
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            // Animate out after loading complete
            const tl = gsap.timeline({
                onComplete: () => setIsLoading(false),
            });

            tl.to('.letter', {
                y: -50,
                opacity: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power2.in',
            })
                .to(
                    progressBarRef.current,
                    {
                        scaleX: 0,
                        opacity: 0,
                        duration: 0.3,
                    },
                    '-=0.3'
                )
                .to(preloaderRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });
        }
    }, [progress]);

    // Staggered letter animation on mount
    useEffect(() => {
        const letters = textContainerRef.current?.querySelectorAll('.letter');
        if (letters) {
            gsap.fromTo(
                letters,
                {
                    y: 100,
                    opacity: 0,
                    rotateX: -90,
                },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: 'back.out(1.7)',
                }
            );
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
        >
            {/* Animated text with staggered letters */}
            <div
                ref={textContainerRef}
                className="overflow-hidden flex perspective-1000"
            >
                {name.split('').map((letter, index) => (
                    <span
                        key={index}
                        className="letter text-4xl md:text-6xl lg:text-8xl font-bold tracking-wider text-foreground inline-block"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            {/* Progress Bar at bottom - full width line */}
            <div
                ref={progressBarRef}
                className="fixed bottom-0 left-0 right-0 h-1 bg-muted/20"
            >
                <div
                    className="h-full bg-primary transition-all duration-150 ease-out origin-left"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default Preloader;
