import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, AlertCircle, RefreshCw, Sparkles, Upload, X, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { SkillsSkeleton } from '../components/skeletons/SkillsSkeleton';
import {
    useSkills,
    useCreateSkill,
    useUpdateSkill,
    useDeleteSkill,
    useReorderSkills
} from '../hooks/useSkills';
import { useUpload } from '../hooks/useUpload';
import { useToastHelpers } from '../context/ToastContext';
import type { Skill, SkillCategory } from '../types/skill.types';

type ColorType = 'none' | 'solid' | 'gradient';

interface FormData {
    name: string;
    shortName: string;
    iconUrl: string;
    gradientFrom: string;
    gradientTo: string;
    gradientVia: string;
}

export default function Skills() {
    const [activeTab, setActiveTab] = useState<SkillCategory>('HARD_SKILL');
    const { data: skills = [], isLoading, isError, error, refetch } = useSkills();
    const createMutation = useCreateSkill();
    const updateMutation = useUpdateSkill();
    const deleteMutation = useDeleteSkill();
    const reorderMutation = useReorderSkills(activeTab);
    const { uploadAvatar, isUploading: isUploadingIcon } = useUpload();
    const toast = useToastHelpers();

    // Filter skills by active tab
    const filteredSkills = skills.filter((s) => s.category === activeTab);
    const hardSkillsCount = skills.filter((s) => s.category === 'HARD_SKILL').length;
    const softSkillsCount = skills.filter((s) => s.category === 'SOFT_SKILL').length;

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [editModal, setEditModal] = useState<{ isOpen: boolean; skill: Skill | null }>({
        isOpen: false,
        skill: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; skill: Skill | null }>({
        isOpen: false,
        skill: null,
    });
    const [formData, setFormData] = useState<FormData>({
        name: '',
        shortName: '',
        iconUrl: '',
        gradientFrom: '#31A8FF',
        gradientTo: '#001E36',
        gradientVia: '',
    });
    const [colorType, setColorType] = useState<ColorType>('none');
    const [useThreeColors, setUseThreeColors] = useState(false);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const openAddModal = () => {
        setFormData({
            name: '',
            shortName: '',
            iconUrl: '',
            gradientFrom: '#31A8FF',
            gradientTo: '#001E36',
            gradientVia: '',
        });
        setColorType('none');
        setUseThreeColors(false);
        setEditModal({ isOpen: true, skill: null });
    };

    const openEditModal = (skill: Skill) => {
        setFormData({
            name: skill.name,
            shortName: skill.shortName || '',
            iconUrl: skill.iconUrl || '',
            gradientFrom: skill.gradientFrom || '#31A8FF',
            gradientTo: skill.gradientTo || '#001E36',
            gradientVia: skill.gradientVia || '',
        });
        if (skill.gradientFrom && skill.gradientTo) {
            setColorType('gradient');
            setUseThreeColors(!!skill.gradientVia);
        } else if (skill.gradientFrom) {
            setColorType('solid');
            setUseThreeColors(false);
        } else {
            setColorType('none');
            setUseThreeColors(false);
        }
        setEditModal({ isOpen: true, skill });
    };

    // Handle icon upload
    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type for icons (allow SVG)
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format Tidak Valid', 'Hanya PNG, JPG, WebP, atau SVG yang diperbolehkan');
            return;
        }

        // Validate size (max 2MB for icons)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File Terlalu Besar', 'Ukuran maksimal icon adalah 2MB');
            return;
        }

        const result = await uploadAvatar(file);
        if (result) {
            setFormData(prev => ({ ...prev, iconUrl: result.url }));
            toast.success('Berhasil', 'Icon berhasil diupload');
        }

        // Reset input
        if (iconInputRef.current) {
            iconInputRef.current.value = '';
        }
    };

    const handleRemoveIcon = () => {
        setFormData(prev => ({ ...prev, iconUrl: '' }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;

        let gradientFrom: string | null = null;
        let gradientTo: string | null = null;
        let gradientVia: string | null = null;

        if (colorType === 'solid') {
            gradientFrom = formData.gradientFrom;
        } else if (colorType === 'gradient') {
            gradientFrom = formData.gradientFrom;
            gradientTo = formData.gradientTo;
            if (useThreeColors && formData.gradientVia) {
                gradientVia = formData.gradientVia;
            }
        }

        try {
            if (editModal.skill) {
                await updateMutation.mutateAsync({
                    id: editModal.skill.id,
                    data: {
                        name: formData.name,
                        shortName: formData.shortName || null,
                        iconUrl: formData.iconUrl || null,
                        gradientFrom,
                        gradientTo,
                        gradientVia,
                    },
                });
                toast.success('Berhasil', 'Skill berhasil diperbarui');
            } else {
                await createMutation.mutateAsync({
                    name: formData.name,
                    shortName: formData.shortName || null,
                    category: activeTab,
                    iconUrl: formData.iconUrl || null,
                    gradientFrom,
                    gradientTo,
                    gradientVia,
                });
                toast.success('Berhasil', 'Skill berhasil ditambahkan');
            }
            setEditModal({ isOpen: false, skill: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan skill';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.skill) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.skill.id);
            toast.success('Berhasil', 'Skill berhasil dihapus');
            setDeleteModal({ isOpen: false, skill: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus skill';
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

        const reorderedSkills = [...filteredSkills];
        const draggedItem = reorderedSkills[dragItem.current];
        reorderedSkills.splice(dragItem.current, 1);
        reorderedSkills.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync({
                items: reorderedSkills.map(s => ({ id: s.id })),
            });
            toast.success('Berhasil', 'Urutan skill berhasil diubah');
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

    const getSkillBackground = (skill: Skill) => {
        if (skill.gradientFrom && skill.gradientTo) {
            if (skill.gradientVia) {
                return `linear-gradient(135deg, ${skill.gradientFrom}, ${skill.gradientVia}, ${skill.gradientTo})`;
            }
            return `linear-gradient(135deg, ${skill.gradientFrom}, ${skill.gradientTo})`;
        }
        if (skill.gradientFrom) {
            return skill.gradientFrom;
        }
        return 'var(--cms-bg-tertiary)';
    };

    const getPreviewBackground = () => {
        if (colorType === 'solid') return formData.gradientFrom;
        if (colorType === 'gradient') {
            if (useThreeColors && formData.gradientVia) {
                return `linear-gradient(135deg, ${formData.gradientFrom}, ${formData.gradientVia}, ${formData.gradientTo})`;
            }
            return `linear-gradient(135deg, ${formData.gradientFrom}, ${formData.gradientTo})`;
        }
        return 'var(--cms-bg-tertiary)';
    };

    // Loading state
    if (isLoading) {
        return <SkillsSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Skills
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data skills.'}
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
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-cms-border">
                <button
                    onClick={() => setActiveTab('HARD_SKILL')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'HARD_SKILL'
                        ? 'text-cms-accent border-b-2 border-cms-accent'
                        : 'text-cms-text-secondary hover:text-cms-text-primary'
                        }`}
                >
                    Hard Skills ({hardSkillsCount})
                </button>
                <button
                    onClick={() => setActiveTab('SOFT_SKILL')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'SOFT_SKILL'
                        ? 'text-cms-accent border-b-2 border-cms-accent'
                        : 'text-cms-text-secondary hover:text-cms-text-primary'
                        }`}
                >
                    Soft Skills ({softSkillsCount})
                </button>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {filteredSkills.length} {activeTab === 'HARD_SKILL' ? 'hard' : 'soft'} skills
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Skill
                </Button>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((skill, index) => (
                    <div key={skill.id} className="relative">
                        {/* Drop indicator */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex > index && (
                            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}

                        <Card
                            className={`flex items-start gap-3 transition-all duration-200 ${draggingIndex === index
                                ? 'opacity-50 scale-[0.98] ring-2 ring-cms-accent/50'
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
                            <button className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-accent mt-0.5">
                                <GripVertical size={16} />
                            </button>

                            {/* Icon/Color preview */}
                            <div
                                className="w-10 h-10 rounded-lg border border-cms-border flex items-center justify-center flex-shrink-0 overflow-hidden"
                                style={{ background: getSkillBackground(skill) }}
                            >
                                {skill.iconUrl ? (
                                    <img src={skill.iconUrl} alt={skill.name} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-lg text-white/80">
                                        {skill.shortName?.charAt(0) || skill.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-cms-text-primary truncate">{skill.name}</h3>
                                {skill.shortName && (
                                    <p className="text-xs text-cms-text-muted truncate">
                                        Display: {skill.shortName}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => openEditModal(skill)}
                                    className="p-1.5 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: true, skill })}
                                    className="p-1.5 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </Card>

                        {/* Drop indicator below */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex < index && (
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            {filteredSkills.length === 0 && (
                <Card className="text-center py-12">
                    <Sparkles size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">
                        Belum ada {activeTab === 'HARD_SKILL' ? 'hard' : 'soft'} skills
                    </p>
                    <button onClick={openAddModal} className="text-cms-accent hover:text-cms-accent-hover mt-2">
                        Tambahkan skill pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, skill: null })}
                title={editModal.skill ? 'Edit Skill' : 'Tambah Skill'}
                size="md"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nama Skill"
                            placeholder="contoh: Adobe Photoshop"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Nama Pendek (Opsional)"
                            placeholder="contoh: Photoshop"
                            value={formData.shortName}
                            onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                        />
                    </div>

                    {/* Icon Upload Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-cms-text-secondary">
                            Icon Skill
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Preview */}
                            <div
                                className="w-16 h-16 rounded-lg border border-cms-border flex items-center justify-center overflow-hidden flex-shrink-0"
                                style={{ background: activeTab === 'HARD_SKILL' ? getPreviewBackground() : 'var(--cms-bg-tertiary)' }}
                            >
                                {formData.iconUrl ? (
                                    <img src={formData.iconUrl} alt="Icon preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="text-2xl text-white/60">
                                        {formData.shortName?.charAt(0) || formData.name?.charAt(0) || '?'}
                                    </span>
                                )}
                            </div>

                            {/* Upload controls */}
                            <div className="flex-1 space-y-2">
                                <input
                                    ref={iconInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    onChange={handleIconUpload}
                                    className="hidden"
                                    id="icon-upload"
                                />
                                <label
                                    htmlFor="icon-upload"
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
                                        ${isUploadingIcon
                                            ? 'bg-cms-bg-tertiary text-cms-text-muted cursor-not-allowed'
                                            : 'bg-cms-bg-secondary text-cms-text-secondary hover:bg-cms-bg-tertiary hover:text-cms-text-primary'
                                        }`}
                                >
                                    {isUploadingIcon ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Upload size={16} />
                                    )}
                                    {isUploadingIcon ? 'Mengupload...' : 'Upload Icon'}
                                </label>
                                {formData.iconUrl && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveIcon}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-cms-error hover:bg-cms-error/10 rounded-lg transition-colors ml-2"
                                    >
                                        <X size={14} />
                                        Hapus
                                    </button>
                                )}
                                <p className="text-xs text-cms-text-muted">
                                    PNG, JPG, WebP, atau SVG. Maks 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Color Options - only for hard skills */}
                    {activeTab === 'HARD_SKILL' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-cms-text-secondary">
                                Warna Card
                            </label>
                            <div className="flex gap-2">
                                {(['none', 'solid', 'gradient'] as ColorType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setColorType(type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${colorType === type
                                            ? 'bg-cms-accent text-black'
                                            : 'bg-cms-bg-secondary text-cms-text-secondary hover:bg-cms-bg-tertiary'
                                            }`}
                                    >
                                        {type === 'none' ? 'Tidak Ada' : type === 'solid' ? 'Solid' : 'Gradient'}
                                    </button>
                                ))}
                            </div>

                            {colorType === 'solid' && (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.gradientFrom}
                                        onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                                        className="w-12 h-10 rounded-lg border border-cms-border cursor-pointer"
                                    />
                                    <Input
                                        value={formData.gradientFrom}
                                        onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                                        placeholder="#31A8FF"
                                        className="flex-1"
                                    />
                                </div>
                            )}

                            {colorType === 'gradient' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm text-cms-text-muted">3 Warna?</label>
                                        <button
                                            onClick={() => setUseThreeColors(!useThreeColors)}
                                            className={`w-10 h-5 rounded-full transition-colors ${useThreeColors ? 'bg-cms-accent' : 'bg-cms-bg-tertiary'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${useThreeColors ? 'translate-x-5' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>

                                    <div className={`grid ${useThreeColors ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                                        <div className="space-y-1">
                                            <label className="text-xs text-cms-text-muted">From</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={formData.gradientFrom}
                                                    onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                                                    className="w-8 h-8 rounded border border-cms-border cursor-pointer"
                                                />
                                                <Input
                                                    value={formData.gradientFrom}
                                                    onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                                                    placeholder="#31A8FF"
                                                />
                                            </div>
                                        </div>
                                        {useThreeColors && (
                                            <div className="space-y-1">
                                                <label className="text-xs text-cms-text-muted">Via</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={formData.gradientVia || '#A259FF'}
                                                        onChange={(e) => setFormData({ ...formData, gradientVia: e.target.value })}
                                                        className="w-8 h-8 rounded border border-cms-border cursor-pointer"
                                                    />
                                                    <Input
                                                        value={formData.gradientVia}
                                                        onChange={(e) => setFormData({ ...formData, gradientVia: e.target.value })}
                                                        placeholder="#A259FF"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <label className="text-xs text-cms-text-muted">To</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={formData.gradientTo}
                                                    onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                                                    className="w-8 h-8 rounded border border-cms-border cursor-pointer"
                                                />
                                                <Input
                                                    value={formData.gradientTo}
                                                    onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                                                    placeholder="#001E36"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview */}
                            {colorType !== 'none' && (
                                <div
                                    className="h-16 rounded-lg border border-cms-border flex items-center justify-center"
                                    style={{ background: getPreviewBackground() }}
                                >
                                    <span className="text-sm text-white font-medium drop-shadow">
                                        {formData.shortName || formData.name || 'Preview'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, skill: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!formData.name.trim()}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editModal.skill ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, skill: null })}
                title="Hapus Skill"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus skill "{deleteModal.skill?.name}"?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, skill: null })}>
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
        </div>
    );
}
