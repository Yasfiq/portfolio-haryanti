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

    // Get all categories (admin)
    @Get('categories')
    @UseGuards(AdminGuard)
    findAllCategories() {
        return this.clientsService.findAllCategories();
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

    // ============ CATEGORY ENDPOINTS ============

    // Get categories by client
    @Get(':clientId/categories')
    @UseGuards(AdminGuard)
    findCategoriesByClient(@Param('clientId') clientId: string) {
        return this.clientsService.findCategoriesByClient(clientId);
    }

    // Create category
    @Post(':clientId/categories')
    @UseGuards(AdminGuard)
    createCategory(
        @Param('clientId') clientId: string,
        @Body() body: { name: string; slug: string },
    ) {
        return this.clientsService.createCategory(clientId, body.name, body.slug);
    }

    // Update category
    @Put('categories/:categoryId')
    @UseGuards(AdminGuard)
    updateCategory(
        @Param('categoryId') categoryId: string,
        @Body() body: { name: string; slug?: string },
    ) {
        return this.clientsService.updateCategory(categoryId, body.name, body.slug);
    }

    // Delete category
    @Delete('categories/:categoryId')
    @UseGuards(AdminGuard)
    deleteCategory(@Param('categoryId') categoryId: string) {
        return this.clientsService.deleteCategory(categoryId);
    }

    // ============ GALLERY IMAGE ENDPOINTS ============

    // Add image to category
    @Post('categories/:categoryId/images')
    @UseGuards(AdminGuard)
    addCategoryImage(
        @Param('categoryId') categoryId: string,
        @Body() body: { url: string },
    ) {
        return this.clientsService.addCategoryImage(categoryId, body.url);
    }

    // Remove images from category
    @Delete('categories/:categoryId/images')
    @UseGuards(AdminGuard)
    removeCategoryImages(
        @Param('categoryId') categoryId: string,
        @Body() body: { imageIds: string[] },
    ) {
        return this.clientsService.removeCategoryImages(categoryId, body.imageIds);
    }

    // Reorder images in category
    @Patch('categories/:categoryId/images/reorder')
    @UseGuards(AdminGuard)
    reorderCategoryImages(
        @Param('categoryId') categoryId: string,
        @Body() body: { imageIds: string[] },
    ) {
        return this.clientsService.reorderCategoryImages(categoryId, body.imageIds);
    }
}
