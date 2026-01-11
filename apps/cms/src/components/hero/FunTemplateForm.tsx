import { useRef } from 'react';
import { Image, Upload, X, Loader2, Quote, Star, Sparkles } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import type { FunSchemaContent } from '../../types/heroSlide.types';

interface FunTemplateFormProps {
    schema: FunSchemaContent;
    onChange: (schema: FunSchemaContent) => void;
    imageUrl: string | null;
    onImageSelect: (file: File) => void;
    onImageRemove: () => void;
    isUploading: boolean;
}

/**
 * Form fields for Fun hero template
 * Layout matches the modern hero design with:
 * - Hello greeting bubble
 * - "I'm [Name], [Role]" title
 * - Quote box with decorative marks
 * - Profile image with circular background
 * - Experience badge with stars
 */
export default function FunTemplateForm({
    schema,
    onChange,
    imageUrl,
    onImageSelect,
    onImageRemove,
    isUploading,
}: FunTemplateFormProps) {
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
        e.target.value = '';
    };

    const updateField = <K extends keyof FunSchemaContent>(
        field: K,
        value: FunSchemaContent[K]
    ) => {
        onChange({ ...schema, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Live Preview Section */}
            <div className="bg-gradient-to-br from-cms-bg-secondary to-cms-bg-tertiary rounded-2xl p-6 border border-cms-border">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-cms-accent" />
                    <span className="text-sm font-medium text-cms-text-secondary">Preview</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Greeting Bubble Preview */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cms-accent/30 bg-cms-accent/10">
                        <span className="text-lg">👋</span>
                        <span className="text-sm font-medium text-cms-text-primary">
                            {schema.greeting || 'Hello!'}
                        </span>
                    </div>

                    {/* Title Preview */}
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-cms-text-primary">
                            I'm <span className="text-cms-accent">{schema.name || 'Nama'}</span>,
                        </h3>
                        <p className="text-lg text-cms-accent">
                            {schema.role || 'Role/Jabatan'}
                        </p>
                    </div>

                    {/* Image Preview */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center overflow-hidden">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl text-white/80">
                                    {schema.name?.charAt(0) || '?'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quote & Experience Preview Row */}
                    <div className="flex items-start gap-6 w-full max-w-md">
                        {/* Quote Preview */}
                        <div className="flex-1 text-left relative">
                            <Quote size={14} className="text-cms-accent mb-1" />
                            <p className="text-xs text-cms-text-muted line-clamp-3">
                                {schema.quotes || 'Quote akan ditampilkan di sini...'}
                            </p>
                        </div>

                        {/* Experience Preview */}
                        <div className="text-right flex flex-col items-end">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} size={10} className="fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-sm font-bold text-cms-text-primary mt-1">
                                {schema.experience || '0 Years'}
                            </p>
                            <p className="text-xs text-cms-text-muted">Experience</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
                {/* Section: Greeting */}
                <fieldset className="space-y-3 p-4 bg-cms-bg-secondary/50 rounded-xl border border-cms-border/50">
                    <legend className="text-xs font-semibold text-cms-text-muted uppercase tracking-wider px-2">
                        Greeting Bubble
                    </legend>
                    <Input
                        label="Teks Greeting"
                        placeholder="Hello!"
                        value={schema.greeting || ''}
                        onChange={(e) => updateField('greeting', e.target.value)}
                    />
                </fieldset>

                {/* Section: Identity */}
                <fieldset className="space-y-3 p-4 bg-cms-bg-secondary/50 rounded-xl border border-cms-border/50">
                    <legend className="text-xs font-semibold text-cms-text-muted uppercase tracking-wider px-2">
                        Identitas
                    </legend>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nama"
                            placeholder="contoh: Haryanti"
                            value={schema.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                        />
                        <Input
                            label="Role / Jabatan"
                            placeholder="contoh: Graphic Designer"
                            value={schema.role || ''}
                            onChange={(e) => updateField('role', e.target.value)}
                        />
                    </div>
                </fieldset>

                {/* Section: Quote */}
                <fieldset className="space-y-3 p-4 bg-cms-bg-secondary/50 rounded-xl border border-cms-border/50">
                    <legend className="text-xs font-semibold text-cms-text-muted uppercase tracking-wider px-2">
                        Quote / Bio
                    </legend>
                    <Textarea
                        label="Deskripsi Singkat"
                        placeholder="Multimedia graduate from SMK Citra Pariwisata Bogor with 2 years of experience in the creative industry. Skilled in visual design (posters, logos, packaging) for branding & marketing..."
                        value={schema.quotes || ''}
                        onChange={(e) => updateField('quotes', e.target.value)}
                        rows={4}
                    />
                    <p className="text-xs text-cms-text-muted">
                        Teks ini akan ditampilkan di sebelah kiri foto dengan ikon quote.
                    </p>
                </fieldset>

                {/* Section: Experience */}
                <fieldset className="space-y-3 p-4 bg-cms-bg-secondary/50 rounded-xl border border-cms-border/50">
                    <legend className="text-xs font-semibold text-cms-text-muted uppercase tracking-wider px-2">
                        Experience Badge
                    </legend>
                    <Input
                        label="Tahun Pengalaman"
                        placeholder="contoh: 2 Years"
                        value={schema.experience || ''}
                        onChange={(e) => updateField('experience', e.target.value)}
                    />
                    <p className="text-xs text-cms-text-muted">
                        Ditampilkan di sebelah kanan foto dengan bintang rating.
                    </p>
                </fieldset>

                {/* Section: Profile Image */}
                <fieldset className="space-y-3 p-4 bg-cms-bg-secondary/50 rounded-xl border border-cms-border/50">
                    <legend className="text-xs font-semibold text-cms-text-muted uppercase tracking-wider px-2">
                        Foto Profil
                    </legend>

                    <div className="flex items-center gap-6">
                        {/* Image Upload Area */}
                        {imageUrl ? (
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400/30 bg-gradient-to-br from-orange-400 to-orange-500">
                                    <img
                                        src={imageUrl}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-full">
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                                    >
                                        <Upload size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onImageRemove}
                                        className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-32 h-32 border-2 border-dashed border-cms-border rounded-full flex flex-col items-center justify-center gap-2 hover:border-cms-accent hover:bg-cms-accent/5 transition-all disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <Loader2 size={24} className="text-cms-text-muted animate-spin" />
                                ) : (
                                    <>
                                        <Image size={24} className="text-cms-text-muted" />
                                        <span className="text-xs text-cms-text-muted">Upload</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Upload Instructions */}
                        <div className="flex-1 space-y-2">
                            <p className="text-sm text-cms-text-secondary">
                                Upload foto profil yang akan ditampilkan dengan background lingkaran berwarna.
                            </p>
                            <ul className="text-xs text-cms-text-muted space-y-1 list-disc list-inside">
                                <li>Gunakan foto dengan background transparan (PNG) untuk efek terbaik</li>
                                <li>Foto akan ditampilkan dengan efek breakout dari lingkaran</li>
                                <li>Ukuran rekomendasi: 500x500px atau lebih</li>
                            </ul>
                        </div>
                    </div>

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </fieldset>
            </div>
        </div>
    );
}
