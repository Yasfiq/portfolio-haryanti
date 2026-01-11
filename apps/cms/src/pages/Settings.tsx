import { useState, useEffect, useRef } from 'react';
import { Save, Upload, Palette, Monitor, Lock, Eye, EyeOff, MessageSquare, Megaphone, AlertCircle, RefreshCw, Loader2, Phone } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { SettingsSkeleton } from '../components/skeletons/SettingsSkeleton';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import type { UpdateSettingsInput } from '../types/settings.types';

// Preset color themes
const colorPresets = [
    { name: 'Gold', primary: '#FFD369', secondary: '#EEEEEE' },
    { name: 'Ocean', primary: '#00ADB5', secondary: '#EEEEEE' },
    { name: 'Rose', primary: '#E84545', secondary: '#F0E7E7' },
    { name: 'Forest', primary: '#4ECB71', secondary: '#E8F5E8' },
    { name: 'Lavender', primary: '#9C88FF', secondary: '#EDE7FF' },
    { name: 'Sunset', primary: '#FF6B35', secondary: '#FFF0EB' },
];

interface FormState {
    siteName: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    footerText: string;
    ctaHeading: string;
    ctaDescription: string;
    ctaButtonText: string;
    whatsappNumber: string;
    heroTemplate: 'slides' | 'modern';
}

const defaultFormState: FormState = {
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#FFD369',
    secondaryColor: '#EEEEEE',
    footerText: '',
    ctaHeading: '',
    ctaDescription: '',
    ctaButtonText: '',
    whatsappNumber: '',
    heroTemplate: 'slides',
};

