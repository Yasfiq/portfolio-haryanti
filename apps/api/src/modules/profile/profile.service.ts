import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/database';
import { UpdateProfileDto, CreateEducationDto, UpdateEducationDto } from './dto';

@Injectable()
export class ProfileService {
    async getProfile() {
        // Get the first (and only) profile, or return null
        const profile = await prisma.profile.findFirst({
            include: {
                educations: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        return profile;
    }

    async updateProfile(updateProfileDto: UpdateProfileDto) {
        // Get existing profile or create if doesn't exist
        const existing = await prisma.profile.findFirst();

        if (existing) {
            return prisma.profile.update({
                where: { id: existing.id },
                data: updateProfileDto,
                include: { educations: true },
            });
        }

        // Create new profile
        return prisma.profile.create({
            data: {
                title: updateProfileDto.title || '',
                bio: updateProfileDto.bio || '',
                email: updateProfileDto.email || '',
                ...updateProfileDto,
            },
            include: { educations: true },
        });
    }

    async getEducations() {
        return prisma.education.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async createEducation(createEducationDto: CreateEducationDto) {
        const profile = await prisma.profile.findFirst();
        if (!profile) {
            throw new NotFoundException('Profile not found. Create profile first.');
        }

        return prisma.education.create({
            data: {
                degree: createEducationDto.degree,
                institution: createEducationDto.institution,
                startYear: createEducationDto.startYear,
                endYear: createEducationDto.endYear,
                isCurrent: createEducationDto.isCurrent ?? false,
                description: createEducationDto.description,
                order: createEducationDto.order ?? 0,
                profileId: profile.id,
            },
        });
    }

    async updateEducation(id: string, updateEducationDto: UpdateEducationDto) {
        const education = await prisma.education.findUnique({ where: { id } });
        if (!education) {
            throw new NotFoundException('Education not found');
        }

        return prisma.education.update({
            where: { id },
            data: updateEducationDto,
        });
    }

    async deleteEducation(id: string) {
        const education = await prisma.education.findUnique({ where: { id } });
        if (!education) {
            throw new NotFoundException('Education not found');
        }

        await prisma.education.delete({ where: { id } });
        return { success: true };
    }
}
