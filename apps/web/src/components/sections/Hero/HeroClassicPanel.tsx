import type { HeroSlide, ClassicSchemaContent } from '../../../types';

interface HeroClassicPanelProps {
    slide: HeroSlide;
    schema: ClassicSchemaContent;
    index: number;
}

/**
 * HeroClassicPanel - Classic Template Panel for horizontal scroll
 * Layout: Title at top, Left text, Center image, Right text
 */
export default function HeroClassicPanel({ slide, schema, index }: HeroClassicPanelProps) {
    // Helper to get background style
    const getBackgroundStyle = () => {
        if (slide.backgroundFrom && slide.backgroundTo) {
            return `linear-gradient(135deg, ${slide.backgroundFrom}, ${slide.backgroundTo})`;
        }
        if (slide.backgroundColor) {
            return slide.backgroundColor;
        }
        return 'transparent';
    };

    const bgStyle = getBackgroundStyle();
    const hasBackground = bgStyle !== 'transparent';

    return (
        <div
            className="hero-panel flex flex-col flex-shrink-0 relative h-full"
            style={{
                width: '100vw',
                background: bgStyle,
            }}
        >
            {/* Overlay for better text readability on colored backgrounds */}
            {hasBackground && (
                <div className="absolute inset-0 bg-background/60 pointer-events-none" />
            )}

            {/* Top - Title */}
            <div className="relative z-10 h-[10%] md:h-[15%] flex items-center justify-center px-4">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center">
                    {schema.title || slide.title}
                </h1>
            </div>

            {/* Main Content - Mobile: Vertical Stack, Desktop: 3-column */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row">

                {/* Desktop: Left Text */}
                <div className="hidden md:flex w-[25%] items-center justify-center px-golden-4">
                    <div className="text-left max-w-xs">
                        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                            {schema.leftTitle}
                        </h3>
                        <p className="text-xs md:text-sm text-muted leading-relaxed">
                            {schema.leftSubtitle}
                        </p>
                    </div>
                </div>

                {/* Center - Image */}
                <div className="w-full md:w-[50%] flex items-center justify-center p-4 md:p-golden-5 order-1 md:order-none flex-shrink-0 h-[45%] md:h-auto">
                    <div className="relative w-full h-full max-w-sm md:max-w-lg flex items-center justify-center">
                        {schema.imageUrl ? (
                            <img
                                src={schema.imageUrl}
                                alt={slide.title}
                                className="w-full h-full object-contain rounded-2xl md:rounded-3xl"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl md:rounded-3xl flex items-center justify-center">
                                <span className="text-muted text-sm">Image {index + 1}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile: Content Below Image */}
                <div className="flex md:hidden flex-col items-center justify-start px-6 py-4 order-2 flex-1 overflow-y-auto">
                    <div className="text-center max-w-sm">
                        <h3 className="text-base font-semibold text-foreground mb-2">
                            {schema.leftTitle}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
                            {schema.leftSubtitle}
                        </p>
                    </div>
                </div>

                {/* Desktop: Right Text */}
                <div className="hidden md:flex w-[25%] items-center justify-center px-golden-4">
                    <div className="text-right max-w-xs">
                        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                            {schema.rightTitle}
                        </h3>
                        <p className="text-xs md:text-sm text-muted leading-relaxed">
                            {schema.rightSubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
