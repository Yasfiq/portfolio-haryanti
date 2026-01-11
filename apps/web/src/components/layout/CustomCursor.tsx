import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (isMobile) return;

        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        if (!cursor || !cursorDot) return;

        // Mouse move handler
        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power2.out',
            });

            gsap.to(cursorDot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
        };

        // Hover handlers
        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        // Add listeners
        window.addEventListener('mousemove', onMouseMove);

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, [data-cursor-hover]'
        );
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', checkMobile);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, [isMobile]);

    // Scale animation for hover state
    useEffect(() => {
        if (isMobile) return;
        const cursor = cursorRef.current;
        if (!cursor) return;

        gsap.to(cursor, {
            scale: isHovering ? 1.5 : 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    }, [isHovering, isMobile]);

    if (isMobile) return null;

    return (
        <>
            {/* Outer cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50 pointer-events-none z-[9999] mix-blend-difference"
                style={{ willChange: 'transform' }}
            />
            {/* Inner dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary pointer-events-none z-[9999]"
                style={{ willChange: 'transform' }}
            />
        </>
    );
};

export default CustomCursor;
