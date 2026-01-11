import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, ChevronDown, AlertCircle, RefreshCw, Loader2, FolderOpen, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import ImageCropModal from '../components/ui/ImageCropModal';
import { ProjectEditSkeleton } from '../components/skeletons/ProjectsSkeleton';
import {
    useProject,
    useCreateProject,
    useUpdateProject,
    useAddGalleryImage,
    useRemoveGalleryImages,
} from '../hooks/useProjects';
import { useCategories } from '../hooks/useCategories';
import { useClients } from '../hooks/useClients';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';
import { generateSlug } from '../lib/utils';
import type { CreateProjectInput, UpdateProjectInput, ProjectImage } from '../types/project.types';

interface FormData {
    title: string;
    slug: string;
    clientId: string;
    projectDate: string;
    summary: string;
    problem: string;
    solution: string;
    result: string;
    thumbnailUrl: string;
    videoUrl: string;
    isVisible: boolean;
    categoryId: string;
}

const defaultFormData: FormData = {
    title: '',
    slug: '',
    clientId: '',
    projectDate: '',
    summary: '',
    problem: '',
    solution: '',
    result: '',
    thumbnailUrl: '',
    videoUrl: '',
    isVisible: false,
    categoryId: '',
};

type UploadTarget = 'thumbnail' | 'gallery';

export default function ProjectEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === 'new';

    const { data: project, isLoading, isError, error, refetch } = useProject(id);
    const { data: categories = [] } = useCategories();
    const { data: clients = [] } = useClients();
    const createMutation = useCreateProject();
    const updateMutation = useUpdateProject();
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
    const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
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
        if (project && !isNew) {
            reset({
                title: project.title,
                slug: project.slug,
                clientId: project.clientId || '',
                projectDate: project.projectDate ? project.projectDate.split('T')[0] : '',
                summary: project.summary,
                problem: project.problem || '',
                solution: project.solution || '',
                result: project.result || '',
                thumbnailUrl: project.thumbnailUrl,
                videoUrl: project.videoUrl || '',
                isVisible: project.isVisible,
                categoryId: project.categoryId || '',
            });
            setGalleryImages(project.gallery || []);
        }
    }, [project, isNew, reset]);

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
                            projectId: id,
                            data: { url: result.url }
                        });
                        setGalleryImages(prev => [...prev, newImage]);
                        toast.success('Berhasil', 'Gambar gallery berhasil ditambahkan');
                    } catch (err) {
                        toast.error('Error', 'Gagal menambahkan gambar ke gallery');
                    }
                } else {
                    // For new project, just add to local state (will save after project created)
                    toast.info('Info', 'Gallery akan tersimpan setelah project dibuat');
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
                projectId: id,
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
        if (!data.projectDate) {
            toast.error('Validasi', 'Project date wajib diisi');
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
                const createData: CreateProjectInput = {
                    title: data.title,
                    clientId: data.clientId || undefined,
                    projectDate: data.projectDate,
                    summary: data.summary,
                    problem: data.problem || undefined,
                    solution: data.solution || undefined,
                    result: data.result || undefined,
                    thumbnailUrl: data.thumbnailUrl,
                    videoUrl: data.videoUrl || undefined,
                    isVisible: data.isVisible,
                    categoryId: data.categoryId || undefined,
                };
                await createMutation.mutateAsync(createData);
                toast.success('Berhasil', 'Project berhasil dibuat');
            } else {
                const updateData: UpdateProjectInput = {
                    title: data.title,
                    clientId: data.clientId || undefined,
                    projectDate: data.projectDate,
                    summary: data.summary,
                    problem: data.problem || undefined,
                    solution: data.solution || undefined,
                    result: data.result || undefined,
                    thumbnailUrl: data.thumbnailUrl,
                    videoUrl: data.videoUrl || undefined,
                    isVisible: data.isVisible,
                    categoryId: data.categoryId || undefined,
                };
                await updateMutation.mutateAsync({ id: id!, data: updateData });
                toast.success('Berhasil', 'Project berhasil diperbarui');
            }
            navigate('/projects');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan project';
            toast.error('Error', message);
        }
    };

    // Loading state for edit mode
    if (!isNew && isLoading) {
        return <ProjectEditSkeleton />;
    }

    // Error state
    if (!isNew && isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Project
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Project tidak ditemukan.'}
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate('/projects')}>
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

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back button */}
            <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-cms-text-secondary hover:text-cms-text-primary transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Projects
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader
                        title="Project Details"
                        description="Informasi dasar tentang project"
                    />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Title"
                                placeholder="Project title"
                                error={errors.title?.message}
                                {...register('title', { onBlur: handleTitleBlur })}
                            />
                            <Input
                                label="Slug (URL)"
                                placeholder="project-title"
                                error={errors.slug?.message}
                                {...register('slug')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Client Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                    Client
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('clientId')}
                                        className="w-full px-4 py-2.5 bg-cms-bg-secondary border border-cms-border rounded-lg text-cms-text-primary appearance-none cursor-pointer focus:outline-none focus:border-cms-accent transition-colors"
                                    >
                                        <option value="">No Client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-text-muted pointer-events-none"
                                    />
                                </div>
                            </div>
                            <Input
                                label="Project Date"
                                type="date"
                                error={errors.projectDate?.message}
                                {...register('projectDate')}
                            />
                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        {...register('categoryId')}
                                        className="w-full px-4 py-2.5 bg-cms-bg-secondary border border-cms-border rounded-lg text-cms-text-primary appearance-none cursor-pointer focus:outline-none focus:border-cms-accent transition-colors"
                                    >
                                        <option value="">No Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={18}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-text-muted pointer-events-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <Textarea
                            label="Summary"
                            placeholder="Brief description of the project..."
                            error={errors.summary?.message}
                            {...register('summary')}
                        />
                    </div>
                </Card>

                {/* Case Study */}
                <Card>
                    <CardHeader
                        title="Case Study (Optional)"
                        description="Detail problem, solution, dan result dari project"
                    />

                    <div className="space-y-6">
                        <Textarea
                            label="Problem"
                            placeholder="What problem did this project solve?"
                            {...register('problem')}
                        />
                        <Textarea
                            label="Solution"
                            placeholder="How did you solve it?"
                            {...register('solution')}
                        />
                        <Textarea
                            label="Result"
                            placeholder="What were the results?"
                            {...register('result')}
                        />
                    </div>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader
                        title="Media"
                        description="Thumbnail dan galeri gambar project"
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
                                        Gallery dapat ditambahkan setelah project dibuat
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Video URL */}
                        <Input
                            label="Video URL (Optional)"
                            placeholder="https://youtube.com/watch?v=..."
                            {...register('videoUrl')}
                        />
                    </div>
                </Card>

                {/* Visibility */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-cms-text-primary">Visibility</p>
                            <p className="text-sm text-cms-text-secondary">
                                Project akan tampil di portfolio jika visible
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
                    <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSaving}>
                        <Save size={18} />
                        {isNew ? 'Create Project' : 'Save Changes'}
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
