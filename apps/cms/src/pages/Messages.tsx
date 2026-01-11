import { useState } from 'react';
import { Mail, MailOpen, Trash2, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { MessagesSkeleton } from '../components/skeletons/MessagesSkeleton';
import { useMessages, useToggleMessageRead, useDeleteMessage } from '../hooks/useMessages';
import { useToastHelpers } from '../context/ToastContext';
import { formatDate } from '../lib/utils';
import type { Message } from '../types/message.types';

export default function Messages() {
    const { data: messages = [], isLoading, isError, error, refetch } = useMessages();
    const toggleReadMutation = useToggleMessageRead();
    const deleteMutation = useDeleteMessage();
    const toast = useToastHelpers();

    const [viewModal, setViewModal] = useState<{ isOpen: boolean; message: Message | null }>({
        isOpen: false,
        message: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; messageId: string | null }>({
        isOpen: false,
        messageId: null,
    });

    const unreadCount = messages.filter((m) => !m.isRead).length;

    const openMessage = async (message: Message) => {
        // Mark as read when opening if not already read
        if (!message.isRead) {
            try {
                await toggleReadMutation.mutateAsync(message.id);
            } catch {
                // Silent fail - still show the message
            }
        }
        setViewModal({ isOpen: true, message: { ...message, isRead: true } });
    };

    const handleToggleRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await toggleReadMutation.mutateAsync(id);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal mengubah status';
            toast.error('Error', errorMessage);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.messageId) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.messageId);
            toast.success('Berhasil', 'Pesan berhasil dihapus');
            setDeleteModal({ isOpen: false, messageId: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus pesan';
            toast.error('Error', errorMessage);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Baru saja';
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays === 1) return 'Kemarin';
        return formatDate(dateString);
    };

    // Loading state
    if (isLoading) {
        return <MessagesSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-cms-error/10 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-cms-error" />
                </div>
                <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                    Gagal Memuat Pesan
                </h2>
                <p className="text-cms-text-secondary text-center max-w-md mb-4">
                    {error?.message || 'Terjadi kesalahan saat memuat data pesan.'}
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
                <div className="flex items-center gap-3">
                    <p className="text-cms-text-secondary">
                        {messages.length} pesan
                    </p>
                    {unreadCount > 0 && (
                        <Badge variant="warning">{unreadCount} belum dibaca</Badge>
                    )}
                </div>
            </div>

            {/* Messages List */}
            <Card padding="none">
                <div className="divide-y divide-cms-border">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-4 p-4 hover:bg-cms-bg-hover transition-colors cursor-pointer ${!message.isRead ? 'bg-cms-accent/5' : ''
                                }`}
                            onClick={() => openMessage(message)}
                        >
                            {/* Read indicator */}
                            <div className="pt-1">
                                {message.isRead ? (
                                    <MailOpen size={18} className="text-cms-text-muted" />
                                ) : (
                                    <Mail size={18} className="text-cms-accent" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${!message.isRead ? 'text-cms-text-primary' : 'text-cms-text-secondary'}`}>
                                            {message.name}
                                        </span>
                                        {!message.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-cms-accent" />
                                        )}
                                    </div>
                                    <span className="text-xs text-cms-text-muted whitespace-nowrap">
                                        {formatTimeAgo(message.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-cms-text-muted mb-1">{message.email}</p>
                                <p className="text-sm text-cms-text-secondary truncate">
                                    {message.content}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={(e) => handleToggleRead(message.id, e)}
                                    className="p-2 text-cms-text-secondary hover:text-cms-text-primary hover:bg-cms-bg-secondary rounded-lg transition-colors"
                                    title={message.isRead ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                                    disabled={toggleReadMutation.isPending}
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteModal({ isOpen: true, messageId: message.id });
                                    }}
                                    className="p-2 text-cms-text-secondary hover:text-cms-error hover:bg-cms-error/10 rounded-lg transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Mail size={48} className="mx-auto text-cms-text-muted mb-4" />
                        <p className="text-cms-text-secondary">Belum ada pesan</p>
                    </div>
                )}
            </Card>

            {/* View Message Modal */}
            <Modal
                isOpen={viewModal.isOpen}
                onClose={() => setViewModal({ isOpen: false, message: null })}
                title="Pesan"
                size="md"
            >
                {viewModal.message && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-cms-border pb-4">
                            <div>
                                <h3 className="font-semibold text-cms-text-primary">
                                    {viewModal.message.name}
                                </h3>
                                <p className="text-sm text-cms-text-muted">{viewModal.message.email}</p>
                            </div>
                            <span className="text-xs text-cms-text-muted">
                                {formatDate(viewModal.message.createdAt)}
                            </span>
                        </div>
                        <p className="text-cms-text-secondary whitespace-pre-wrap leading-relaxed">
                            {viewModal.message.content}
                        </p>
                        <div className="flex justify-end gap-3 pt-4 border-t border-cms-border">
                            <Button
                                variant="secondary"
                                onClick={() => setViewModal({ isOpen: false, message: null })}
                            >
                                Tutup
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={async () => {
                                    const email = viewModal.message?.email || '';
                                    try {
                                        await navigator.clipboard.writeText(email);
                                        toast.success('Email Disalin', `${email} berhasil disalin ke clipboard`);
                                    } catch {
                                        toast.info('Email', email);
                                    }
                                }}
                            >
                                Salin Email
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const email = viewModal.message?.email || '';
                                    const name = viewModal.message?.name || '';
                                    const subject = encodeURIComponent(`Re: Pesan dari ${name}`);
                                    window.location.href = `mailto:${email}?subject=${subject}`;
                                    toast.info(
                                        'Membuka Email Client',
                                        'Jika tidak terbuka, gunakan tombol "Salin Email"'
                                    );
                                }}
                            >
                                Balas via Email
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, messageId: null })}
                title="Hapus Pesan"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-cms-text-secondary">
                        Apakah Anda yakin ingin menghapus pesan ini?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, messageId: null })}
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
