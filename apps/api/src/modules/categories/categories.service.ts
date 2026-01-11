import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateCategoryDto, UpdateCategoryDto, ReorderDto } from './dto';

@Injectable()
export class CategoriesService {
    async findAll() {
        return prisma.projectCategory.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { projects: true } },
            },
        });
    }

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = this.generateSlug(createCategoryDto.name);

        const existing = await prisma.projectCategory.findFirst({
            where: { OR: [{ name: createCategoryDto.name }, { slug }] },
        });

        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        const maxOrder = await prisma.projectCategory.aggregate({
            _max: { order: true },
        });

        return prisma.projectCategory.create({
            data: {
                name: createCategoryDto.name,
                slug,
                order: (maxOrder._max.order || 0) + 1,
            },
        });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await prisma.projectCategory.findUnique({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        let slug = category.slug;
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            slug = this.generateSlug(updateCategoryDto.name);
            const existing = await prisma.projectCategory.findFirst({
                where: { slug, NOT: { id } },
            });
            if (existing) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        return prisma.projectCategory.update({
            where: { id },
            data: { ...updateCategoryDto, slug },
        });
    }

    async reorder(reorderDto: ReorderDto) {
        const updates = reorderDto.items.map((item, index) =>
            prisma.projectCategory.update({
                where: { id: item.id },
                data: { order: index + 1 },
            }),
        );

        await prisma.$transaction(updates);
        return { success: true };
    }

    async remove(id: string) {
        const category = await prisma.projectCategory.findUnique({
            where: { id },
            include: { _count: { select: { projects: true } } },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (category._count.projects > 0) {
            throw new ConflictException('Cannot delete category with projects. Remove projects first.');
        }

        await prisma.projectCategory.delete({ where: { id } });
        return { success: true };
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}
