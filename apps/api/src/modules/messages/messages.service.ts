import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateMessageDto } from './dto/create-message.dto';
import { EmailService } from '../email';

@Injectable()
export class MessagesService {
    constructor(private readonly emailService: EmailService) { }

    async create(createMessageDto: CreateMessageDto) {
        const message = await prisma.message.create({
            data: createMessageDto,
        });

        // Send email notification to admin
        await this.emailService.sendNewMessageNotification(message);

        return {
            success: true,
            message: 'Message sent successfully',
        };
    }

    async findAll() {
        return prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const message = await prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        // Mark as read when viewing
        if (!message.isRead) {
            await prisma.message.update({
                where: { id },
                data: { isRead: true },
            });
        }

        return message;
    }

    async toggleRead(id: string) {
        const message = await prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        return prisma.message.update({
            where: { id },
            data: { isRead: !message.isRead },
        });
    }

    async remove(id: string) {
        const message = await prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        await prisma.message.delete({ where: { id } });
        return { success: true };
    }
}
