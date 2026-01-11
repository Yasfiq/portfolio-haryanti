import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Building, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { CategoriesSkeleton } from '../components/skeletons/CategoriesSkeleton';
import {
    useClients,
    useCreateClient,
    useUpdateClient,
    useDeleteClient,
    useToggleClientVisibility,
    useReorderClients
} from '../hooks/useClients';
import type { Client } from '../hooks/useClients';
import { useToastHelpers } from '../context/ToastContext';

export default function Clients() {
    const { data: clients = [], isLoading, isError, error, refetch } = useClients();
    const createMutation = useCreateClient();
    const updateMutation = useUpdateClient();
    const deleteMutation = useDeleteClient();
    const toggleVisibilityMutation = useToggleClientVisibility();
    const reorderMutation = useReorderClients();
    const toast = useToastHelpers();

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [editModal, setEditModal] = useState<{ isOpen: boolean; client: Client | null }>({
        isOpen: false,
        client: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; client: Client | null }>({
        isOpen: false,
        client: null,
    });
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logoUrl: '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const openAddModal = () => {
        setFormData({ name: '', slug: '', description: '', logoUrl: '' });
        setEditModal({ isOpen: true, client: null });
    };

    const openEditModal = (client: Client) => {
        setFormData({
            name: client.name,
            slug: client.slug,
            description: client.description || '',
            logoUrl: client.logoUrl || '',
        });
        setEditModal({ isOpen: true, client });
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: editModal.client ? formData.slug : generateSlug(name),
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.slug.trim()) return;

        try {
            if (editModal.client) {
                await updateMutation.mutateAsync({
                    id: editModal.client.id,
                    data: {
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description || undefined,
                        logoUrl: formData.logoUrl || undefined,
                    },
                });
                toast.success('Berhasil', 'Client berhasil diperbarui');
            } else {
                await createMutation.mutateAsync({
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description || undefined,
                    logoUrl: formData.logoUrl || undefined,
                });
                toast.success('Berhasil', 'Client berhasil ditambahkan');
            }
            setEditModal({ isOpen: false, client: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan client';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.client) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.client.id);
            toast.success('Berhasil', 'Client berhasil dihapus');
            setDeleteModal({ isOpen: false, client: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus client';
            toast.error('Error', message);
        }
    };

    const handleToggleVisibility = async (client: Client) => {
        try {
            await toggleVisibilityMutation.mutateAsync(client.id);
            toast.success('Berhasil', `Client ${client.isVisible ? 'disembunyikan' : 'ditampilkan'}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal mengubah visibility';
            toast.error('Error', message);
        }
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        dragItem.current = index;
        setDraggingIndex(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index.toString());
        }
    };

    const handleDragEnter = (index: number) => {
        if (dragItem.current === null) return;
        if (dragItem.current !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget?.closest('[data-client-list]')) {
            setDragOverIndex(null);
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

        const reorderedClients = [...clients];
        const draggedItem = reorderedClients[dragItem.current];
        reorderedClients.splice(dragItem.current, 1);
        reorderedClients.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync(reorderedClients.map(c => c.id));
            toast.success('Berhasil', 'Urutan client berhasil diubah');
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

    if (isLoading) {
        return <CategoriesSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Clients
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data clients.'}
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
            <CardHeader
                title="Clients / Workplaces"
                description="Kelola client/workplace untuk mengelompokkan portfolio. Drag untuk mengubah urutan."
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {clients.length} clients
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Client
                </Button>
            </div>

            {/* Clients List */}
            <div className="space-y-2" data-client-list>
                {clients.map((client, index) => (
                    <div key={client.id} className="relative">
                        {/* Drop indicator */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex > index && (
                            <div className="absolute -top-1 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}

                        <Card
                            className={`flex items-center gap-4 transition-all duration-200 select-none ${draggingIndex === index
                                    ? 'opacity-50 scale-[0.98] shadow-lg ring-2 ring-cms-accent/50'
                                    : ''
                                } ${dragOverIndex === index && draggingIndex !== index
                                    ? 'transform translate-y-1'
                                    : ''
                                } ${!client.isVisible ? 'opacity-60' : ''
                                }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            {/* Drag handle */}
                            <button
                                className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-accent transition-colors"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <GripVertical size={18} />
                            </button>

                            {/* Logo or Icon */}
                            <div className="w-12 h-12 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {client.logoUrl ? (
                                    <img src={client.logoUrl} alt={client.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building size={20} className="text-cms-accent" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-cms-text-primary">{client.name}</h3>
                                    {!client.isVisible && (
                                        <span className="text-xs bg-cms-bg-tertiary text-cms-text-muted px-2 py-0.5 rounded">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-cms-text-muted truncate">
                                    /{client.slug} • {client._count?.projects ?? 0} projects
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleToggleVisibility(client)}
                                    className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded transition-colors"
                                    title={client.isVisible ? 'Sembunyikan' : 'Tampilkan'}
                                >
                                    {client.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <button
                                    onClick={() => openEditModal(client)}
                                    className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: true, client })}
                                    className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
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

            {clients.length === 0 && (
                <Card className="text-center py-12">
                    <Building size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada client</p>
                    <button onClick={openAddModal} className="text-cms-accent hover:text-cms-accent-hover mt-2">
                        Tambahkan client pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, client: null })}
                title={editModal.client ? 'Edit Client' : 'Tambah Client'}
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Client"
                        placeholder="contoh: Hotel Santika"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    <Input
                        label="Slug"
                        placeholder="contoh: hotel-santika"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        disabled={!!editModal.client}
                    />
                    <Textarea
                        label="Deskripsi (Optional)"
                        placeholder="Deskripsi singkat tentang client..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <Input
                        label="Logo URL (Optional)"
                        placeholder="https://..."
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, client: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!formData.name.trim() || !formData.slug.trim()}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editModal.client ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, client: null })}
                title="Hapus Client"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus "{deleteModal.client?.name}"?
                        {(deleteModal.client?._count?.projects ?? 0) > 0 && (
                            <span className="block mt-2 text-cms-warning">
                                ⚠️ Client ini memiliki {deleteModal.client?._count?.projects} project terkait.
                                Project akan tetap ada tapi tidak lagi terhubung ke client ini.
                            </span>
                        )}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, client: null })}>
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
