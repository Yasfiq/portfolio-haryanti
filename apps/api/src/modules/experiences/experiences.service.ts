import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { CreateExperienceDto, UpdateExperienceDto } from './dto';

@Injectable()
export class ExperiencesService {
    async findAll() {
        // Sort by isCurrent DESC (current job first), then by startDate DESC (newest first)
        return prisma.experience.findMany({
            orderBy: [
                { isCurrent: 'desc' },
                { startDate: 'desc' },
            ],
        });
    }

    async findOne(id: string) {
        const experience = await prisma.experience.findUnique({ where: { id } });
        if (!experience) {
            throw new NotFoundException('Experience not found');
        }
        return experience;
    }

    async create(createExperienceDto: CreateExperienceDto) {
        return prisma.experience.create({
            data: {
                ...createExperienceDto,
                startDate: new Date(createExperienceDto.startDate).toISOString(),
                endDate: createExperienceDto.endDate ? new Date(createExperienceDto.endDate).toISOString() : null,
            },
        });
    }

    async update(id: string, updateExperienceDto: UpdateExperienceDto) {
        const experience = await prisma.experience.findUnique({ where: { id } });
        if (!experience) {
            throw new NotFoundException('Experience not found');
        }

        return prisma.experience.update({
            where: { id },
            data: {
                ...updateExperienceDto,
                startDate: updateExperienceDto.startDate ? new Date(updateExperienceDto.startDate).toISOString() : undefined,
                endDate: updateExperienceDto.endDate ? new Date(updateExperienceDto.endDate).toISOString() : updateExperienceDto.endDate,
            },
        });
    }

    async remove(id: string) {
        const experience = await prisma.experience.findUnique({ where: { id } });
        if (!experience) {
            throw new NotFoundException('Experience not found');
        }

        await prisma.experience.delete({ where: { id } });
        return { success: true };
    }
}
