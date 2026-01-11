import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { prisma } from '@repo/database';

@Injectable()
export class HealthService {
    private readonly logger = new Logger(HealthService.name);

    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    async checkDatabase() {
        try {
            // Simple query to keep connection active
            await prisma.$queryRaw`SELECT 1 as ping`;

            return {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            };
        }
    }

    // Keep database alive - runs every 5 days
    @Cron('0 0 */5 * *')
    async keepDatabaseAlive() {
        this.logger.log('Running scheduled database keep-alive ping...');
        const result = await this.checkDatabase();
        this.logger.log(`Database keep-alive result: ${result.status}`);
    }
}
