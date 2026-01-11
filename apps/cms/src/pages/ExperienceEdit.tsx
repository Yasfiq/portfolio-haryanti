import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Plus, X, Upload, AlertCircle, RefreshCw, Building2, Loader2 } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ImageCropModal from '../components/ui/ImageCropModal';
import { ExperienceEditSkeleton } from '../components/skeletons/ExperiencesSkeleton';
import {
    useExperience,
    useCreateExperience,
    useUpdateExperience
} from '../hooks/useExperiences';
import { useToastHelpers } from '../context/ToastContext';
import { useUpload } from '../hooks/useUpload';


interface ExperienceFormData {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: { value: string }[];
    logoUrl: string;
}

export default function ExperienceEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === 'new';
    const toast = useToastHelpers();

    const { data: experience, isLoading, isError, error, refetch } = useExperience(id);
    const createMutation = useCreateExperience();
    const updateMutation = useUpdateExperience();
    const { uploadAvatar, isUploading: isUploadingLogo } = useUpload();
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Crop modal state
    const [cropModal, setCropModal] = useState<{ isOpen: boolean; imageSrc: string }>({
        isOpen: false,
        imageSrc: '',
    });

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ExperienceFormData>({
        defaultValues: {
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: [{ value: '' }],
            logoUrl: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'description',
    });

    const isCurrent = watch('isCurrent');
    const logoUrl = watch('logoUrl');

    // Open file picker and show crop modal
    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert file to data URL for cropper
        const reader = new FileReader();
        reader.onload = () => {
            setCropModal({
                isOpen: true,
                imageSrc: reader.result as string,
            });
        };
        reader.readAsDataURL(file);

        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Handle cropped image upload
    const handleCropComplete = async (croppedBlob: Blob) => {
        // Convert blob to file
        const file = new File([croppedBlob], 'logo.jpg', { type: 'image/jpeg' });

        const result = await uploadAvatar(file);
        if (result) {
            setValue('logoUrl', result.url);
            toast.success('Berhasil', 'Logo berhasil diupload');
        }
    };

    // Populate form when experience data is loaded
    useEffect(() => {
        if (experience) {
            const points = experience.description?.points || [];
            reset({
                company: experience.company,
                role: experience.role,
                startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
                endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
                isCurrent: experience.isCurrent,
                description: points.length > 0
                    ? points.map((d: string) => ({ value: d }))
                    : [{ value: '' }],
                logoUrl: experience.logoUrl || '',
            });
        }
    }, [experience, reset]);

    const onSubmit = async (data: ExperienceFormData) => {
        const payload = {
            company: data.company,
            role: data.role,
            startDate: data.startDate,
            endDate: data.isCurrent ? null : data.endDate || null,
            isCurrent: data.isCurrent,
            description: {
                points: data.description.map(d => d.value).filter(Boolean),
            },
            logoUrl: data.logoUrl || null,
        };

        try {
            if (isNew) {
                await createMutation.mutateAsync(payload);
                toast.success('Berhasil', 'Experience berhasil ditambahkan');
            } else {
                await updateMutation.mutateAsync({ id: id!, data: payload });
                toast.success('Berhasil', 'Experience berhasil diperbarui');
            }
            navigate('/experience');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan experience';
            toast.error('Error', message);
        }
    };

    // Loading state for edit mode
    if (!isNew && isLoading) {
        return <ExperienceEditSkeleton />;
    }

    // Error state for edit mode
    if (!isNew && isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Experience
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data experience.'}
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate('/experience')}>
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

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back button */}
            <button
                onClick={() => navigate('/experience')}
                className="flex items-center gap-2 text-cms-text-secondary hover:text-cms-text-primary transition-colors"
            >
                <ArrowLeft size={18} />
                Kembali ke Experience
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader
                        title="Detail Experience"
                        description="Informasi tentang pengalaman kerja"
                    />

                    <div className="space-y-6">
                        {/* Logo */}
                        <div>
                            <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                Logo Perusahaan
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={24} className="text-cms-text-muted" />
                                    )}
                                </div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoSelect}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={isUploadingLogo}
                                >
                                    {isUploadingLogo ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Nama Perusahaan"
                                placeholder="contoh: PT. Creative Studio"
                                error={errors.company?.message}
                                {...register('company', { required: 'Nama perusahaan wajib diisi' })}
                            />
                            <Input
                                label="Posisi / Role"
                                placeholder="contoh: Senior Graphic Designer"
                                error={errors.role?.message}
                                {...register('role', { required: 'Posisi wajib diisi' })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Tanggal Mulai"
                                type="date"
                                error={errors.startDate?.message}
                                {...register('startDate', { required: 'Tanggal mulai wajib diisi' })}
                            />
                            <div>
                                <Input
                                    label="Tanggal Selesai"
                                    type="date"
                                    disabled={isCurrent}
                                    {...register('endDate')}
                                />
                                <label className="flex items-center gap-2 mt-2 text-sm text-cms-text-secondary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-cms-border"
                                        {...register('isCurrent')}
                                    />
                                    Masih bekerja di sini
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader
                        title="Deskripsi Pekerjaan"
                        description="Daftar tugas dan tanggung jawab"
                    />

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-start gap-3">
                                <span className="text-cms-accent mt-2.5">•</span>
                                <div className="flex-1">
                                    <Input
                                        placeholder="Jelaskan tanggung jawab Anda..."
                                        {...register(`description.${index}.value`)}
                                    />
                                </div>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-cms-text-muted hover:text-cms-error transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => append({ value: '' })}
                        >
                            <Plus size={16} />
                            Tambah Deskripsi
                        </Button>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/experience')}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    >
                        <Save size={18} />
                        {isNew ? 'Buat Experience' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>

            {/* Image Crop Modal */}
            <ImageCropModal
                isOpen={cropModal.isOpen}
                onClose={() => setCropModal({ isOpen: false, imageSrc: '' })}
                imageSrc={cropModal.imageSrc}
                onCropComplete={handleCropComplete}
                aspectRatio={1}
                cropShape="rect"
                title="Crop Logo"
            />
        </div>
    );
}
