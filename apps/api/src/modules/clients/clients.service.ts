import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateClientDto, UpdateClientDto } from './dto';

@Injectable()
export class ClientsService {
    // Get all clients (public - only visible)
    async findAllVisible() {
        return prisma.client.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
            include: {
                categories: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { images: true },
                        },
                    },
                },
            },
        });
    }

    // Get all clients (admin - includes hidden)
    async findAll() {
        return prisma.client.findMany({
            orderBy: { order: 'asc' },
            include: {
                categories: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { images: true },
                        },
                    },
                },
                _count: {
                    select: { categories: true },
                },
            },
        });
    }

    // Get client by slug with categories and images (gallery)
    async findBySlug(slug: string) {
        const client = await prisma.client.findUnique({
            where: { slug },
            include: {
                categories: {
                    orderBy: { order: 'asc' },
                    include: {
                        images: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return client;
    }

    // Get client by ID with categories and images
    async findById(id: string) {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                categories: {
                    orderBy: { order: 'asc' },
                    include: {
                        images: {
                            orderBy: { order: 'asc' },
                        },
                        _count: {
                            select: { images: true },
                        },
                    },
                },
            },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return client;
    }

    // Create client
    async create(dto: CreateClientDto) {
        // Check if slug already exists
        const existing = await prisma.client.findUnique({
            where: { slug: dto.slug },
        });

        if (existing) {
            throw new ConflictException('Client with this slug already exists');
        }

        // Get max order if not provided
        let order = dto.order;
        if (order === undefined) {
            const maxOrder = await prisma.client.aggregate({
                _max: { order: true },
            });
            order = (maxOrder._max.order ?? 0) + 1;
        }

        return prisma.client.create({
            data: {
                ...dto,
                order,
            },
        });
    }

    // Update client
    async update(id: string, dto: UpdateClientDto) {
        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        // Check slug uniqueness if changing
        if (dto.slug && dto.slug !== client.slug) {
            const existing = await prisma.client.findUnique({
                where: { slug: dto.slug },
            });
            if (existing) {
                throw new ConflictException('Client with this slug already exists');
            }
        }

        return prisma.client.update({
            where: { id },
            data: dto,
        });
    }

    // Delete client (cascades to categories and images)
    async delete(id: string) {
        const client = await prisma.client.findUnique({
            where: { id },
            include: { _count: { select: { categories: true } } },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return prisma.client.delete({
            where: { id },
        });
    }

    // Toggle visibility
    async toggleVisibility(id: string) {
        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return prisma.client.update({
            where: { id },
            data: { isVisible: !client.isVisible },
        });
    }

    // Reorder clients
    async reorder(orderedIds: string[]) {
        const updates = orderedIds.map((id, index) =>
            prisma.client.update({
                where: { id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);

        return this.findAll();
    }

    // ========== Category Methods ==========

    // Get all categories
    async findAllCategories() {
        return prisma.clientCategory.findMany({
            orderBy: [{ client: { order: 'asc' } }, { order: 'asc' }],
            include: {
                client: true,
                _count: { select: { images: true } },
            },
        });
    }

    // Get categories by client (with images for gallery)
    async findCategoriesByClient(clientId: string) {
        return prisma.clientCategory.findMany({
            where: { clientId },
            orderBy: { order: 'asc' },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                },
                _count: { select: { images: true } },
            },
        });
    }

    // Create category
    async createCategory(clientId: string, name: string, slug: string) {
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        if (!client) {
            throw new NotFoundException('Client not found');
        }

        // Check slug uniqueness within client
        const existing = await prisma.clientCategory.findUnique({
            where: { clientId_slug: { clientId, slug } },
        });
        if (existing) {
            throw new ConflictException('Category with this slug already exists for this client');
        }

        // Get max order
        const maxOrder = await prisma.clientCategory.aggregate({
            where: { clientId },
            _max: { order: true },
        });

        return prisma.clientCategory.create({
            data: {
                name,
                slug,
                clientId,
                order: (maxOrder._max.order ?? 0) + 1,
            },
        });
    }

    // Update category
    async updateCategory(id: string, name: string, slug?: string) {
        const category = await prisma.clientCategory.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return prisma.clientCategory.update({
            where: { id },
            data: { name, ...(slug && { slug }) },
        });
    }

    // Delete category
    async deleteCategory(id: string) {
        const category = await prisma.clientCategory.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return prisma.clientCategory.delete({ where: { id } });
    }

    // ========== Gallery Image Methods ==========

    // Add image to category
    async addCategoryImage(categoryId: string, url: string) {
        const category = await prisma.clientCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Get max order
        const maxOrder = await prisma.categoryImage.aggregate({
            where: { categoryId },
            _max: { order: true },
        });

        return prisma.categoryImage.create({
            data: {
                url,
                categoryId,
                order: (maxOrder._max.order ?? 0) + 1,
            },
        });
    }

    // Remove images from category
    async removeCategoryImages(categoryId: string, imageIds: string[]) {
        await prisma.categoryImage.deleteMany({
            where: {
                id: { in: imageIds },
                categoryId,
            },
        });

        return { success: true };
    }

    // Reorder images in category
    async reorderCategoryImages(categoryId: string, imageIds: string[]) {
        const updates = imageIds.map((id, index) =>
            prisma.categoryImage.update({
                where: { id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);

        return prisma.categoryImage.findMany({
            where: { categoryId },
            orderBy: { order: 'asc' },
        });
    }
}
