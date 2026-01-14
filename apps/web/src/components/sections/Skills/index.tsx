import { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionDecoration from '../../shared/SectionDecoration';
import { useSkills } from '../../../hooks/useSkills';
import type { Skill } from '../../../types';

gsap.registerPlugin(ScrollTrigger);

// Fallback hard skills with default SVG icons
const fallbackHardSkills: Skill[] = [
    {
        id: '1',
        name: 'Adobe Photoshop',
        shortName: 'Photoshop',
        gradientFrom: '#31A8FF',
        gradientTo: '#001E36',
        category: 'HARD_SKILL',
        order: 0,
    },
    {
        id: '2',
        name: 'Figma',
        shortName: 'Figma',
        gradientFrom: '#F24E1E',
        gradientTo: '#1ABCFE',
        gradientVia: '#A259FF',
        category: 'HARD_SKILL',
        order: 1,
    },
    {
        id: '3',
        name: 'Adobe Illustrator',
        shortName: 'Illustrator',
        gradientFrom: '#FF9A00',
        gradientTo: '#330000',
        category: 'HARD_SKILL',
        order: 2,
    },
    {
        id: '4',
        name: 'Canva Pro',
        shortName: 'Canva',
        gradientFrom: '#00C4CC',
        gradientTo: '#7B2FF7',
        category: 'HARD_SKILL',
        order: 3,
    },
];

// Fallback soft skills
const fallbackSoftSkills: Skill[] = [
    { id: '5', name: 'Communication', category: 'SOFT_SKILL', order: 0 },
    { id: '6', name: 'Problem Solving', category: 'SOFT_SKILL', order: 1 },
    { id: '7', name: 'Time Management', category: 'SOFT_SKILL', order: 2 },
    { id: '8', name: 'Collaboration', category: 'SOFT_SKILL', order: 3 },
];

// Default soft skill icons mapping
const softSkillIcons: Record<string, string> = {
    'Communication': '🎯',
    'Problem Solving': '💡',
    'Time Management': '⏰',
    'Collaboration': '🤝',
};

// Helper to get gradient style
const getGradientStyle = (skill: Skill) => {
    if (skill.gradientVia) {
        return {
            background: `linear-gradient(135deg, ${skill.gradientFrom || '#666'} 0%, ${skill.gradientVia} 50%, ${skill.gradientTo || '#333'} 100%)`,
        };
    }

    if (skill.gradientTo) {
        return {
            background: `linear-gradient(135deg, ${skill.gradientFrom || '#666'} 0%, ${skill.gradientTo || '#333'} 100%)`,
        };
    }

    return {
        background: `${skill.gradientFrom || '#666'}`,
    };
};

const Skills = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const softSkillsRef = useRef<HTMLDivElement>(null);
    const hardSkillsRef = useRef<HTMLDivElement>(null);

    // Fetch skills from API
    const { data: apiSkills } = useSkills();

    // Separate and sort skills
    const { hardSkills, softSkills } = useMemo(() => {
        const skills = apiSkills && apiSkills.length > 0 ? apiSkills : [...fallbackHardSkills, ...fallbackSoftSkills];

        const hard = skills
            .filter((s) => s.category === 'HARD_SKILL')
            .sort((a, b) => a.order - b.order);

        const soft = skills
            .filter((s) => s.category === 'SOFT_SKILL')
            .sort((a, b) => a.order - b.order);

        return { hardSkills: hard.length > 0 ? hard : fallbackHardSkills, softSkills: soft.length > 0 ? soft : fallbackSoftSkills };
    }, [apiSkills]);

    useEffect(() => {
        const section = sectionRef.current;
        const softContainer = softSkillsRef.current;
        const hardContainer = hardSkillsRef.current;

        if (!section || !softContainer || !hardContainer) return;

        // Get elements
        const softCards = softContainer.querySelectorAll('.soft-skill-card');
        const hardCards = hardContainer.querySelectorAll('.hard-skill-card');

        if (softCards.length === 0 && hardCards.length === 0) return;

        // Set initial state
        gsap.set(softCards, { y: 30, opacity: 0 });
        gsap.set(hardCards, { scale: 0.8, opacity: 0 });

        // Animate soft skill cards
        const softAnim = gsap.to(softCards, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
                trigger: softContainer,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        });

        // Animate hard skill cards
        const hardAnim = gsap.to(hardCards, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            scrollTrigger: {
                trigger: hardContainer,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        });

        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();

        return () => {
            softAnim.scrollTrigger?.kill();
            hardAnim.scrollTrigger?.kill();
            softAnim.kill();
            hardAnim.kill();
        };
    }, [hardSkills.length, softSkills.length]);

    return (
        <section ref={sectionRef} className="section-container">
            {/* Section Title with Decoration */}
            <div className="relative text-center mb-golden-7">
                <SectionDecoration
                    position="top-left"
                    size="md"
                    className="absolute -top-4 left-1/2 -translate-x-32 md:-translate-x-40"
                />
                <h2 className="text-xl md:text-2xl font-bold">
                    Skills & Expertise
                </h2>
                <SectionDecoration
                    position="bottom-right"
                    size="sm"
                    className="absolute -bottom-2 left-1/2 translate-x-20 md:translate-x-28"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-golden-7">
                {/* Hard Skills - Compact Cards (#6) */}
                <div>
                    <h3 className="text-lg font-semibold mb-golden-5 text-primary">
                        Hard Skills
                    </h3>
                    <div ref={hardSkillsRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {hardSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="hard-skill-card group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-2"
                                style={getGradientStyle(skill)}
                            >
                                {/* Icon - directly on gradient background */}
                                <div className="flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                    {skill.iconUrl ? (
                                        <img
                                            src={skill.iconUrl}
                                            alt={skill.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold">
                                            {(skill.shortName || skill.name).charAt(0)}
                                        </span>
                                    )}
                                </div>
                                {/* Text */}
                                <span className="text-base font-medium drop-shadow-md leading-tight">
                                    {skill.shortName || skill.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Soft Skills - NO DESCRIPTION per client request (#6) */}
                <div ref={softSkillsRef}>
                    <h3 className="text-lg font-semibold mb-golden-5 text-primary">
                        Soft Skills
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {softSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="soft-skill-card card flex items-center gap-3 p-4"
                            >
                                {/* Icon - uploaded or default emoji */}
                                {skill.iconUrl ? (
                                    <img
                                        src={skill.iconUrl}
                                        alt={skill.name}
                                        className="w-8 h-8 object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl">
                                        {softSkillIcons[skill.name] || '✨'}
                                    </span>
                                )}
                                {/* Name only - NO description per client request */}
                                <span className="font-medium">{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
