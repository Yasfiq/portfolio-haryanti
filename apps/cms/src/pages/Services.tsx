import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, AlertCircle, RefreshCw, Briefcase } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { ServicesSkeleton } from '../components/skeletons/ServicesSkeleton';
import {
    useServices,
    useCreateService,
    useUpdateService,
    useDeleteService,
    useReorderServices
} from '../hooks/useServices';
import { useToastHelpers } from '../context/ToastContext';
import type { Service } from '../types/service.types';

export default function Services() {
    const { data: services = [], isLoading, isError, error, refetch } = useServices();
    const createMutation = useCreateService();
    const updateMutation = useUpdateService();
    const deleteMutation = useDeleteService();
    const reorderMutation = useReorderServices();
    const toast = useToastHelpers();

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [editModal, setEditModal] = useState<{ isOpen: boolean; service: Service | null }>({
        isOpen: false,
        service: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; service: Service | null }>({
        isOpen: false,
        service: null,
    });
    const [formData, setFormData] = useState({ title: '', description: '' });

    const openAddModal = () => {
        setFormData({ title: '', description: '' });
        setEditModal({ isOpen: true, service: null });
    };

    const openEditModal = (service: Service) => {
        setFormData({ title: service.title, description: service.description });
        setEditModal({ isOpen: true, service });
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.description.trim()) return;

        try {
            if (editModal.service) {
                await updateMutation.mutateAsync({
                    id: editModal.service.id,
                    data: {
                        title: formData.title,
                        description: formData.description,
                    },
                });
                toast.success('Berhasil', 'Service berhasil diperbarui');
            } else {
                await createMutation.mutateAsync({
                    title: formData.title,
                    description: formData.description,
                });
                toast.success('Berhasil', 'Service berhasil ditambahkan');
            }
            setEditModal({ isOpen: false, service: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan service';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.service) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.service.id);
            toast.success('Berhasil', 'Service berhasil dihapus');
            setDeleteModal({ isOpen: false, service: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus service';
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

        const reorderedServices = [...services];
        const draggedItem = reorderedServices[dragItem.current];
        reorderedServices.splice(dragItem.current, 1);
        reorderedServices.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync({
                items: reorderedServices.map(s => ({ id: s.id })),
            });
            toast.success('Berhasil', 'Urutan service berhasil diubah');
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

    // Loading state
    if (isLoading) {
        return <ServicesSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Services
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data services.'}
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
                    {services.length} services
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Service
                </Button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <div key={service.id} className="relative">
                        {/* Drop indicator */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex > index && (
                            <div className="absolute -top-2 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}

                        <Card
                            className={`flex flex-col h-full transition-all duration-200 ${draggingIndex === index
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
                            <div className="flex items-start gap-3 mb-4">
                                <button className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-accent mt-1">
                                    <GripVertical size={16} />
                                </button>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-cms-accent/10 flex items-center justify-center">
                                    <Briefcase size={24} className="text-cms-accent" />
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="font-semibold text-lg text-cms-text-primary mb-2">
                                {service.title}
                            </h3>
                            <p className="text-sm text-cms-text-secondary flex-1 line-clamp-3">
                                {service.description}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-cms-border">
                                <button
                                    onClick={() => openEditModal(service)}
                                    className="flex items-center gap-1.5 text-sm text-cms-text-secondary hover:text-cms-accent transition-colors"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </button>
                                <span className="text-cms-border">|</span>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: true, service })}
                                    className="flex items-center gap-1.5 text-sm text-cms-text-secondary hover:text-cms-error transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Hapus
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

            {services.length === 0 && (
                <Card className="text-center py-12">
                    <Briefcase size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada services</p>
                    <button onClick={openAddModal} className="text-cms-accent hover:text-cms-accent-hover mt-2">
                        Tambahkan service pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, service: null })}
                title={editModal.service ? 'Edit Service' : 'Tambah Service'}
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Judul Service"
                        placeholder="contoh: Brand Design"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Textarea
                        label="Deskripsi"
                        placeholder="Jelaskan apa saja yang termasuk dalam service ini..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, service: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!formData.title.trim() || !formData.description.trim()}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editModal.service ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, service: null })}
                title="Hapus Service"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus service "{deleteModal.service?.title}"?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, service: null })}>
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
