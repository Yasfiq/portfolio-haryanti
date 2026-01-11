import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateHeroSlideDto, UpdateHeroSlideDto, ReorderDto } from './dto';

@Injectable()
export class HeroSlidesService {
    async findAll() {
        return prisma.heroSlide.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async findVisible() {
        return prisma.heroSlide.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' },
        });
    }

    async create(createHeroSlideDto: CreateHeroSlideDto) {
        const maxOrder = await prisma.heroSlide.aggregate({
            _max: { order: true },
        });

        return prisma.heroSlide.create({
            data: {
                ...createHeroSlideDto,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
    }

    async update(id: string, updateHeroSlideDto: UpdateHeroSlideDto) {
        const slide = await prisma.heroSlide.findUnique({ where: { id } });
        if (!slide) {
            throw new NotFoundException('Hero slide not found');
        }

        return prisma.heroSlide.update({
            where: { id },
            data: updateHeroSlideDto,
        });
    }

    async toggleVisibility(id: string) {
        const slide = await prisma.heroSlide.findUnique({ where: { id } });
        if (!slide) {
            throw new NotFoundException('Hero slide not found');
        }

        // If trying to hide a visible slide, check if it's the last one
        if (slide.isVisible) {
            const visibleCount = await prisma.heroSlide.count({
                where: { isVisible: true },
            });

            if (visibleCount <= 1) {
                throw new BadRequestException(
                    'Minimal satu slide harus tetap visible'
                );
            }
        }

        return prisma.heroSlide.update({
            where: { id },
            data: { isVisible: !slide.isVisible },
        });
    }

    async reorder(reorderDto: ReorderDto) {
        const updates = reorderDto.items.map((item, index) =>
            prisma.heroSlide.update({
                where: { id: item.id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);
        return { success: true };
    }

    async remove(id: string) {
        const slide = await prisma.heroSlide.findUnique({ where: { id } });
        if (!slide) {
            throw new NotFoundException('Hero slide not found');
        }

        await prisma.heroSlide.delete({ where: { id } });
        return { success: true };
    }
}
