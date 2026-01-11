import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { EducationsSkeleton } from '../components/skeletons/EducationsSkeleton';
import {
    useEducations,
    useCreateEducation,
    useUpdateEducation,
    useDeleteEducation,
} from '../hooks/useEducations';
import { useToastHelpers } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import type { EducationResponse, CreateEducationInput, UpdateEducationInput } from '../types/profile.types';

interface EducationFormData {
    schoolName: string;
    degree: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

const defaultFormData: EducationFormData = {
    schoolName: '',
    degree: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
};

export default function Education() {
    const { data: educations = [], isLoading, isError, error, refetch } = useEducations();
    const createMutation = useCreateEducation();
    const updateMutation = useUpdateEducation();
    const deleteMutation = useDeleteEducation();
    const toast = useToastHelpers();

    // Modal states
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        education: EducationResponse | null;
    }>({
        isOpen: false,
        education: null,
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        education: EducationResponse | null;
    }>({
        isOpen: false,
        education: null,
    });

    const [formData, setFormData] = useState<EducationFormData>(defaultFormData);

    const isEditing = !!editModal.education;

    const openAddModal = () => {
        setFormData(defaultFormData);
        setEditModal({ isOpen: true, education: null });
    };

    const openEditModal = (education: EducationResponse) => {
        setFormData({
            schoolName: education.schoolName,
            degree: education.degree || '',
            startDate: education.startDate ? education.startDate.split('T')[0] : '',
            endDate: education.endDate ? education.endDate.split('T')[0] : '',
            isCurrent: education.isCurrent,
        });
        setEditModal({ isOpen: true, education });
    };

    const closeEditModal = () => {
        setEditModal({ isOpen: false, education: null });
        setFormData(defaultFormData);
    };

    const handleSave = async () => {
        if (!formData.schoolName.trim()) {
            toast.error('Validasi', 'Nama sekolah/kampus wajib diisi');
            return;
        }

        if (!formData.startDate) {
            toast.error('Validasi', 'Tanggal mulai wajib diisi');
            return;
        }

        try {
            if (isEditing && editModal.education) {
                const updateData: UpdateEducationInput = {
                    schoolName: formData.schoolName,
                    degree: formData.degree || undefined,
                    startDate: formData.startDate,
                    endDate: formData.isCurrent ? undefined : formData.endDate || undefined,
                    isCurrent: formData.isCurrent,
                };
                await updateMutation.mutateAsync({ id: editModal.education.id, data: updateData });
                toast.success('Berhasil', 'Pendidikan berhasil diperbarui');
            } else {
                const createData: CreateEducationInput = {
                    schoolName: formData.schoolName,
                    degree: formData.degree || undefined,
                    startDate: formData.startDate,
                    endDate: formData.isCurrent ? undefined : formData.endDate || undefined,
                    isCurrent: formData.isCurrent,
                };
                await createMutation.mutateAsync(createData);
                toast.success('Berhasil', 'Pendidikan berhasil ditambahkan');
            }
            closeEditModal();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan pendidikan';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.education) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.education.id);
            toast.success('Berhasil', 'Pendidikan berhasil dihapus');
            setDeleteModal({ isOpen: false, education: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus pendidikan';
            toast.error('Error', message);
        }
    };

    const formatPeriod = (startDate: string, endDate: string | null, isCurrent: boolean) => {
        const start = formatDate(startDate);
        if (isCurrent) return `${start} - Sekarang`;
        return `${start} - ${formatDate(endDate || '')}`;
    };

    // Loading state
    if (isLoading) {
        return <EducationsSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Pendidikan
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data pendidikan.'}
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {educations.length} pendidikan (sorted by date)
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Pendidikan
                </Button>
            </div>

            {/* Education List */}
            <div className="space-y-4">
                {educations.map((edu) => (
                    <Card key={edu.id} className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-lg bg-cms-accent/10 border border-cms-accent/20 flex items-center justify-center flex-shrink-0">
                            <GraduationCap size={20} className="text-cms-accent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-cms-text-primary">{edu.schoolName}</h3>
                                    {edu.degree && (
                                        <p className="text-cms-text-secondary">{edu.degree}</p>
                                    )}
                                    <p className="text-sm text-cms-text-muted mt-1 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}
                                    </p>
                                </div>
                                {edu.isCurrent && (
                                    <Badge variant="success">Saat Ini</Badge>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => openEditModal(edu)}
                                className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteModal({ isOpen: true, education: edu })}
                                className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded-lg transition-colors"
                                title="Hapus"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {educations.length === 0 && (
                <Card className="text-center py-12">
                    <GraduationCap size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada data pendidikan</p>
                    <button
                        onClick={openAddModal}
                        className="text-cms-accent hover:text-cms-accent-hover mt-2 inline-block"
                    >
                        Tambahkan pendidikan pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={closeEditModal}
                title={isEditing ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Sekolah/Kampus"
                        placeholder="contoh: Universitas Indonesia"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    />

                    <Input
                        label="Gelar/Jurusan"
                        placeholder="contoh: S1 Desain Komunikasi Visual"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tanggal Mulai"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <Input
                            label="Tanggal Selesai"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            disabled={formData.isCurrent}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: '' })}
                            className="w-4 h-4 rounded border-cms-border text-cms-accent focus:ring-cms-accent"
                        />
                        <span className="text-sm text-cms-text-secondary">Masih menempuh pendidikan ini</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={closeEditModal}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, education: null })}
                title="Hapus Pendidikan"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus pendidikan di "{deleteModal.education?.schoolName}"?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, education: null })}
                        >
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
