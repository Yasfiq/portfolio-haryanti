import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ReorderDto, AddGalleryImageDto, RemoveGalleryImagesDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    // Public endpoints
    @Public()
    @Get()
    async findAll(@Query('visible') visible?: string) {
        if (visible === 'true') {
            return this.projectsService.findVisible();
        }
        return this.projectsService.findAll();
    }

    @Public()
    @Get('visible')
    async findVisible() {
        return this.projectsService.findVisible();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Public()
    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.projectsService.findBySlug(slug);
    }

    @Public()
    @Post(':id/like')
    async like(@Param('id') id: string, @Req() req: Request) {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        return this.projectsService.like(id, ip);
    }

    // Admin-only endpoints
    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @UseGuards(AdminGuard)
    @Patch(':id/visibility')
    async toggleVisibility(@Param('id') id: string) {
        return this.projectsService.toggleVisibility(id);
    }

    @UseGuards(AdminGuard)
    @Patch('reorder')
    async reorder(@Body() reorderDto: ReorderDto) {
        return this.projectsService.reorder(reorderDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }

    // Gallery management
    @UseGuards(AdminGuard)
    @Post(':id/gallery')
    async addGalleryImage(@Param('id') id: string, @Body() dto: AddGalleryImageDto) {
        return this.projectsService.addGalleryImage(id, dto.url);
    }

    @UseGuards(AdminGuard)
    @Delete(':id/gallery')
    async removeGalleryImages(@Param('id') id: string, @Body() dto: RemoveGalleryImagesDto) {
        return this.projectsService.removeGalleryImages(id, dto.imageIds);
    }
}

