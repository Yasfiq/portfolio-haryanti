import { useRef } from 'react';
import { Image, Upload, X, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import type { ClassicSchemaContent } from '../../types/heroSlide.types';

interface ClassicTemplateFormProps {
    schema: ClassicSchemaContent;
    onChange: (schema: ClassicSchemaContent) => void;
    imageUrl: string | null;
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
    isUploading: boolean;
}

/**
 * Form fields for Classic hero template
 * Layout: Title, Left/Right content areas, Hero image
 */
export default function ClassicTemplateForm({
    schema,
    onChange,
    imageUrl,
    onImageSelect,
    onImageRemove,
    isUploading,
}: ClassicTemplateFormProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
        e.target.value = '';
    };

    const updateField = <K extends keyof ClassicSchemaContent>(
        field: K,
        value: ClassicSchemaContent[K]
    ) => {
        onChange({ ...schema, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Main Title */}
            <Input
                label="Judul Slide"
                placeholder="contoh: Hello, I'm Haryanti"
                value={schema.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
            />

            {/* Left & Right Content */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-cms-text-secondary">Sisi Kiri</h4>
                    <Input
                        label="Judul"
                        placeholder="contoh: Graphic Designer"
                        value={schema.leftTitle || ''}
                        onChange={(e) => updateField('leftTitle', e.target.value)}
                    />
                    <Textarea
                        label="Subjudul"
                        placeholder="Deskripsi singkat..."
                        value={schema.leftSubtitle || ''}
                        onChange={(e) => updateField('leftSubtitle', e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-cms-text-secondary">Sisi Kanan</h4>
                    <Input
                        label="Judul"
                        placeholder="contoh: Content Creator"
                        value={schema.rightTitle || ''}
                        onChange={(e) => updateField('rightTitle', e.target.value)}
                    />
                    <Textarea
                        label="Subjudul"
                        placeholder="Deskripsi singkat..."
                        value={schema.rightSubtitle || ''}
                        onChange={(e) => updateField('rightSubtitle', e.target.value)}
                    />
                </div>
            </div>

            {/* Hero Image Upload */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-cms-text-secondary">
                    Gambar Hero
                </label>

                {imageUrl ? (
                    <div className="relative group">
                        <img
                            src={imageUrl}
                            alt="Hero preview"
                            className="w-full h-48 object-cover rounded-lg border border-cms-border"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                            >
                                <Upload size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={onImageRemove}
                                className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full h-32 border-2 border-dashed border-cms-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-cms-accent transition-colors disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 size={24} className="text-cms-text-muted animate-spin" />
                        ) : (
                            <>
                                <Image size={24} className="text-cms-text-muted" />
                                <span className="text-sm text-cms-text-muted">Klik untuk upload gambar</span>
                            </>
                        )}
                    </button>
                )}

                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
                <p className="text-xs text-cms-text-muted">
                    Gambar akan ditampilkan di tengah slide. Recommended: 800x600px atau lebih
                </p>
            </div>
        </div>
    );
}
