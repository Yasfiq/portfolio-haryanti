import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma, Prisma } from '@repo/database';
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
                title: createHeroSlideDto.title,
                template: createHeroSlideDto.template,
                schema: createHeroSlideDto.schema as unknown as Prisma.InputJsonObject,
                backgroundColor: createHeroSlideDto.backgroundColor,
                backgroundFrom: createHeroSlideDto.backgroundFrom,
                backgroundTo: createHeroSlideDto.backgroundTo,
                isVisible: createHeroSlideDto.isVisible,
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
            data: {
                title: updateHeroSlideDto.title,
                template: updateHeroSlideDto.template,
                schema: updateHeroSlideDto.schema as unknown as Prisma.InputJsonObject | undefined,
                backgroundColor: updateHeroSlideDto.backgroundColor,
                backgroundFrom: updateHeroSlideDto.backgroundFrom,
                backgroundTo: updateHeroSlideDto.backgroundTo,
                isVisible: updateHeroSlideDto.isVisible,
            },
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
