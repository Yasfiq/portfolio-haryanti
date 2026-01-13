import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Building, Eye, EyeOff, AlertCircle, RefreshCw, ChevronDown, ChevronRight, Tag, Upload, X } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ImageCropModal from '../components/ui/ImageCropModal';
import { CategoriesSkeleton } from '../components/skeletons/CategoriesSkeleton';
import {
    useClients,
    useCreateClient,
    useUpdateClient,
    useDeleteClient,
    useToggleClientVisibility,
    useReorderClients,
    useCategoriesByClient,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useAddCategoryImage,
    useRemoveCategoryImages,
} from '../hooks/useClients';
import type { Client, ClientCategory } from '../hooks/useClients';
import { useToastHelpers } from '../context/ToastContext';
import { useUpload } from '../hooks/useUpload';

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

    // Expanded clients for showing categories
    const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

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
        logoUrl: '',
        thumbnailUrl: '',
    });

    // Category state
    const [categoryModal, setCategoryModal] = useState<{ isOpen: boolean; clientId: string | null; category: ClientCategory | null }>({
        isOpen: false,
        clientId: null,
        category: null,
    });
    const [deleteCategoryModal, setDeleteCategoryModal] = useState<{ isOpen: boolean; category: ClientCategory | null }>({
        isOpen: false,
        category: null,
    });
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        slug: '',
    });

    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const toggleClientExpanded = (clientId: string) => {
        setExpandedClients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(clientId)) {
                newSet.delete(clientId);
            } else {
                newSet.add(clientId);
            }
            return newSet;
        });
    };

    const openAddModal = () => {
        setFormData({ name: '', slug: '', logoUrl: '', thumbnailUrl: '' });
        setEditModal({ isOpen: true, client: null });
    };

    const openEditModal = (client: Client) => {
        setFormData({
            name: client.name,
            slug: client.slug,
            logoUrl: client.logoUrl || '',
            thumbnailUrl: client.thumbnailUrl || '',
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
                        logoUrl: formData.logoUrl || undefined,
                        thumbnailUrl: formData.thumbnailUrl || undefined,
                    },
                });
                toast.success('Berhasil', 'Client berhasil diperbarui');
            } else {
                await createMutation.mutateAsync({
                    name: formData.name,
                    slug: formData.slug,
                    logoUrl: formData.logoUrl || undefined,
                    thumbnailUrl: formData.thumbnailUrl || undefined,
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

    // Category handlers
    const openAddCategoryModal = (clientId: string) => {
        setCategoryFormData({ name: '', slug: '' });
        setCategoryModal({ isOpen: true, clientId, category: null });
    };

    const openEditCategoryModal = (category: ClientCategory) => {
        setCategoryFormData({
            name: category.name,
            slug: category.slug,
        });
        setCategoryModal({ isOpen: true, clientId: category.clientId, category });
    };

    const handleCategoryNameChange = (name: string) => {
        setCategoryFormData({
            ...categoryFormData,
            name,
            slug: categoryModal.category ? categoryFormData.slug : generateSlug(name),
        });
    };

    const handleCategorySave = async () => {
        if (!categoryFormData.name.trim() || !categoryFormData.slug.trim() || !categoryModal.clientId) return;

        try {
            if (categoryModal.category) {
                await updateCategoryMutation.mutateAsync({
                    id: categoryModal.category.id,
                    data: {
                        name: categoryFormData.name,
                        slug: categoryFormData.slug,
                    },
                });
                toast.success('Berhasil', 'Category berhasil diperbarui');
            } else {
                await createCategoryMutation.mutateAsync({
                    clientId: categoryModal.clientId,
                    data: {
                        name: categoryFormData.name,
                        slug: categoryFormData.slug,
                    },
                });
                toast.success('Berhasil', 'Category berhasil ditambahkan');
            }
            setCategoryModal({ isOpen: false, clientId: null, category: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menyimpan category';
            toast.error('Error', message);
        }
    };

    const handleCategoryDelete = async () => {
        if (!deleteCategoryModal.category) return;

        try {
            await deleteCategoryMutation.mutateAsync(deleteCategoryModal.category.id);
            toast.success('Berhasil', 'Category berhasil dihapus');
            setDeleteCategoryModal({ isOpen: false, category: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus category';
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
                title="Clients / Projects"
                description="Kelola client dan category untuk mengelompokkan hasil kerja portfolio. Klik client untuk menambah category dan upload gallery."
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
                            className={`transition-all duration-200 select-none ${draggingIndex === index
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
                            {/* Main client row */}
                            <div className="flex items-center gap-4">
                                {/* Drag handle */}
                                <button
                                    className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-accent transition-colors"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <GripVertical size={18} />
                                </button>

                                {/* Expand toggle */}
                                <button
                                    onClick={() => toggleClientExpanded(client.id)}
                                    className="p-1 text-cms-text-secondary hover:text-cms-accent transition-colors"
                                >
                                    {expandedClients.has(client.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </button>

                                {/* Thumbnail or Logo */}
                                <div className="w-16 h-16 rounded-lg bg-cms-bg-secondary border border-cms-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {client.thumbnailUrl ? (
                                        <img src={client.thumbnailUrl} alt={client.name} className="w-full h-full object-cover" />
                                    ) : client.logoUrl ? (
                                        <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Building size={24} className="text-cms-accent" />
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
                                        /{client.slug} • {client._count?.categories ?? 0} categories
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
                            </div>

                            {/* Expanded Categories Section with Gallery */}
                            {expandedClients.has(client.id) && (
                                <ClientCategoriesWithGallery
                                    clientId={client.id}
                                    onAddCategory={() => openAddCategoryModal(client.id)}
                                    onEditCategory={openEditCategoryModal}
                                    onDeleteCategory={(cat) => setDeleteCategoryModal({ isOpen: true, category: cat })}
                                />
                            )}
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

            {/* Add/Edit Client Modal */}
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
                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-primary mb-2">
                            Logo (Optional)
                        </label>
                        <ClientImageUpload
                            currentUrl={formData.logoUrl}
                            onUrlChange={(url) => setFormData({ ...formData, logoUrl: url })}
                            aspectRatio={1}
                            placeholder="Upload Logo"
                            previewSize="small"
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-cms-text-primary mb-2">
                            Thumbnail (Cover untuk showcase)
                        </label>
                        <ClientImageUpload
                            currentUrl={formData.thumbnailUrl}
                            onUrlChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                            aspectRatio={1}
                            placeholder="Upload Thumbnail"
                            previewSize="large"
                        />
                    </div>
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

            {/* Delete Client Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, client: null })}
                title="Hapus Client"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus "{deleteModal.client?.name}"?
                        {(deleteModal.client?._count?.categories ?? 0) > 0 && (
                            <span className="block mt-2 text-cms-warning">
                                ⚠️ Client ini memiliki {deleteModal.client?._count?.categories} category dan semua gambar gallery akan ikut terhapus.
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

            {/* Add/Edit Category Modal */}
            <Modal
                isOpen={categoryModal.isOpen}
                onClose={() => setCategoryModal({ isOpen: false, clientId: null, category: null })}
                title={categoryModal.category ? 'Edit Category' : 'Tambah Category'}
                size="sm"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Category"
                        placeholder="contoh: Logo Design"
                        value={categoryFormData.name}
                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                    />
                    <Input
                        label="Slug"
                        placeholder="contoh: logo-design"
                        value={categoryFormData.slug}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                        disabled={!!categoryModal.category}
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setCategoryModal({ isOpen: false, clientId: null, category: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCategorySave}
                            disabled={!categoryFormData.name.trim() || !categoryFormData.slug.trim()}
                            isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        >
                            {categoryModal.category ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Category Modal */}
            <Modal
                isOpen={deleteCategoryModal.isOpen}
                onClose={() => setDeleteCategoryModal({ isOpen: false, category: null })}
                title="Hapus Category"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus category "{deleteCategoryModal.category?.name}"?
                        <span className="block mt-2 text-cms-warning">
                            ⚠️ Semua gambar dalam category ini akan ikut terhapus.
                        </span>
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setDeleteCategoryModal({ isOpen: false, category: null })}>
                            Batal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCategoryDelete}
                            isLoading={deleteCategoryMutation.isPending}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// Component for categories with gallery upload
function ClientCategoriesWithGallery({
    clientId,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
}: {
    clientId: string;
    onAddCategory: () => void;
    onEditCategory: (category: ClientCategory) => void;
    onDeleteCategory: (category: ClientCategory) => void;
}) {
    const { data: categories = [], isLoading } = useCategoriesByClient(clientId);
    const addImageMutation = useAddCategoryImage();
    const removeImagesMutation = useRemoveCategoryImages();
    const { upload, isUploading } = useUpload();
    const toast = useToastHelpers();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Crop modal state
    const [cropModal, setCropModal] = useState<{
        isOpen: boolean;
        imageSrc: string;
        categoryId: string | null;
    }>({ isOpen: false, imageSrc: '', categoryId: null });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);

    const toggleCategoryExpanded = (categoryId: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Handle file selection - open crop modal
    const handleFileSelect = (categoryId: string) => {
        setPendingCategoryId(categoryId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && pendingCategoryId) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropModal({
                    isOpen: true,
                    imageSrc: reader.result as string,
                    categoryId: pendingCategoryId,
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Handle cropped image upload
    const handleCropComplete = async (croppedBlob: Blob) => {
        if (!cropModal.categoryId) return;

        try {
            // Convert blob to file
            const file = new File([croppedBlob], 'gallery-image.png', { type: 'image/png' });
            const result = await upload(file);
            if (result?.url) {
                await addImageMutation.mutateAsync({ categoryId: cropModal.categoryId, url: result.url });
                toast.success('Berhasil', 'Gambar berhasil diupload');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal upload gambar';
            toast.error('Error', message);
        }
    };

    const handleRemoveImage = async (categoryId: string, imageId: string) => {
        try {
            await removeImagesMutation.mutateAsync({ categoryId, imageIds: [imageId] });
            toast.success('Berhasil', 'Gambar berhasil dihapus');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus gambar';
            toast.error('Error', message);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-4 pt-4 border-t border-cms-border">
                <div className="flex items-center gap-2 text-cms-text-muted">
                    <div className="w-4 h-4 rounded-full border-2 border-cms-accent border-r-transparent animate-spin" />
                    <span className="text-sm">Loading categories...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mt-4 pt-4 border-t border-cms-border">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-cms-text-secondary flex items-center gap-2">
                        <Tag size={14} />
                        Categories ({categories.length})
                    </h4>
                    <button
                        onClick={onAddCategory}
                        className="flex items-center gap-1 text-sm text-cms-accent hover:text-cms-accent-hover transition-colors"
                    >
                        <Plus size={14} />
                        Tambah Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <p className="text-sm text-cms-text-muted italic">
                        Belum ada category. Tambahkan category untuk mulai upload gallery.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-cms-bg-secondary rounded-lg overflow-hidden">
                                {/* Category header */}
                                <div className="flex items-center justify-between p-3">
                                    <button
                                        onClick={() => toggleCategoryExpanded(category.id)}
                                        className="flex items-center gap-2 flex-1 text-left"
                                    >
                                        {expandedCategories.has(category.id) ? (
                                            <ChevronDown size={16} className="text-cms-text-muted" />
                                        ) : (
                                            <ChevronRight size={16} className="text-cms-text-muted" />
                                        )}
                                        <Tag size={14} className="text-cms-accent" />
                                        <span className="text-sm text-cms-text-primary font-medium">{category.name}</span>
                                        <span className="text-xs text-cms-text-muted">/{category.slug}</span>
                                        <span className="text-xs bg-cms-bg-tertiary text-cms-text-muted px-1.5 py-0.5 rounded ml-2">
                                            {category._count?.images ?? category.images?.length ?? 0} gambar
                                        </span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onEditCategory(category)}
                                            className="p-1.5 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-tertiary rounded transition-colors"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteCategory(category)}
                                            className="p-1.5 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded gallery section */}
                                {expandedCategories.has(category.id) && (
                                    <div className="px-3 pb-3 border-t border-cms-border">
                                        <div className="pt-3">
                                            {/* Upload area */}
                                            <button
                                                onClick={() => handleFileSelect(category.id)}
                                                disabled={isUploading || addImageMutation.isPending}
                                                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-cms-border rounded-lg hover:border-cms-accent transition-colors mb-3 disabled:opacity-50"
                                            >
                                                {isUploading || addImageMutation.isPending ? (
                                                    <>
                                                        <div className="w-4 h-4 rounded-full border-2 border-cms-accent border-r-transparent animate-spin" />
                                                        <span className="text-sm text-cms-text-muted">Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} className="text-cms-text-muted" />
                                                        <span className="text-sm text-cms-text-muted">Klik untuk upload gambar (dengan crop)</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Masonry Gallery */}
                                            {category.images && category.images.length > 0 ? (
                                                <div className="columns-2 sm:columns-3 md:columns-4 gap-2 space-y-2">
                                                    {category.images.map((image) => (
                                                        <div key={image.id} className="relative group break-inside-avoid rounded-lg overflow-hidden bg-cms-bg-tertiary">
                                                            <img
                                                                src={image.url}
                                                                alt=""
                                                                className="w-full h-auto object-cover"
                                                            />
                                                            <button
                                                                onClick={() => handleRemoveImage(category.id, image.id)}
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-cms-text-muted text-center py-4 italic">
                                                    Belum ada gambar dalam category ini
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden file input for crop modal */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Image Crop Modal */}
            <ImageCropModal
                isOpen={cropModal.isOpen}
                onClose={() => setCropModal({ isOpen: false, imageSrc: '', categoryId: null })}
                imageSrc={cropModal.imageSrc}
                onCropComplete={handleCropComplete}
                showAspectPresets={true}
                title="Crop Gambar Gallery"
            />
        </>
    );
}

// Component for uploading client logo/thumbnail with crop
function ClientImageUpload({
    currentUrl,
    onUrlChange,
    aspectRatio,
    placeholder,
    previewSize = 'small',
}: {
    currentUrl: string;
    onUrlChange: (url: string) => void;
    aspectRatio: number;
    placeholder: string;
    previewSize?: 'small' | 'large';
}) {
    const { upload, isUploading } = useUpload();
    const toast = useToastHelpers();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cropModal, setCropModal] = useState<{
        isOpen: boolean;
        imageSrc: string;
    }>({ isOpen: false, imageSrc: '' });

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate image type
            if (!file.type.startsWith('image/')) {
                toast.error('Format Tidak Valid', 'Hanya file gambar yang diperbolehkan');
                return;
            }
            // Validate size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File Terlalu Besar', 'Ukuran maksimal adalah 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setCropModal({
                    isOpen: true,
                    imageSrc: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        try {
            const file = new File([croppedBlob], 'client-image.png', { type: 'image/png' });
            const result = await upload(file);
            if (result?.url) {
                onUrlChange(result.url);
                toast.success('Berhasil', 'Gambar berhasil diupload');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal upload gambar';
            toast.error('Error', message);
        }
        setCropModal({ isOpen: false, imageSrc: '' });
    };

    const handleRemove = () => {
        onUrlChange('');
    };

    const previewSizeClass = previewSize === 'large'
        ? 'w-full h-40'
        : 'w-24 h-24';

    return (
        <>
            <div className="flex items-start gap-4">
                {/* Preview */}
                {currentUrl ? (
                    <div className={`relative group ${previewSizeClass} rounded-lg overflow-hidden bg-cms-bg-secondary border border-cms-border`}>
                        <img
                            src={currentUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={handleFileSelect}
                                className="p-2 bg-cms-bg-primary rounded-full text-cms-text-primary hover:bg-cms-accent hover:text-black transition-colors"
                                title="Ganti gambar"
                            >
                                <Upload size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-cms-bg-primary rounded-full text-cms-error hover:bg-cms-error hover:text-white transition-colors"
                                title="Hapus gambar"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleFileSelect}
                        disabled={isUploading}
                        className={`${previewSizeClass} flex flex-col items-center justify-center gap-2 border-2 border-dashed border-cms-border rounded-lg hover:border-cms-accent transition-colors disabled:opacity-50`}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-6 h-6 rounded-full border-2 border-cms-accent border-r-transparent animate-spin" />
                                <span className="text-xs text-cms-text-muted">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={24} className="text-cms-text-muted" />
                                <span className="text-xs text-cms-text-muted text-center px-2">{placeholder}</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Crop Modal */}
            <ImageCropModal
                isOpen={cropModal.isOpen}
                onClose={() => setCropModal({ isOpen: false, imageSrc: '' })}
                imageSrc={cropModal.imageSrc}
                onCropComplete={handleCropComplete}
                aspectRatio={aspectRatio}
                title="Crop Gambar"
            />
        </>
    );
}