export default function Settings() {
    const { data: settings, isLoading, isError, error, refetch } = useSettings();
    const updateMutation = useUpdateSettings();
    const { uploadAvatar, isUploading } = useUpload();
    const toast = useToastHelpers();

    // Form state
    const [formState, setFormState] = useState<FormState>(defaultFormState);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    // Track which upload is in progress
    const [uploadingType, setUploadingType] = useState<'logo' | 'favicon' | null>(null);

    // Change Password state
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Populate form when settings load
    useEffect(() => {
        if (settings) {
            setFormState({
                siteName: settings.siteName || '',
                logoUrl: settings.logoUrl || '',
                faviconUrl: settings.faviconUrl || '',
                primaryColor: settings.primaryColor || '#FFD369',
                secondaryColor: settings.secondaryColor || '#EEEEEE',
                footerText: settings.footerText || '',
                ctaHeading: settings.ctaHeading || '',
                ctaDescription: settings.ctaDescription || '',
                ctaButtonText: settings.ctaButtonText || '',
                whatsappNumber: settings.whatsappNumber || '',
                heroTemplate: settings.heroTemplate || 'slides',
            });
        }
    }, [settings]);

    const handleSave = async () => {
        const payload: UpdateSettingsInput = {
            siteName: formState.siteName,
            logoUrl: formState.logoUrl || null,
            faviconUrl: formState.faviconUrl || null,
            primaryColor: formState.primaryColor,
            secondaryColor: formState.secondaryColor,
            footerText: formState.footerText || null,
            ctaHeading: formState.ctaHeading || null,
            ctaDescription: formState.ctaDescription || null,
            ctaButtonText: formState.ctaButtonText || null,
            whatsappNumber: formState.whatsappNumber || null,
            heroTemplate: formState.heroTemplate,
        };

        try {
            await updateMutation.mutateAsync(payload);
            toast.success('Berhasil', 'Settings berhasil disimpan');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan settings';
            toast.error('Error', message);
        }
    };

    const applyPreset = (preset: { primary: string; secondary: string }) => {
        setFormState((prev) => ({
            ...prev,
            primaryColor: preset.primary,
            secondaryColor: preset.secondary,
        }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingType('logo');
        const result = await uploadAvatar(file);
        if (result) {
            setFormState(prev => ({ ...prev, logoUrl: result.url }));
            toast.success('Berhasil', 'Logo berhasil diupload');
        }
        setUploadingType(null);
        e.target.value = '';
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingType('favicon');
        const result = await uploadAvatar(file);
        if (result) {
            setFormState(prev => ({ ...prev, faviconUrl: result.url }));
            toast.success('Berhasil', 'Favicon berhasil diupload');
        }
        setUploadingType(null);
        e.target.value = '';
    };

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
        } catch (err) {
            toast.error('Error', 'Terjadi kesalahan saat mengubah password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Loading state
    if (isLoading) {
        return <SettingsSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Settings
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data settings.'}
                </p>
                <Button variant="secondary" onClick={() => refetch()}>
                    <RefreshCw size={16} />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Branding */}
            <Card>
                <CardHeader
                    title="Branding"
                    description="Nama dan logo yang ditampilkan di portfolio"
                />

                <div className="space-y-6">
                    <Input
                        label="Site Name"
                        placeholder="Your name or brand"
                        value={formState.siteName}
                        onChange={(e) => setFormState({ ...formState, siteName: e.target.value })}
                    />

                    {/* Logo */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                            Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-cms-bg-secondary border border-cms-border flex items-center justify-center overflow-hidden">
                                {formState.logoUrl ? (
                                    <img src={formState.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-cms-accent">
                                        {formState.siteName.charAt(0).toUpperCase() || 'H'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoUpload}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={isUploading && uploadingType === 'logo'}
                                >
                                    {isUploading && uploadingType === 'logo' ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    Upload Logo
                                </Button>
                                <p className="text-xs text-cms-text-muted mt-1">
                                    PNG or SVG, max 512x512px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Favicon */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                            Favicon
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center overflow-hidden">
                                {formState.faviconUrl ? (
                                    <img src={formState.faviconUrl} alt="Favicon" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold text-cms-accent">H</span>
                                )}
                            </div>
                            <div>
                                <input
                                    ref={faviconInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFaviconUpload}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => faviconInputRef.current?.click()}
                                    disabled={isUploading && uploadingType === 'favicon'}
                                >
                                    {isUploading && uploadingType === 'favicon' ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    Upload Favicon
                                </Button>
                                <p className="text-xs text-cms-text-muted mt-1">
                                    ICO or PNG, 32x32px recommended
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Color Theme */}
            <Card>
                <CardHeader
                    title="Color Theme"
                    description="Warna utama yang digunakan di portfolio"
                />

                <div className="space-y-6">
                    {/* Color Presets */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-3">
                            Quick Presets
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${formState.primaryColor === preset.primary
                                        ? 'border-cms-accent bg-cms-accent/10'
                                        : 'border-cms-border hover:border-cms-text-muted'
                                        }`}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: preset.primary }}
                                    />
                                    <span className="text-sm text-cms-text-secondary">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                Primary Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formState.primaryColor}
                                    onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })}
                                    className="w-12 h-10 rounded-lg border border-cms-border cursor-pointer"
                                />
                                <Input
                                    value={formState.primaryColor}
                                    onChange={(e) => setFormState({ ...formState, primaryColor: e.target.value })}
                                    className="flex-1"
                                    placeholder="#FFD369"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cms-text-secondary mb-2">
                                Secondary Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={formState.secondaryColor}
                                    onChange={(e) => setFormState({ ...formState, secondaryColor: e.target.value })}
                                    className="w-12 h-10 rounded-lg border border-cms-border cursor-pointer"
                                />
                                <Input
                                    value={formState.secondaryColor}
                                    onChange={(e) => setFormState({ ...formState, secondaryColor: e.target.value })}
                                    className="flex-1"
                                    placeholder="#EEEEEE"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-3">
                            Preview
                        </label>
                        <div className="p-6 rounded-xl bg-cms-bg-secondary border border-cms-border">
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold"
                                    style={{ backgroundColor: formState.primaryColor }}
                                >
                                    {formState.siteName.charAt(0).toUpperCase() || 'H'}
                                </div>
                                <span className="font-semibold text-cms-text-primary">{formState.siteName || 'Site Name'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-4 py-2 rounded-lg text-black font-medium text-sm"
                                    style={{ backgroundColor: formState.primaryColor }}
                                >
                                    Primary Button
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg text-cms-text-primary font-medium text-sm border"
                                    style={{ backgroundColor: formState.secondaryColor, borderColor: formState.primaryColor }}
                                >
                                    Secondary Button
                                </button>
                            </div>
                            <div className="mt-4 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Palette size={16} style={{ color: formState.primaryColor }} />
                                    <span className="text-sm" style={{ color: formState.primaryColor }}>
                                        Accent text
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor size={16} className="text-cms-text-muted" />
                                    <span className="text-sm text-cms-text-muted">Muted text</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Footer Content */}
            <Card>
                <CardHeader
                    title="Footer Content"
                    description="Teks yang ditampilkan di bagian footer website"
                />

                <div className="space-y-4">
                    <Textarea
                        label="Footer Description"
                        placeholder="Brief description about you or your brand..."
                        value={formState.footerText}
                        onChange={(e) => setFormState({ ...formState, footerText: e.target.value })}
                    />
                    <div className="flex items-start gap-3 p-3 bg-cms-bg-secondary rounded-lg">
                        <MessageSquare size={18} className="text-cms-text-muted mt-0.5" />
                        <p className="text-sm text-cms-text-muted">
                            Teks ini akan ditampilkan di footer bersama dengan informasi kontak dan tautan sosial media.
                        </p>
                    </div>
                </div>
            </Card>

            {/* CTA Section */}
            <Card>
                <CardHeader
                    title="Call-to-Action Section"
                    description="Konten untuk bagian CTA di halaman utama"
                />

                <div className="space-y-4">
                    <Input
                        label="Heading"
                        placeholder="e.g. Let's Create Together"
                        value={formState.ctaHeading}
                        onChange={(e) => setFormState({ ...formState, ctaHeading: e.target.value })}
                    />
                    <Textarea
                        label="Description"
                        placeholder="Invite visitors to contact you..."
                        value={formState.ctaDescription}
                        onChange={(e) => setFormState({ ...formState, ctaDescription: e.target.value })}
                    />
                    <Input
                        label="Button Text"
                        placeholder="e.g. Get in Touch"
                        value={formState.ctaButtonText}
                        onChange={(e) => setFormState({ ...formState, ctaButtonText: e.target.value })}
                    />

                    {/* CTA Preview */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-secondary mb-3">
                            Preview
                        </label>
                        <div className="p-6 rounded-xl bg-gradient-to-br from-cms-bg-tertiary to-cms-bg-secondary border border-cms-border text-center">
                            <Megaphone size={24} className="mx-auto mb-3 text-cms-accent" />
                            <h3 className="text-lg font-semibold text-cms-text-primary mb-2">
                                {formState.ctaHeading || "Let's Create Together"}
                            </h3>
                            <p className="text-sm text-cms-text-muted mb-4 max-w-md mx-auto">
                                {formState.ctaDescription || 'Your CTA description will appear here.'}
                            </p>
                            <button
                                className="px-6 py-2 rounded-lg text-black font-medium"
                                style={{ backgroundColor: formState.primaryColor }}
                            >
                                {formState.ctaButtonText || 'Get in Touch'}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* WhatsApp Floating Button */}
            <Card>
                <CardHeader
                    title="WhatsApp Button"
                    description="Konfigurasi floating WhatsApp button di website"
                />

                <div className="space-y-4">
                    <Input
                        label="WhatsApp Number"
                        placeholder="e.g. 6281234567890 (tanpa + atau spasi)"
                        value={formState.whatsappNumber}
                        onChange={(e) => setFormState({ ...formState, whatsappNumber: e.target.value })}
                    />
                    <div className="flex items-start gap-3 p-3 bg-cms-bg-secondary rounded-lg">
                        <Phone size={18} className="text-cms-text-muted mt-0.5" />
                        <p className="text-sm text-cms-text-muted">
                            Masukkan nomor telepon dengan kode negara tanpa tanda + atau spasi. Contoh: 6281234567890 untuk Indonesia.
                            Jika dikosongkan, tombol WhatsApp tidak akan muncul.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Hero Template */}
            <Card>
                <CardHeader
                    title="Hero Template"
                    description="Pilih tampilan hero section di halaman utama"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Slides Template Option */}
                    <button
                        type="button"
                        onClick={() => setFormState({ ...formState, heroTemplate: 'slides' })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formState.heroTemplate === 'slides'
                                ? 'border-cms-accent bg-cms-accent/10'
                                : 'border-cms-border hover:border-cms-accent/50'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formState.heroTemplate === 'slides'
                                    ? 'border-cms-accent bg-cms-accent'
                                    : 'border-cms-border'
                                }`}>
                                {formState.heroTemplate === 'slides' && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="font-medium text-cms-text-primary">Horizontal Slides</span>
                        </div>
                        <p className="text-sm text-cms-text-muted">
                            Hero dengan horizontal scroll panels - cocok untuk menampilkan banyak konten
                        </p>
                    </button>

                    {/* Modern Template Option */}
                    <button
                        type="button"
                        onClick={() => setFormState({ ...formState, heroTemplate: 'modern' })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formState.heroTemplate === 'modern'
                                ? 'border-cms-accent bg-cms-accent/10'
                                : 'border-cms-border hover:border-cms-accent/50'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formState.heroTemplate === 'modern'
                                    ? 'border-cms-accent bg-cms-accent'
                                    : 'border-cms-border'
                                }`}>
                                {formState.heroTemplate === 'modern' && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="font-medium text-cms-text-primary">Modern (Hello!)</span>
                        </div>
                        <p className="text-sm text-cms-text-muted">
                            Hero bersih dengan greeting bubble dan foto profil - lebih personal dan minimalis
                        </p>
                    </button>
                </div>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader
                    title="Change Password"
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
                    variant="primary"
                    size="lg"
                    isLoading={updateMutation.isPending}
                    onClick={handleSave}
                >
                    <Save size={18} />
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
