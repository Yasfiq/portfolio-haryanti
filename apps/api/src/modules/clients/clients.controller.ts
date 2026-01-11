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
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, ReorderClientsDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    // ============ PUBLIC ENDPOINTS ============

    // Get all visible clients
    @Public()
    @Get('visible')
    findAllVisible() {
        return this.clientsService.findAllVisible();
    }

    // Get client by slug (public)
    @Public()
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.clientsService.findBySlug(slug);
    }

    // ============ ADMIN ENDPOINTS ============

    // Get all clients (admin)
    @Get()
    @UseGuards(AdminGuard)
    findAll() {
        return this.clientsService.findAll();
    }

    // Get client by ID (admin)
    @Get(':id')
    @UseGuards(AdminGuard)
    findById(@Param('id') id: string) {
        return this.clientsService.findById(id);
    }

    // Create client
    @Post()
    @UseGuards(AdminGuard)
    create(@Body() dto: CreateClientDto) {
        return this.clientsService.create(dto);
    }

    // Update client
    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
        return this.clientsService.update(id, dto);
    }

    // Delete client
    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string) {
        return this.clientsService.delete(id);
    }

    // Toggle visibility
    @Patch(':id/toggle-visibility')
    @UseGuards(AdminGuard)
    toggleVisibility(@Param('id') id: string) {
        return this.clientsService.toggleVisibility(id);
    }

    // Reorder clients
    @Post('reorder')
    @UseGuards(AdminGuard)
    reorder(@Body() dto: ReorderClientsDto) {
        return this.clientsService.reorder(dto.orderedIds);
    }
}
