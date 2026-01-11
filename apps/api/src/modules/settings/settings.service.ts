import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/database';
import { UpdateSettingsDto } from './dto';

@Injectable()
export class SettingsService {
    async getSettings() {
        // Get the first (and only) settings, or return defaults
        const settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Return default settings
            return {
                siteName: 'Portfolio',
                logoUrl: null,
                faviconUrl: null,
                primaryColor: '#FFD369',
                secondaryColor: '#1a1a2e',
                footerText: '© 2024 All rights reserved.',
                ctaHeading: 'Let\'s Work Together',
                ctaDescription: 'Ready to bring your ideas to life?',
                ctaButtonText: 'Get In Touch',
            };
        }

        return settings;
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto) {
        const existing = await prisma.siteSettings.findFirst();

        if (existing) {
            return prisma.siteSettings.update({
                where: { id: existing.id },
                data: updateSettingsDto,
            });
        }

        // Create new settings
        return prisma.siteSettings.create({
            data: {
                siteName: updateSettingsDto.siteName || 'Portfolio',
                primaryColor: updateSettingsDto.primaryColor || '#FFD369',
                secondaryColor: updateSettingsDto.secondaryColor || '#1a1a2e',
                ...updateSettingsDto,
            },
        });
    }
}
