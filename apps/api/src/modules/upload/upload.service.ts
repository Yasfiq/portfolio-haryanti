import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createR2Client } from '../../config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);
    private r2Client = createR2Client();
    private bucket = process.env.R2_BUCKET_NAME || 'portfolio-assets';
    private publicUrl = process.env.R2_PUBLIC_URL;

    private readonly allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf', // for resume
    ];

    private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

    async uploadFile(file: Express.Multer.File) {
        this.validateFile(file);

        if (!this.r2Client) {
            throw new BadRequestException('R2 storage not configured');
        }

        const key = this.generateKey(file.originalname);

        try {
            await this.r2Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );

            const url = this.publicUrl
                ? `${this.publicUrl}/${key}`
                : `https://${this.bucket}.r2.dev/${key}`;

            return { key, url };
        } catch (error) {
            this.logger.error(`Upload failed: ${error}`);
            throw new BadRequestException('Failed to upload file');
        }
    }

    async uploadFiles(files: Express.Multer.File[]) {
        const results = await Promise.all(
            files.map((file) => this.uploadFile(file)),
        );
        return { files: results };
    }

    async deleteFile(key: string) {
        if (!this.r2Client) {
            throw new BadRequestException('R2 storage not configured');
        }

        try {
            await this.r2Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            );

            return { success: true, key };
        } catch (error) {
            this.logger.error(`Delete failed: ${error}`);
            throw new BadRequestException('Failed to delete file');
        }
    }

    private validateFile(file: Express.Multer.File) {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type. Allowed: ${this.allowedMimeTypes.join(', ')}`,
            );
        }

        if (file.size > this.maxFileSize) {
            throw new BadRequestException('File too large. Max size: 10MB');
        }
    }

    private generateKey(originalName: string): string {
        const ext = originalName.split('.').pop() || 'jpg';
        const date = new Date().toISOString().split('T')[0];
        return `uploads/${date}/${uuid()}.${ext}`;
    }
}
