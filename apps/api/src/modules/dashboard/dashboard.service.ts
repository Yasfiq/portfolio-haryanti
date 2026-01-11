import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/database';

@Injectable()
export class DashboardService {
    async getStats() {
        const [
            totalProjects,
            visibleProjects,
            unreadMessages,
            totalMessages,
            skills,
            experiences,
            recentMessages,
        ] = await Promise.all([
            prisma.project.count(),
            prisma.project.count({ where: { isVisible: true } }),
            prisma.message.count({ where: { isRead: false } }),
            prisma.message.count(),
            prisma.skill.count(),
            prisma.experience.count(),
            prisma.message.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    content: true,
                    isRead: true,
                    createdAt: true,
                },
            }),
        ]);

        return {
            totalProjects,
            visibleProjects,
            unreadMessages,
            totalMessages,
            skills,
            experiences,
            recentMessages,
        };
    }
}
