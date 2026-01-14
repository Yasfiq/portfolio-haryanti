import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload, ExternalLink, AlertCircle, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { UpdateProfileSchema, type UpdateProfileInput } from '@repo/ts-types';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { ProfileSkeleton } from '../components/skeletons/ProfileSkeleton';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
    const { data: profile, isLoading, isError, error } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const toast = useToastHelpers();

    // Upload hooks
    const { uploadResume, isUploading } = useUpload();

    // File input refs
    const resumeInputRef = useRef<HTMLInputElement>(null);

    // Change Password state
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

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
            title: '',
            bio: '',
            email: '',
            resumeUrl: null,
            linkedinUrl: null,
            instagramUrl: null,
            pinterestUrl: null,
        },
    });

    // Watch for URL values
    const resumeUrl = watch('resumeUrl');

    // Reset form when profile data is loaded
    useEffect(() => {
        if (profile) {
            reset({
                title: profile.title ?? '',
                bio: profile.bio ?? '',
                email: profile.email ?? '',
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

    // Handle change password
    const handleChangePassword = async () => {
        // Validation
        if (passwordForm.newPassword.length < 6) {
            toast.error('Validasi', 'Password minimal 6 karakter');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Validasi', 'Password tidak cocok');
            return;
        }

        setIsChangingPassword(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.newPassword,
            });

            if (error) {
                toast.error('Error', error.message);
            } else {
                toast.success('Berhasil', 'Password berhasil diubah');
                setPasswordForm({ newPassword: '', confirmPassword: '' });
            }
        } catch {
            toast.error('Error', 'Terjadi kesalahan saat mengubah password');
        } finally {
            setIsChangingPassword(false);
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
                    <Input
                        label="Title / Role"
                        placeholder="e.g. Graphic Designer & Content Creator"
                        error={errors.title?.message}
                        {...register('title')}
                    />
                    <p className="text-xs text-cms-text-muted -mt-4">
                        Ditampilkan di Footer (di bawah nama site)
                    </p>

                    <Textarea
                        label="Bio"
                        placeholder="Tell about yourself..."
                        error={errors.bio?.message}
                        {...register('bio')}
                    />
                    <p className="text-xs text-cms-text-muted -mt-4">
                        Ditampilkan di Footer (cuplikan max 120 karakter)
                    </p>

                    <Input
                        label="Email Kontak"
                        type="email"
                        placeholder="your@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <p className="text-xs text-cms-text-muted -mt-4">
                        Ditampilkan di Footer dan digunakan untuk Contact Form
                    </p>
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

            {/* Account Security - Change Password */}
            <Card>
                <CardHeader
                    title="Account Security"
                    description="Ubah password akun CMS Anda"
                />

                <div className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Minimal 6 karakter"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-text-muted hover:text-cms-text-secondary"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Masukkan ulang password baru"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-text-muted hover:text-cms-text-secondary"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Change Password Button */}
                    <div className="pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleChangePassword}
                            isLoading={isChangingPassword}
                            disabled={!passwordForm.newPassword || !passwordForm.confirmPassword}
                        >
                            <Lock size={16} />
                            Change Password
                        </Button>
                    </div>
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
