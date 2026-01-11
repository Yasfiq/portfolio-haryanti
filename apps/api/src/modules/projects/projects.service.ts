import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateProjectDto, UpdateProjectDto, ReorderDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class ProjectsService {
    async findAll() {
        return prisma.project.findMany({
            orderBy: { order: 'asc' },
            include: {
                category: true,
                client: true,
                gallery: true,
            },
        });
    }

    async findVisible() {
        return prisma.project.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
            include: {
                category: true,
                client: true,
                gallery: true,
            },
        });
    }

    async findOne(id: string) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                category: true,
                client: true,
                gallery: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async findBySlug(slug: string) {
        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                category: true,
                client: true,
                gallery: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async create(createProjectDto: CreateProjectDto) {
        const slug = this.generateSlug(createProjectDto.title);

        // Check if slug exists
        const existing = await prisma.project.findUnique({ where: { slug } });
        if (existing) {
            throw new ConflictException('Project with similar title already exists');
        }

        // Get max order
        const maxOrder = await prisma.project.aggregate({
            _max: { order: true },
        });

        return prisma.project.create({
            data: {
                ...createProjectDto,
                projectDate: new Date(createProjectDto.projectDate).toISOString(),
                slug,
                order: (maxOrder._max.order || 0) + 1,
            },
            include: {
                category: true,
                gallery: true,
            },
        });
    }

    async update(id: string, updateProjectDto: UpdateProjectDto) {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // If title changed, update slug
        let slug = project.slug;
        if (updateProjectDto.title && updateProjectDto.title !== project.title) {
            slug = this.generateSlug(updateProjectDto.title);
            const existing = await prisma.project.findFirst({
                where: { slug, NOT: { id } },
            });
            if (existing) {
                throw new ConflictException('Project with similar title already exists');
            }
        }

        return prisma.project.update({
            where: { id },
            data: {
                ...updateProjectDto,
                projectDate: updateProjectDto.projectDate ? new Date(updateProjectDto.projectDate).toISOString() : updateProjectDto.projectDate,
                slug,
            },
            include: {
                category: true,
                gallery: true,
            },
        });
    }

    async toggleVisibility(id: string) {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return prisma.project.update({
            where: { id },
            data: { isVisible: !project.isVisible },
        });
    }

    async reorder(reorderDto: ReorderDto) {
        const updates = reorderDto.items.map((item, index) =>
            prisma.project.update({
                where: { id: item.id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);
        return { success: true };
    }

    async like(id: string, ip: string) {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Hash the IP for privacy
        const userIpHash = crypto.createHash('sha256').update(ip).digest('hex');

        // Check if already liked
        const existingLike = await prisma.projectLike.findUnique({
            where: {
                projectId_userIpHash: {
                    projectId: id,
                    userIpHash,
                },
            },
        });

        if (existingLike) {
            throw new ConflictException('Already liked this project');
        }

        // Create like and increment counter
        await prisma.$transaction([
            prisma.projectLike.create({
                data: { projectId: id, userIpHash },
            }),
            prisma.project.update({
                where: { id },
                data: { likesCount: { increment: 1 } },
            }),
        ]);

        return {
            success: true,
            likesCount: project.likesCount + 1,
        };
    }

    async remove(id: string) {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        await prisma.project.delete({ where: { id } });
        return { success: true };
    }

    // Gallery management
    async addGalleryImage(projectId: string, url: string) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const image = await prisma.projectImage.create({
            data: {
                url,
                projectId,
            },
        });

        return image;
    }

    async removeGalleryImages(projectId: string, imageIds: string[]) {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        await prisma.projectImage.deleteMany({
            where: {
                id: { in: imageIds },
                projectId,
            },
        });

        return { success: true };
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}

