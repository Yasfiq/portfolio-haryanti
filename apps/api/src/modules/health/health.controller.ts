import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from '../../common/decorators';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @Public()
    @Get()
    healthCheck() {
        return this.healthService.check();
    }

    @Public()
    @Get('db')
    async dbCheck() {
        return this.healthService.checkDatabase();
    }
}
