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
    return {
        background: `linear-gradient(135deg, ${skill.gradientFrom || '#666'} 0%, ${skill.gradientTo || '#333'} 100%)`,
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

        // Animate soft skill cards
        gsap.fromTo(
            softContainer.querySelectorAll('.soft-skill-card'),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: softContainer,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        // Animate hard skill cards
        gsap.fromTo(
            hardContainer.querySelectorAll('.hard-skill-card'),
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.08,
                scrollTrigger: {
                    trigger: hardContainer,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
                {/* Hard Skills - CUBE SHAPE (#6) */}
                <div>
                    <h3 className="text-lg font-semibold mb-golden-5 text-primary">
                        Hard Skills
                    </h3>
                    <div ref={hardSkillsRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {hardSkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="hard-skill-card group relative overflow-hidden aspect-square cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                                style={{
                                    ...getGradientStyle(skill),
                                    // CUBE SHAPE: use very small border-radius or none for cube effect
                                    borderRadius: '12px',
                                }}
                            >
                                {/* Glassmorphism overlay */}
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

                                {/* Content - centered in cube */}
                                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-3">
                                    {/* Icon - either uploaded image or fallback */}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm mb-3 text-white group-hover:scale-110 transition-transform duration-300">
                                        {skill.iconUrl ? (
                                            <img
                                                src={skill.iconUrl}
                                                alt={skill.name}
                                                className="w-8 h-8 object-contain"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold">
                                                {(skill.shortName || skill.name).charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-white drop-shadow-md">
                                        {skill.shortName || skill.name}
                                    </span>
                                </div>

                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </div>
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
