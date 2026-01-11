import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useUpload } from '../hooks/useUpload';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { HeroSlidesSkeleton } from '../components/skeletons/HeroSlidesSkeleton';
import { ClassicTemplateForm, FunTemplateForm } from '../components/hero';
import {
    useHeroSlides,
    useCreateHeroSlide,
    useUpdateHeroSlide,
    useDeleteHeroSlide,
    useToggleHeroSlideVisibility,
    useReorderHeroSlides
} from '../hooks/useHeroSlides';
import { useToastHelpers } from '../context/ToastContext';
import type {
    HeroSlide,
    HeroTemplate,
    ClassicSchemaContent,
    FunSchemaContent,
    HeroSchemaContent
} from '../types/heroSlide.types';
import { getDefaultSchema, getDefaultClassicSchema } from '../types/heroSlide.types';

type BackgroundType = 'none' | 'solid' | 'gradient';

interface FormData {
    title: string;
    template: HeroTemplate;
    schema: HeroSchemaContent;
    backgroundColor: string | null;
    backgroundFrom: string | null;
    backgroundTo: string | null;
    isVisible: boolean;
}

const defaultFormData: FormData = {
    title: '',
    template: 'classic',
    schema: getDefaultClassicSchema(),
    backgroundColor: null,
    backgroundFrom: null,
    backgroundTo: null,
    isVisible: true,
};

