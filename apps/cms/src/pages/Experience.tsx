import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Building2, AlertCircle, RefreshCw, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { ExperiencesSkeleton } from '../components/skeletons/ExperiencesSkeleton';
import {
    useExperiences,
    useDeleteExperience,
} from '../hooks/useExperiences';
import { useToastHelpers } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import type { Experience } from '../types/experience.types';

export default function ExperiencePage() {
    const { data: experiences = [], isLoading, isError, error, refetch } = useExperiences();
    const deleteMutation = useDeleteExperience();
    const toast = useToastHelpers();

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; experience: Experience | null }>({
        isOpen: false,
        experience: null,
    });

    const handleDelete = async () => {
        if (!deleteModal.experience) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.experience.id);
            toast.success('Berhasil', 'Experience berhasil dihapus');
            setDeleteModal({ isOpen: false, experience: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus experience';
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
        return <ExperiencesSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Experiences
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data experiences.'}
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
                    {experiences.length} experiences (sorted by date)
                </p>
                <Link to="/experience/new">
                    <Button variant="primary">
                        <Plus size={18} />
                        Tambah Experience
                    </Button>
                </Link>
            </div>

            {/* Experience List - Auto sorted by isCurrent DESC, startDate DESC */}
            <div className="space-y-4">
                {experiences.map((exp) => (
                    <Card key={exp.id} className="flex items-start gap-4">
                        {/* Logo */}
                        <div className="w-12 h-12 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center flex-shrink-0">
                            {exp.logoUrl ? (
                                <img src={exp.logoUrl} alt={exp.company} className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                <Building2 size={20} className="text-cms-text-muted" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-cms-text-primary">{exp.role}</h3>
                                    <p className="text-cms-text-secondary">{exp.company}</p>
                                    <p className="text-sm text-cms-text-muted mt-1">
                                        {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                                    </p>
                                </div>
                                {exp.isCurrent && (
                                    <Badge variant="success">Sekarang</Badge>
                                )}
                            </div>

                            {/* Description preview */}
                            {exp.description?.points && exp.description.points.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {exp.description.points.slice(0, 2).map((item, i) => (
                                        <li key={i} className="text-sm text-cms-text-muted flex items-start gap-2">
                                            <span className="text-cms-accent">•</span>
                                            <span className="truncate">{item}</span>
                                        </li>
                                    ))}
                                    {exp.description.points.length > 2 && (
                                        <li className="text-sm text-cms-text-muted">
                                            +{exp.description.points.length - 2} lainnya...
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Link
                                to={`/experience/${exp.id}`}
                                className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Pencil size={16} />
                            </Link>
                            <button
                                onClick={() => setDeleteModal({ isOpen: true, experience: exp })}
                                className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded-lg transition-colors"
                                title="Hapus"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {experiences.length === 0 && (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada experiences</p>
                    <Link to="/experience/new" className="text-cms-accent hover:text-cms-accent-hover mt-2 inline-block">
                        Tambahkan experience pertama →
                    </Link>
                </Card>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, experience: null })}
                title="Hapus Experience"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus experience di "{deleteModal.experience?.company}"?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, experience: null })}
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
