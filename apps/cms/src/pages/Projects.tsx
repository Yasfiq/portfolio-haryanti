import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { ProjectsSkeleton } from '../components/skeletons/ProjectsSkeleton';
import {
    useProjects,
    useDeleteProject,
    useToggleProjectVisibility,
    useReorderProjects,
} from '../hooks/useProjects';
import { useToastHelpers } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import type { Project } from '../types/project.types';

export default function Projects() {
    const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
    const deleteMutation = useDeleteProject();
    const toggleVisibilityMutation = useToggleProjectVisibility();
    const reorderMutation = useReorderProjects();
    const toast = useToastHelpers();

    // Drag state
    const dragItem = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
        isOpen: false,
        project: null,
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
        if (!deleteModal.project) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.project.id);
            toast.success('Berhasil', 'Project berhasil dihapus');
            setDeleteModal({ isOpen: false, project: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Gagal menghapus project';
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

        const reorderedProjects = [...projects];
        const draggedItem = reorderedProjects[dragItem.current];
        reorderedProjects.splice(dragItem.current, 1);
        reorderedProjects.splice(dropIndex, 0, draggedItem);

        resetDragState();

        try {
            await reorderMutation.mutateAsync({
                items: reorderedProjects.map(p => ({ id: p.id })),
            });
            toast.success('Berhasil', 'Urutan project berhasil diubah');
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
        return <ProjectsSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Projects
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data projects.'}
                </p>
                <Button variant="secondary" onClick={() => refetch()}>
                    <RefreshCw size={16} />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    const visibleCount = projects.filter(p => p.isVisible).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-cms-text-secondary">
                    {projects.length} projects • {visibleCount} visible
                </p>
                <Link to="/projects/new">
                    <Button variant="primary">
                        <Plus size={18} />
                        Add Project
                    </Button>
                </Link>
            </div>

            {/* Projects Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-cms-border">
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Project
                                </th>
                                <th className="text-left text-xs font-medium text-cms-text-secondary uppercase tracking-wider px-6 py-4">
                                    Client
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
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
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
                                                {project.thumbnailUrl ? (
                                                    <img
                                                        src={project.thumbnailUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-cms-text-muted">
                                                        <FolderOpen size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-cms-text-primary">{project.title}</p>
                                                <p className="text-sm text-cms-text-muted">{project.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className="px-6 py-4 text-cms-text-secondary">
                                        {project.client || '-'}
                                    </td> */}
                                    <td className="px-6 py-4 text-cms-text-secondary">
                                        {formatDate(project.projectDate)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={project.isVisible ? 'success' : 'warning'}>
                                            {project.isVisible ? 'Visible' : 'Hidden'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(project.id)}
                                                className="p-2 text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                                title={project.isVisible ? 'Hide' : 'Show'}
                                            >
                                                {project.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="p-2 text-cms-text-secondary hover:text-cms-accent hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, project })}
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

                {projects.length === 0 && (
                    <div className="text-center py-12">
                        <FolderOpen size={48} className="mx-auto text-cms-text-muted mb-4" />
                        <p className="text-cms-text-secondary">No projects yet</p>
                        <Link to="/projects/new" className="text-cms-accent hover:text-cms-accent-hover mt-2 inline-block">
                            Add your first project →
                        </Link>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, project: null })}
                title="Delete Project"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Are you sure you want to delete "{deleteModal.project?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, project: null })}
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