export default function HeroSlides() {
    const { data: slides = [], isLoading, isError, error, refetch } = useHeroSlides();
    const createMutation = useCreateHeroSlide();
    const updateMutation = useUpdateHeroSlide();
    const deleteMutation = useDeleteHeroSlide();
    const toggleVisibilityMutation = useToggleHeroSlideVisibility();
    const reorderMutation = useReorderHeroSlides();
    const toast = useToastHelpers();

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [editModal, setEditModal] = useState<{ isOpen: boolean; slide: HeroSlide | null }>({
        isOpen: false,
        slide: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; slide: HeroSlide | null }>({
        isOpen: false,
        slide: null,
    });
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [backgroundType, setBackgroundType] = useState<BackgroundType>('none');

    // Image upload state
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const { upload, isUploading } = useUpload();

    // Get image URL from current schema
    const getCurrentImageUrl = (): string | null => {
        if ('imageUrl' in formData.schema) {
            return formData.schema.imageUrl || null;
        }
        return null;
    };

    // Handle image select (from child form)
    const handleImageSelect = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageToCrop(event.target?.result as string);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    // Handle crop complete
    const handleCropComplete = async (croppedBlob: Blob) => {
        const file = new File([croppedBlob], 'hero-image.jpg', { type: 'image/jpeg' });
        const result = await upload(file);
        if (result) {
            setFormData({
                ...formData,
                schema: { ...formData.schema, imageUrl: result.url }
            });
        }
        setCropModalOpen(false);
        setImageToCrop(null);
    };

    // Remove image
    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            schema: { ...formData.schema, imageUrl: '' }
        });
    };

    // Handle template change
    const handleTemplateChange = (template: HeroTemplate) => {
        setFormData({
            ...formData,
            template,
            schema: getDefaultSchema(template),
        });
    };

    // Handle schema change from child forms
    const handleSchemaChange = (schema: HeroSchemaContent) => {
        setFormData({ ...formData, schema });
    };

    const openAddModal = () => {
        setFormData(defaultFormData);
        setBackgroundType('none');
        setEditModal({ isOpen: true, slide: null });
    };

    const openEditModal = (slide: HeroSlide) => {
        setFormData({
            title: slide.title,
            template: slide.template,
            schema: slide.schema,
            backgroundColor: slide.backgroundColor,
            backgroundFrom: slide.backgroundFrom,
            backgroundTo: slide.backgroundTo,
            isVisible: slide.isVisible,
        });
        if (slide.backgroundFrom && slide.backgroundTo) {
            setBackgroundType('gradient');
        } else if (slide.backgroundColor) {
            setBackgroundType('solid');
        } else {
            setBackgroundType('none');
        }
        setEditModal({ isOpen: true, slide });
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;

        // Clean background fields based on type
        const cleanedData = { ...formData };
        if (backgroundType === 'none') {
            cleanedData.backgroundColor = null;
            cleanedData.backgroundFrom = null;
            cleanedData.backgroundTo = null;
        } else if (backgroundType === 'solid') {
            cleanedData.backgroundFrom = null;
            cleanedData.backgroundTo = null;
        } else if (backgroundType === 'gradient') {
            cleanedData.backgroundColor = null;
        }

        try {
            if (editModal.slide) {
                await updateMutation.mutateAsync({
                    id: editModal.slide.id,
                    data: cleanedData,
                });
                toast.success('Berhasil', 'Slide berhasil diperbarui');
            } else {
                await createMutation.mutateAsync(cleanedData);
                toast.success('Berhasil', 'Slide berhasil ditambahkan');
            }
            setEditModal({ isOpen: false, slide: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan slide';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.slide) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.slide.id);
            toast.success('Berhasil', 'Slide berhasil dihapus');
            setDeleteModal({ isOpen: false, slide: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus slide';
            toast.error('Error', message);
        }
    };

    const handleToggleVisibility = async (slide: HeroSlide) => {
        try {
            await toggleVisibilityMutation.mutateAsync(slide.id);
            toast.success('Berhasil', slide.isVisible ? 'Slide disembunyikan' : 'Slide ditampilkan');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal mengubah visibilitas';
            toast.error('Error', message);
        }
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        dragItem.current = index;
        setDraggingIndex(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragEnter = (index: number) => {
        if (dragItem.current !== null && dragItem.current !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (dragItem.current === null || dragItem.current === dropIndex) {
            resetDragState();
            return;
        }

        const reorderedSlides = [...slides];
        const draggedItem = reorderedSlides[dragItem.current];
        reorderedSlides.splice(dragItem.current, 1);
        reorderedSlides.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync({
                items: reorderedSlides.map(s => ({ id: s.id })),
            });
            toast.success('Berhasil', 'Urutan slide berhasil diubah');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal mengubah urutan';
            toast.error('Error', message);
        }
    };

    const handleDragEnd = () => {
        resetDragState();
    };

    const resetDragState = () => {
        dragItem.current = null;
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const getBackgroundPreview = (slide: HeroSlide) => {
        if (slide.backgroundFrom && slide.backgroundTo) {
            return `linear-gradient(135deg, ${slide.backgroundFrom}, ${slide.backgroundTo})`;
        }
        if (slide.backgroundColor) {
            return slide.backgroundColor;
        }
        return 'var(--cms-bg-secondary)';
    };

    const getSlidePreviewImage = (slide: HeroSlide): string | null => {
        if ('imageUrl' in slide.schema) {
            return slide.schema.imageUrl || null;
        }
        return null;
    };

    const getSlideDescription = (slide: HeroSlide): string => {
        if (slide.template === 'classic') {
            const schema = slide.schema as ClassicSchemaContent;
            return `${schema.leftTitle || ''} • ${schema.rightTitle || ''}`.trim();
        }
        const schema = slide.schema as FunSchemaContent;
        return `${schema.name || ''} - ${schema.role || ''}`.trim();
    };

    // Loading state
    if (isLoading) {
        return <HeroSlidesSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Hero Slides
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data hero slides.'}
                </p>
                <Button variant="secondary" onClick={() => refetch()}>
                    <RefreshCw size={16} />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CardHeader
                title="Hero Slides"
                description="Kelola slide yang ditampilkan di hero section homepage"
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {slides.length} slides ({slides.filter(s => s.isVisible).length} visible)
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Slide
                </Button>
            </div>

            {/* Slides List */}
            <div className="space-y-4">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="relative">
                        {/* Drop indicator */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex > index && (
                            <div className="absolute -top-2 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}

                        <Card
                            className={`flex items-start gap-4 transition-all duration-200 ${draggingIndex === index
                                ? 'opacity-50 scale-[0.99] ring-2 ring-cms-accent/50'
                                : ''
                                }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            {/* Drag handle */}
                            <button className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-accent mt-2">
                                <GripVertical size={18} />
                            </button>

                            {/* Preview */}
                            <div
                                className="w-24 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border border-cms-border overflow-hidden"
                                style={{ background: getSlidePreviewImage(slide) ? 'transparent' : getBackgroundPreview(slide) }}
                            >
                                {getSlidePreviewImage(slide) ? (
                                    <img
                                        src={getSlidePreviewImage(slide)!}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-white/60">Slide {index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-cms-text-primary truncate">
                                        {slide.title}
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded ${slide.template === 'classic'
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {slide.template}
                                    </span>
                                    {!slide.isVisible && (
                                        <span className="text-xs px-2 py-0.5 bg-cms-bg-secondary rounded text-cms-text-muted">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-cms-text-muted truncate mt-0.5">
                                    {getSlideDescription(slide)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const visibleCount = slides.filter(s => s.isVisible).length;
                                    const isLastVisible = slide.isVisible && visibleCount <= 1;

                                    return (
                                        <button
                                            onClick={() => handleToggleVisibility(slide)}
                                            disabled={isLastVisible}
                                            className={`p-2 rounded transition-colors ${isLastVisible
                                                ? 'text-cms-text-muted/40 cursor-not-allowed'
                                                : slide.isVisible
                                                    ? 'text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary'
                                                    : 'text-cms-text-muted hover:text-cms-text-secondary hover:bg-cms-bg-secondary'
                                                }`}
                                            title={isLastVisible ? 'Minimal 1 slide harus tetap visible' : slide.isVisible ? 'Sembunyikan slide' : 'Tampilkan slide'}
                                        >
                                            {slide.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    );
                                })()}
                                <button
                                    onClick={() => openEditModal(slide)}
                                    className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: true, slide })}
                                    className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </Card>

                        {/* Drop indicator below */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex < index && (
                            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            {slides.length === 0 && (
                <Card className="text-center py-12">
                    <Layers size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada hero slides</p>
                    <button onClick={openAddModal} className="text-cms-accent hover:text-cms-accent-hover mt-2">
                        Tambahkan slide pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, slide: null })}
                title={editModal.slide ? 'Edit Slide' : 'Tambah Slide'}
                size="lg"
            >
                <div className="space-y-6">
                    {/* Slide Title */}
                    <Input
                        label="Nama Slide"
                        placeholder="contoh: Hero Utama"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    {/* Template Selector */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-cms-text-secondary">
                            Template
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleTemplateChange('classic')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${formData.template === 'classic'
                                    ? 'border-cms-accent bg-cms-accent/10'
                                    : 'border-cms-border hover:border-cms-accent/50'
                                    }`}
                            >
                                <h4 className="font-medium text-cms-text-primary">Classic</h4>
                                <p className="text-sm text-cms-text-muted mt-1">
                                    Layout tradisional dengan konten kiri/kanan
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTemplateChange('fun')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${formData.template === 'fun'
                                    ? 'border-cms-accent bg-cms-accent/10'
                                    : 'border-cms-border hover:border-cms-accent/50'
                                    }`}
                            >
                                <h4 className="font-medium text-cms-text-primary">Fun</h4>
                                <p className="text-sm text-cms-text-muted mt-1">
                                    Modern dengan greeting, quote, dan foto profil
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Template-specific Form */}
                    {formData.template === 'classic' ? (
                        <ClassicTemplateForm
                            schema={formData.schema as ClassicSchemaContent}
                            onChange={handleSchemaChange}
                            imageUrl={getCurrentImageUrl()}
                            onImageSelect={handleImageSelect}
                            onImageRemove={handleRemoveImage}
                            isUploading={isUploading}
                        />
                    ) : (
                        <FunTemplateForm
                            schema={formData.schema as FunSchemaContent}
                            onChange={handleSchemaChange}
                            imageUrl={getCurrentImageUrl()}
                            onImageSelect={handleImageSelect}
                            onImageRemove={handleRemoveImage}
                            isUploading={isUploading}
                        />
                    )}

                    {/* Background Options */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-cms-text-secondary">
                            Gaya Background (Opsional)
                        </label>
                        <div className="flex gap-2">
                            {(['none', 'solid', 'gradient'] as BackgroundType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setBackgroundType(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${backgroundType === type
                                        ? 'bg-cms-accent text-black'
                                        : 'bg-cms-bg-secondary text-cms-text-secondary hover:bg-cms-bg-tertiary'
                                        }`}
                                >
                                    {type === 'none' ? 'Tidak Ada' : type === 'solid' ? 'Solid' : 'Gradient'}
                                </button>
                            ))}
                        </div>

                        {backgroundType === 'solid' && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formData.backgroundColor || '#1a1a2e'}
                                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                    className="w-12 h-10 rounded-lg border border-cms-border cursor-pointer"
                                />
                                <Input
                                    value={formData.backgroundColor || ''}
                                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                    placeholder="#1a1a2e"
                                    className="flex-1"
                                />
                            </div>
                        )}

                        {backgroundType === 'gradient' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-cms-text-muted">From</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.backgroundFrom || '#1a1a2e'}
                                            onChange={(e) => setFormData({ ...formData, backgroundFrom: e.target.value })}
                                            className="w-10 h-8 rounded border border-cms-border cursor-pointer"
                                        />
                                        <Input
                                            value={formData.backgroundFrom || ''}
                                            onChange={(e) => setFormData({ ...formData, backgroundFrom: e.target.value })}
                                            placeholder="#1a1a2e"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-cms-text-muted">To</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.backgroundTo || '#16213e'}
                                            onChange={(e) => setFormData({ ...formData, backgroundTo: e.target.value })}
                                            className="w-10 h-8 rounded border border-cms-border cursor-pointer"
                                        />
                                        <Input
                                            value={formData.backgroundTo || ''}
                                            onChange={(e) => setFormData({ ...formData, backgroundTo: e.target.value })}
                                            placeholder="#16213e"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Background Preview */}
                        {backgroundType !== 'none' && (
                            <div
                                className="h-16 rounded-lg border border-cms-border flex items-center justify-center"
                                style={{
                                    background: backgroundType === 'gradient'
                                        ? `linear-gradient(135deg, ${formData.backgroundFrom || '#1a1a2e'}, ${formData.backgroundTo || '#16213e'})`
                                        : formData.backgroundColor || '#1a1a2e'
                                }}
                            >
                                <span className="text-sm text-white/60">Preview</span>
                            </div>
                        )}
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center justify-between p-3 bg-cms-bg-secondary rounded-lg">
                        <div>
                            <p className="font-medium text-cms-text-primary">Tampilkan</p>
                            <p className="text-sm text-cms-text-muted">Tampilkan slide ini di website</p>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                            className={`w-12 h-6 rounded-full transition-colors ${formData.isVisible ? 'bg-cms-accent' : 'bg-cms-bg-tertiary'
                                }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isVisible ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, slide: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!formData.title.trim()}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editModal.slide ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, slide: null })}
                title="Hapus Slide"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus slide "{deleteModal.slide?.title}"?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, slide: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isPending}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Image Crop Modal */}
            {imageToCrop && (
                <ImageCropModal
                    isOpen={cropModalOpen}
                    onClose={() => {
                        setCropModalOpen(false);
                        setImageToCrop(null);
                    }}
                    imageSrc={imageToCrop}
                    onCropComplete={handleCropComplete}
                    aspectRatio={formData.template === 'fun' ? 1 : 4 / 3}
                    title={formData.template === 'fun' ? 'Crop Foto Profil' : 'Crop Gambar Hero'}
                    showAspectPresets={formData.template === 'classic'}
                />
            )}
        </div>
    );
}
