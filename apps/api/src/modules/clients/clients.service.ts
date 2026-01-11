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
                projects: {
                    where: { isVisible: true },
                    select: { id: true },
                },
            },
        });
    }

    // Get all clients (admin - includes hidden)
    async findAll() {
        return prisma.client.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { projects: true },
                },
            },
        });
    }

    // Get client by slug with projects
    async findBySlug(slug: string) {
        const client = await prisma.client.findUnique({
            where: { slug },
            include: {
                projects: {
                    where: { isVisible: true },
                    orderBy: { order: 'asc' },
                    include: {
                        category: true,
                        gallery: true,
                    },
                },
            },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        return client;
    }

    // Get client by ID
    async findById(id: string) {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                projects: {
                    orderBy: { order: 'asc' },
                    include: {
                        category: true,
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

    // Delete client
    async delete(id: string) {
        const client = await prisma.client.findUnique({
            where: { id },
            include: { _count: { select: { projects: true } } },
        });

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        // Unlink projects from this client first
        await prisma.project.updateMany({
            where: { clientId: id },
            data: { clientId: null },
        });

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
}
