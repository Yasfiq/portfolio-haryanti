import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { UpdateProfileSchema, type UpdateProfileInput } from '@repo/ts-types';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { ProfileSkeleton } from '../components/skeletons/ProfileSkeleton';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';

export default function Profile() {
    const { data: profile, isLoading, isError, error } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const toast = useToastHelpers();

    // Upload hooks
    const { uploadAvatar, uploadResume, isUploading } = useUpload();

    // File input refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            fullName: '',
            title: '',
            bio: '',
            email: '',
            avatarUrl: null,
            resumeUrl: null,
            linkedinUrl: null,
            instagramUrl: null,
            pinterestUrl: null,
        },
    });

    // Watch for URL values
    const avatarUrl = watch('avatarUrl');
    const resumeUrl = watch('resumeUrl');

    // Reset form when profile data is loaded
    useEffect(() => {
        if (profile) {
            reset({
                fullName: profile.fullName ?? '',
                title: profile.title ?? '',
                bio: profile.bio ?? '',
                email: profile.email ?? '',
                avatarUrl: profile.avatarUrl,
                resumeUrl: profile.resumeUrl,
                linkedinUrl: profile.linkedinUrl,
                instagramUrl: profile.instagramUrl,
                pinterestUrl: profile.pinterestUrl,
            });
        }
    }, [profile, reset]);

    const onSubmit = async (data: UpdateProfileInput) => {
        try {
            await updateProfileMutation.mutateAsync(data);
            toast.success('Berhasil!', 'Profile berhasil disimpan');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan profile';
            toast.error('Gagal Menyimpan', message);
        }
    };

    // Handle avatar upload
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadAvatar(file);
        if (result) {
            setValue('avatarUrl', result.url, { shouldDirty: true });
            toast.success('Upload Berhasil', 'Avatar berhasil diupload');
        }

        // Reset input
        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
    };

    // Handle resume upload
    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadResume(file);
        if (result) {
            setValue('resumeUrl', result.url, { shouldDirty: true });
            toast.success('Upload Berhasil', 'Resume berhasil diupload');
        }

        // Reset input
        if (resumeInputRef.current) {
            resumeInputRef.current.value = '';
        }
    };

    // Loading state
    if (isLoading) {
        return <ProfileSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16 max-w-4xl">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Profile
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md">
                    {error?.message || 'Terjadi kesalahan saat memuat data profile.'}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            {/* Basic Info */}
            <Card>
                <CardHeader
                    title="Basic Information"
                    description="Informasi dasar yang akan ditampilkan di portfolio"
                />

                <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                            Avatar
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-cms-bg-secondary border border-cms-border flex items-center justify-center overflow-hidden">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-cms-accent">
                                        {profile?.fullName?.[0]?.toUpperCase() || 'H'}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                                </Button>
                                {avatarUrl && (
                                    <span className="text-xs text-cms-text-muted">
                                        Photo uploaded ✓
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            placeholder="Your full name"
                            error={errors.fullName?.message}
                            {...register('fullName')}
                        />
                        <Input
                            label="Title / Role"
                            placeholder="e.g. Graphic Designer"
                            error={errors.title?.message}
                            {...register('title')}
                        />
                    </div>

                    <Textarea
                        label="Bio"
                        placeholder="Tell about yourself..."
                        error={errors.bio?.message}
                        {...register('bio')}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                </div>
            </Card>

            {/* Resume */}
            <Card>
                <CardHeader
                    title="Resume / CV"
                    description="Upload resume untuk didownload pengunjung"
                />

                <div className="flex items-center gap-4">
                    <input
                        ref={resumeInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => resumeInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Upload size={16} />
                        )}
                        {isUploading ? 'Uploading...' : 'Upload Resume (PDF)'}
                    </Button>
                    {resumeUrl && (
                        <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cms-accent hover:text-cms-accent-hover flex items-center gap-1"
                        >
                            <ExternalLink size={14} />
                            View Current
                        </a>
                    )}
                </div>
            </Card>

            {/* Social Links */}
            <Card>
                <CardHeader
                    title="Social Links"
                    description="Link ke profil media sosial"
                />

                <div className="space-y-4">
                    <Input
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/username"
                        error={errors.linkedinUrl?.message}
                        {...register('linkedinUrl')}
                    />
                    <Input
                        label="Instagram"
                        placeholder="https://instagram.com/username"
                        error={errors.instagramUrl?.message}
                        {...register('instagramUrl')}
                    />
                    <Input
                        label="Pinterest (Optional)"
                        placeholder="https://pinterest.com/username"
                        error={errors.pinterestUrl?.message}
                        {...register('pinterestUrl')}
                    />
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-cms-bg-primary py-4">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={updateProfileMutation.isPending}
                    disabled={!isDirty || isUploading}
                >
                    <Save size={18} />
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
