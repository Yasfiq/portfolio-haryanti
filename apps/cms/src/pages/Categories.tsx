import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, FolderOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { CategoriesSkeleton } from '../components/skeletons/CategoriesSkeleton';
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useReorderCategories
} from '../hooks/useCategories';
import { useToastHelpers } from '../context/ToastContext';
import type { CategoryWithCount } from '../types/category.types';

export default function Categories() {
    const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();
    const reorderMutation = useReorderCategories();
    const toast = useToastHelpers();

    // Drag state for smooth UX
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [editModal, setEditModal] = useState<{ isOpen: boolean; category: CategoryWithCount | null }>({
        isOpen: false,
        category: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: CategoryWithCount | null }>({
        isOpen: false,
        category: null,
    });
    const [formData, setFormData] = useState({ name: '', slug: '' });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const openAddModal = () => {
        setFormData({ name: '', slug: '' });
        setEditModal({ isOpen: true, category: null });
    };

    const openEditModal = (category: CategoryWithCount) => {
        setFormData({ name: category.name, slug: category.slug });
        setEditModal({ isOpen: true, category });
    };

    const handleNameChange = (name: string) => {
        setFormData({
            name,
            slug: editModal.category ? formData.slug : generateSlug(name),
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;

        try {
            if (editModal.category) {
                await updateMutation.mutateAsync({
                    id: editModal.category.id,
                    data: { name: formData.name },
                });
                toast.success('Berhasil', 'Kategori berhasil diperbarui');
            } else {
                await createMutation.mutateAsync({ name: formData.name });
                toast.success('Berhasil', 'Kategori berhasil ditambahkan');
            }
            setEditModal({ isOpen: false, category: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan kategori';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.category) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.category.id);
            toast.success('Berhasil', 'Kategori berhasil dihapus');
            setDeleteModal({ isOpen: false, category: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus kategori';
            toast.error('Error', message);
        }
    };

    // Enhanced drag handlers for smooth UX
    const handleDragStart = (e: React.DragEvent, index: number) => {
        dragItem.current = index;
        setDraggingIndex(index);

        // Set drag image with slight delay for better visual
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
        // Only clear if leaving the list area entirely
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget?.closest('[data-category-list]')) {
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

        // Create reordered array
        const reorderedCategories = [...categories];
        const draggedItem = reorderedCategories[dragItem.current];
        reorderedCategories.splice(dragItem.current, 1);
        reorderedCategories.splice(dropIndex, 0, draggedItem);

        resetDragState();

        // Call API to save new order
        try {
            await reorderMutation.mutateAsync({
                items: reorderedCategories.map(cat => ({ id: cat.id })),
            });
            toast.success('Berhasil', 'Urutan kategori berhasil diubah');
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
        return <CategoriesSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Kategori
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data kategori.'}
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
                title="Project Categories"
                description="Kelola kategori untuk memudahkan filter project. Drag untuk mengubah urutan."
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {categories.length} kategori
                </p>
                <Button variant="primary" onClick={openAddModal}>
                    <Plus size={18} />
                    Tambah Kategori
                </Button>
            </div>

            {/* Categories List */}
            <div className="space-y-2" data-category-list>
                {categories.map((category, index) => (
                    <div key={category.id} className="relative">
                        {/* Drop indicator line - shows above item */}
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

                            {/* Icon */}
                            <div className="w-10 h-10 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center flex-shrink-0">
                                <FolderOpen size={18} className="text-cms-accent" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-cms-text-primary">{category.name}</h3>
                                <p className="text-sm text-cms-text-muted">
                                    /{category.slug} • {category.projectCount} projects
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ isOpen: true, category })}
                                    className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </Card>

                        {/* Drop indicator line - shows below item */}
                        {dragOverIndex === index && draggingIndex !== null && draggingIndex < index && (
                            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cms-accent rounded-full z-10 animate-pulse" />
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <Card className="text-center py-12">
                    <FolderOpen size={48} className="mx-auto text-cms-text-muted mb-4" />
                    <p className="text-cms-text-secondary">Belum ada kategori</p>
                    <button onClick={openAddModal} className="text-cms-accent hover:text-cms-accent-hover mt-2">
                        Tambahkan kategori pertama →
                    </button>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, category: null })}
                title={editModal.category ? 'Edit Kategori' : 'Tambah Kategori'}
                size="sm"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Kategori"
                        placeholder="contoh: Branding"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    <Input
                        label="Slug"
                        placeholder="contoh: branding"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        disabled
                    />
                    <p className="text-xs text-cms-text-muted -mt-2">
                        Slug otomatis dibuat dari nama
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setEditModal({ isOpen: false, category: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!formData.name.trim()}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editModal.category ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, category: null })}
                title="Hapus Kategori"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus "{deleteModal.category?.name}"?
                        {(deleteModal.category?.projectCount ?? 0) > 0 && (
                            <span className="block mt-2 text-cms-warning">
                                ⚠️ Kategori ini memiliki {deleteModal.category?.projectCount} project terkait dan tidak dapat dihapus.
                            </span>
                        )}
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, category: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isPending}
                            disabled={(deleteModal.category?.projectCount ?? 0) > 0}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
