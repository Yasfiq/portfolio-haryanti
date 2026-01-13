import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { PortfoliosSkeleton } from '../components/skeletons/PortfoliosSkeleton';
import {
    usePortfolios,
    useDeletePortfolio,
    useTogglePortfolioVisibility,
    useReorderPortfolios,
} from '../hooks/usePortfolios';
import { useToastHelpers } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import type { Portfolio } from '../types/portfolio.types';

export default function Portfolios() {
    const { data: portfolios = [], isLoading, isError, error, refetch } = usePortfolios();
    const deleteMutation = useDeletePortfolio();
    const toggleVisibilityMutation = useTogglePortfolioVisibility();
    const reorderMutation = useReorderPortfolios();
    const toast = useToastHelpers();

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; portfolio: Portfolio | null }>({
        isOpen: false,
        portfolio: null,
    });

    const handleToggleVisibility = async (id: string) => {
        try {
            await toggleVisibilityMutation.mutateAsync(id);
            toast.success('Berhasil', 'Status visibility berhasil diubah');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal mengubah visibility';
            toast.error('Error', message);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.portfolio) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.portfolio.id);
            toast.success('Berhasil', 'Portfolio berhasil dihapus');
            setDeleteModal({ isOpen: false, portfolio: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus portfolio';
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

        const reorderedPortfolios = [...portfolios];
        const draggedItem = reorderedPortfolios[dragItem.current];
        reorderedPortfolios.splice(dragItem.current, 1);
        reorderedPortfolios.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync({
                items: reorderedPortfolios.map(p => ({ id: p.id })),
            });
            toast.success('Berhasil', 'Urutan portfolio berhasil diubah');
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
        return <PortfoliosSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Portfolios
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data portfolios.'}
                </p>
                <Button variant="secondary" onClick={() => refetch()}>
                    <RefreshCw size={16} />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    const visibleCount = portfolios.filter(p => p.isVisible).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {portfolios.length} portfolios • {visibleCount} visible
                </p>
                <Link to="/portfolios/new">
                    <Button variant="primary">
                        <Plus size={18} />
                        Add Portfolio
                    </Button>
                </Link>
            </div>

            {/* Portfolios Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-cms-border">
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Portfolio
                                </th>
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Client / Category
                                </th>
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Date
                                </th>
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Status
                                </th>
                                <th className="text-right text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolios.map((portfolio, index) => (
                                <tr
                                    key={portfolio.id}
                                    className={`border-b border-cms-border hover:bg-cms-bg-hover transition-colors ${draggingIndex === index ? 'opacity-50 bg-cms-bg-hover' : ''
                                        } ${dragOverIndex === index ? 'ring-2 ring-cms-accent ring-inset' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={() => handleDragEnter(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <button className="cursor-grab active:cursor-grabbing text-cms-text-muted hover:text-cms-text-secondary">
                                                <GripVertical size={16} />
                                            </button>
                                            <div className="w-12 h-12 rounded-lg bg-cms-bg-secondary overflow-hidden flex-shrink-0">
                                                {portfolio.thumbnailUrl ? (
                                                    <img
                                                        src={portfolio.thumbnailUrl}
                                                        alt={portfolio.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-cms-text-muted">
                                                        <FolderOpen size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-cms-text-primary">{portfolio.title}</p>
                                                <p className="text-sm text-cms-text-muted">{portfolio.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-cms-text-secondary">
                                        {portfolio.category?.client?.name && portfolio.category?.name ? (
                                            <span>
                                                {portfolio.category.client.name} / {portfolio.category.name}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-cms-text-secondary">
                                        {formatDate(portfolio.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={portfolio.isVisible ? 'success' : 'warning'}>
                                            {portfolio.isVisible ? 'Visible' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(portfolio.id)}
                                                className="p-2 text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                                title={portfolio.isVisible ? 'Hide' : 'Show'}
                                            >
                                                {portfolio.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <Link
                                                to={`/portfolios/${portfolio.id}`}
                                                className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, portfolio })}
                                                className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {portfolios.length === 0 && (
                    <div className="text-center py-12">
                        <FolderOpen size={48} className="mx-auto text-cms-text-muted mb-4" />
                        <p className="text-cms-text-secondary">No portfolios yet</p>
                        <Link to="/portfolios/new" className="text-cms-accent hover:text-cms-accent-hover mt-2 inline-block">
                            Add your first portfolio →
                        </Link>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, portfolio: null })}
                title="Delete Portfolio"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Are you sure you want to delete "{deleteModal.portfolio?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, portfolio: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
