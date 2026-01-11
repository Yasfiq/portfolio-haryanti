import { useState, useCallback } from 'react';
import { apiClient } from '../lib/apiClient';
import { useToastHelpers } from '../context/ToastContext';

export interface UploadResult {
    key: string;
    url: string;
}

interface UseUploadOptions {
    onSuccess?: (result: UploadResult) => void;
    onError?: (error: Error) => void;
}

/**
 * Hook for uploading files to the server
 */
export function useUpload(options?: UseUploadOptions) {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const toast = useToastHelpers();

    const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
        setIsUploading(true);
        setProgress(0);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // Upload using fetch directly (apiClient doesn't handle FormData)
            const result = await apiClient.upload<UploadResult>('/upload/image', formData);

            setProgress(100);
            options?.onSuccess?.(result);
            return result;
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Upload failed');
            toast.error('Upload Gagal', err.message);
            options?.onError?.(err);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [options, toast]);

    const uploadAvatar = useCallback(async (file: File) => {
        // Validate image type
        if (!file.type.startsWith('image/')) {
            toast.error('Format Tidak Valid', 'Hanya file gambar yang diperbolehkan');
            return null;
        }

        // Validate size (max 5MB for avatar)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File Terlalu Besar', 'Ukuran maksimal avatar adalah 5MB');
            return null;
        }

        return upload(file);
    }, [upload, toast]);

    const uploadResume = useCallback(async (file: File) => {
        // Validate PDF type
        if (file.type !== 'application/pdf') {
            toast.error('Format Tidak Valid', 'Hanya file PDF yang diperbolehkan');
            return null;
        }

        // Validate size (max 10MB for resume)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File Terlalu Besar', 'Ukuran maksimal resume adalah 10MB');
            return null;
        }

        return upload(file);
    }, [upload, toast]);

    return {
        upload,
        uploadAvatar,
        uploadResume,
        isUploading,
        progress,
    };
}
