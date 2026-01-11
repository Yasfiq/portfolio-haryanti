import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, ReorderDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Public()
    @Get()
    async findAll() {
        return this.servicesService.findAll();
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @UseGuards(AdminGuard)
    @Patch('reorder')
    async reorder(@Body() reorderDto: ReorderDto) {
        return this.servicesService.reorder(reorderDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
