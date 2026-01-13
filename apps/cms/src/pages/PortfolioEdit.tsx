import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, ChevronDown, AlertCircle, RefreshCw, Loader2, FolderOpen, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import ImageCropModal from '../components/ui/ImageCropModal';
import { PortfolioEditSkeleton } from '../components/skeletons/PortfoliosSkeleton';
import {
    usePortfolio,
    useCreatePortfolio,
    useUpdatePortfolio,
    useAddGalleryImage,
    useRemoveGalleryImages,
    useClientCategories,
} from '../hooks/usePortfolios';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';
import { generateSlug } from '../lib/utils';
import type { CreatePortfolioInput, UpdatePortfolioInput, PortfolioImage } from '../types/portfolio.types';

interface FormData {
    title: string;
    slug: string;
    categoryId: string;
    date: string;
    summary: string;
    thumbnailUrl: string;
    isVisible: boolean;
}

const defaultFormData: FormData = {
    title: '',
    slug: '',
    categoryId: '',
    date: '',
    summary: '',
    thumbnailUrl: '',
    isVisible: false,
};

type UploadTarget = 'thumbnail' | 'gallery';

export default function PortfolioEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === 'new';

    const { data: portfolio, isLoading, isError, error, refetch } = usePortfolio(id);
    const { data: categories = [] } = useClientCategories();
    const createMutation = useCreatePortfolio();
    const updateMutation = useUpdatePortfolio();
    const addGalleryMutation = useAddGalleryImage();
    const removeGalleryMutation = useRemoveGalleryImages();
    const { uploadAvatar, isUploading } = useUpload();
    const toast = useToastHelpers();

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Crop modal state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [uploadTarget, setUploadTarget] = useState<UploadTarget>('thumbnail');

    // Gallery state
    const [galleryImages, setGalleryImages] = useState<PortfolioImage[]>([]);
    const [selectedGalleryIds, setSelectedGalleryIds] = useState<Set<string>>(new Set());

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: defaultFormData,
    });

    const title = watch('title');
    const thumbnailUrl = watch('thumbnailUrl');
    const isVisible = watch('isVisible');

    // Populate form when editing
    useEffect(() => {
        if (portfolio && !isNew) {
            reset({
                title: portfolio.title,
                slug: portfolio.slug,
                categoryId: portfolio.categoryId || '',
                date: portfolio.date ? portfolio.date.split('T')[0] : '',
                summary: portfolio.summary,
                thumbnailUrl: portfolio.thumbnailUrl,
                isVisible: portfolio.isVisible,
            });
            setGalleryImages(portfolio.gallery || []);
        }
    }, [portfolio, isNew, reset]);

    // Auto-generate slug from title
    const handleTitleBlur = () => {
        if (title && !watch('slug')) {
            setValue('slug', generateSlug(title));
        }
    };

    // Handle file selection - open crop modal
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, target: UploadTarget) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setUploadTarget(target);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Handle cropped image upload
    const handleCroppedImage = async (croppedBlob: Blob) => {
        const file = new File([croppedBlob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });

        const result = await uploadAvatar(file);
        if (result) {
            if (uploadTarget === 'thumbnail') {
                setValue('thumbnailUrl', result.url);
                toast.success('Berhasil', 'Thumbnail berhasil diupload');
            } else {
                // Add to gallery (only for edit mode)
                if (!isNew && id) {
                    try {
                        const newImage = await addGalleryMutation.mutateAsync({
                            portfolioId: id,
                            data: { url: result.url }
                        });
                        setGalleryImages(prev => [...prev, newImage]);
                        toast.success('Berhasil', 'Gambar gallery berhasil ditambahkan');
                    } catch (err) {
                        toast.error('Error', 'Gagal menambahkan gambar ke gallery');
                    }
                } else {
                    toast.info('Info', 'Gallery akan tersimpan setelah portfolio dibuat');
                }
            }
        }

        setCropModalOpen(false);
        setImageToCrop(null);
    };

    // Toggle gallery image selection
    const toggleGallerySelection = (imageId: string) => {
        setSelectedGalleryIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageId)) {
                newSet.delete(imageId);
            } else {
                newSet.add(imageId);
            }
            return newSet;
        });
    };

    // Remove selected gallery images
    const handleRemoveSelectedGallery = async () => {
        if (selectedGalleryIds.size === 0 || !id) return;

        try {
            await removeGalleryMutation.mutateAsync({
                portfolioId: id,
                data: { imageIds: Array.from(selectedGalleryIds) }
            });
            setGalleryImages(prev => prev.filter(img => !selectedGalleryIds.has(img.id)));
            setSelectedGalleryIds(new Set());
            toast.success('Berhasil', `${selectedGalleryIds.size} gambar berhasil dihapus`);
        } catch (err) {
            toast.error('Error', 'Gagal menghapus gambar');
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!data.title.trim()) {
            toast.error('Validasi', 'Title wajib diisi');
            return;
        }
        if (!data.categoryId) {
            toast.error('Validasi', 'Category wajib dipilih');
            return;
        }
        if (!data.date) {
            toast.error('Validasi', 'Date wajib diisi');
            return;
        }
        if (!data.summary.trim()) {
            toast.error('Validasi', 'Summary wajib diisi');
            return;
        }
        if (!data.thumbnailUrl) {
            toast.error('Validasi', 'Thumbnail wajib diupload');
            return;
        }

        try {
            if (isNew) {
                const createData: CreatePortfolioInput = {
                    title: data.title,
                    categoryId: data.categoryId,
                    date: data.date,
                    summary: data.summary,
                    thumbnailUrl: data.thumbnailUrl,
                    isVisible: data.isVisible,
                };
                await createMutation.mutateAsync(createData);
                toast.success('Berhasil', 'Portfolio berhasil dibuat');
            } else {
                const updateData: UpdatePortfolioInput = {
                    title: data.title,
                    categoryId: data.categoryId,
                    date: data.date,
                    summary: data.summary,
                    thumbnailUrl: data.thumbnailUrl,
                    isVisible: data.isVisible,
                };
                await updateMutation.mutateAsync({ id: id!, data: updateData });
                toast.success('Berhasil', 'Portfolio berhasil diperbarui');
            }
            navigate('/portfolios');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan portfolio';
            toast.error('Error', message);
        }
    };

    // Loading state for edit mode
    if (!isNew && isLoading) {
        return <PortfolioEditSkeleton />;
    }

    // Error state
    if (!isNew && isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Portfolio
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Portfolio tidak ditemukan.'}
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate('/portfolios')}>
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                    <Button variant="secondary" onClick={() => refetch()}>
                        <RefreshCw size={16} />
                        Coba Lagi
                    </Button>
                </div>
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    // Group categories by client for display
    const groupedCategories = categories.reduce((acc, cat) => {
        const clientName = cat.client?.name || 'No Client';
        if (!acc[clientName]) {
            acc[clientName] = [];
        }
        acc[clientName].push(cat);
        return acc;
    }, {} as Record<string, typeof categories>);

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back button */}
            <button
                onClick={() => navigate('/portfolios')}
                className="flex items-center gap-2 text-cms-text-secondary hover:text-cms-text-primary transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Portfolios
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader
                        title="Portfolio Details"
                        description="Informasi dasar tentang portfolio"
                    />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Title"
                                placeholder="Portfolio title"
                                error={errors.title?.message}
                                {...register('title', { onBlur: handleTitleBlur })}
                            />
                            <Input
                                label="Slug (URL)"
                                placeholder="portfolio-title"
                                error={errors.slug?.message}
                                {...register('slug')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category Dropdown - grouped by client */}
                            <div>
                                <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                    Client / Category *
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('categoryId')}
                                        className="w-full px-4 py-2.5 bg-cms-bg-secondary border border-cms-border rounded-lg text-cms-text-primary appearance-none cursor-pointer focus:outline-none focus:border-cms-accent transition-colors"
                                    >
                                        <option value="">Select Category</option>
                                        {Object.entries(groupedCategories).map(([clientName, cats]) => (
                                            <optgroup key={clientName} label={clientName}>
                                                {cats.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-text-muted pointer-events-none"
                                    />
                                </div>
                            </div>
                            <Input
                                label="Date"
                                type="date"
                                error={errors.date?.message}
                                {...register('date')}
                            />
                        </div>

                        <Textarea
                            label="Summary"
                            placeholder="Brief description of the portfolio..."
                            error={errors.summary?.message}
                            {...register('summary')}
                        />
                    </div>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader
                        title="Media"
                        description="Thumbnail dan galeri gambar portfolio"
                    />

                    <div className="space-y-6">
                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                Thumbnail *
                            </label>
                            <div className="flex items-start gap-4">
                                <div className="w-40 h-28 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center overflow-hidden">
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <FolderOpen size={24} className="text-cms-text-muted" />
                                    )}
                                </div>
                                <div>
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageSelect(e, 'thumbnail')}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        disabled={isUploading && uploadTarget === 'thumbnail'}
                                    >
                                        {isUploading && uploadTarget === 'thumbnail' ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Upload size={16} />
                                        )}
                                        Upload Thumbnail
                                    </Button>
                                    <p className="text-xs text-cms-text-muted mt-2">
                                        Pilih aspect ratio saat crop
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gallery - Only show for edit mode */}
                        {!isNew && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-cms-text-secondary">
                                        Gallery ({galleryImages.length} gambar)
                                    </label>
                                    {selectedGalleryIds.size > 0 && (
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            onClick={handleRemoveSelectedGallery}
                                            isLoading={removeGalleryMutation.isPending}
                                        >
                                            <X size={14} />
                                            Hapus ({selectedGalleryIds.size})
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {galleryImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${selectedGalleryIds.has(img.id)
                                                ? 'ring-2 ring-cms-accent ring-offset-2 ring-offset-cms-bg-primary'
                                                : 'hover:opacity-90'
                                                }`}
                                            onClick={() => toggleGallerySelection(img.id)}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedGalleryIds.has(img.id) && (
                                                <div className="absolute inset-0 bg-cms-accent/20 flex items-center justify-center">
                                                    <div className="w-6 h-6 bg-cms-accent rounded-full flex items-center justify-center">
                                                        <X size={14} className="text-black" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Add Image Button */}
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        disabled={isUploading && uploadTarget === 'gallery'}
                                        className="aspect-square rounded-lg border-2 border-dashed border-cms-border hover:border-cms-accent flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        {isUploading && uploadTarget === 'gallery' ? (
                                            <Loader2 size={24} className="text-cms-text-muted animate-spin" />
                                        ) : (
                                            <>
                                                <Plus size={24} className="text-cms-text-muted" />
                                                <span className="text-xs text-cms-text-muted">Tambah</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageSelect(e, 'gallery')}
                                />
                                <p className="text-xs text-cms-text-muted mt-2">
                                    Klik gambar untuk memilih, lalu hapus yang dipilih
                                </p>
                            </div>
                        )}

                        {isNew && (
                            <div className="p-4 bg-cms-bg-secondary rounded-lg border border-cms-border">
                                <div className="flex items-center gap-3 text-cms-text-muted">
                                    <ImageIcon size={20} />
                                    <p className="text-sm">
                                        Gallery dapat ditambahkan setelah portfolio dibuat
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Visibility */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-cms-text-primary">Visibility</p>
                            <p className="text-sm text-cms-text-secondary">
                                Portfolio akan tampil di website jika visible
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isVisible}
                                onChange={(e) => setValue('isVisible', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-cms-bg-secondary border border-cms-border rounded-full peer-checked:bg-cms-accent peer-checked:border-cms-accent transition-colors">
                                <div className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-transform ${isVisible ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}></div>
                            </div>
                        </label>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/portfolios')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        <Save size={18} />
                        {isNew ? 'Create Portfolio' : 'Save Changes'}
                    </Button>
                </div>
            </form>

            {/* Image Crop Modal with Aspect Presets */}
            {imageToCrop && (
                <ImageCropModal
                    isOpen={cropModalOpen}
                    onClose={() => {
                        setCropModalOpen(false);
                        setImageToCrop(null);
                    }}
                    imageSrc={imageToCrop}
                    onCropComplete={handleCroppedImage}
                    showAspectPresets={true}
                    aspectRatio={uploadTarget === 'thumbnail' ? 16 / 9 : undefined}
                    title={uploadTarget === 'thumbnail' ? 'Crop Thumbnail' : 'Crop Gambar Gallery'}
                />
            )}
        </div>
    );
}
