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
                    orderBy: { startDate: 'desc' },
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
                fullName: updateProfileDto.fullName || '',
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
            orderBy: { startDate: 'desc' },
        });
    }

    async createEducation(createEducationDto: CreateEducationDto) {
        const profile = await prisma.profile.findFirst();
        if (!profile) {
            throw new NotFoundException('Profile not found. Create profile first.');
        }

        let formattedEndDate = createEducationDto.endDate

        if (formattedEndDate) {
            const currentEndDate = new Date(formattedEndDate);
            currentEndDate.setUTCHours(23, 59, 59, 999);
            formattedEndDate = currentEndDate.toISOString();
        }

        return prisma.education.create({
            data: {
                ...createEducationDto,
                startDate: new Date(createEducationDto.startDate).toISOString(),
                endDate: formattedEndDate,
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
            data: {
                ...updateEducationDto,
                startDate: updateEducationDto.startDate ? new Date(updateEducationDto.startDate).toISOString() : updateEducationDto.startDate,
                endDate: updateEducationDto.endDate ? new Date(updateEducationDto.endDate).toISOString() : updateEducationDto.endDate,
            },
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
