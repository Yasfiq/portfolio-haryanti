import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateServiceDto, UpdateServiceDto, ReorderDto } from './dto';

@Injectable()
export class ServicesService {
    async findAll() {
        return prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async create(createServiceDto: CreateServiceDto) {
        const maxOrder = await prisma.service.aggregate({
            _max: { order: true },
        });

        return prisma.service.create({
            data: {
                ...createServiceDto,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
    }

    async update(id: string, updateServiceDto: UpdateServiceDto) {
        const service = await prisma.service.findUnique({ where: { id } });
        if (!service) {
            throw new NotFoundException('Service not found');
        }

        return prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
    }

    async reorder(reorderDto: ReorderDto) {
        const updates = reorderDto.items.map((item, index) =>
            prisma.service.update({
                where: { id: item.id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);
        return { success: true };
    }

    async remove(id: string) {
        const service = await prisma.service.findUnique({ where: { id } });
        if (!service) {
            throw new NotFoundException('Service not found');
        }

        await prisma.service.delete({ where: { id } });
        return { success: true };
    }
}
