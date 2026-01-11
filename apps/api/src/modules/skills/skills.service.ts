import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateSkillDto, UpdateSkillDto, ReorderDto, SkillCategory } from './dto';

@Injectable()
export class SkillsService {
    async findAll(category?: string) {
        const where = category
            ? { category: category as SkillCategory }
            : undefined;

        return prisma.skill.findMany({
            where,
            orderBy: { order: 'asc' },
        });
    }

    async create(createSkillDto: CreateSkillDto) {
        const maxOrder = await prisma.skill.aggregate({
            _max: { order: true },
            where: { category: createSkillDto.category },
        });

        return prisma.skill.create({
            data: {
                ...createSkillDto,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
    }

    async update(id: string, updateSkillDto: UpdateSkillDto) {
        const skill = await prisma.skill.findUnique({ where: { id } });
        if (!skill) {
            throw new NotFoundException('Skill not found');
        }

        return prisma.skill.update({
            where: { id },
            data: updateSkillDto,
        });
    }

    async reorder(reorderDto: ReorderDto) {
        const updates = reorderDto.items.map((item, index) =>
            prisma.skill.update({
                where: { id: item.id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);
        return { success: true };
    }

    async remove(id: string) {
        const skill = await prisma.skill.findUnique({ where: { id } });
        if (!skill) {
            throw new NotFoundException('Skill not found');
        }

        await prisma.skill.delete({ where: { id } });
        return { success: true };
    }
}
