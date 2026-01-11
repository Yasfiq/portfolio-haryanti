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
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto, ReorderDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('hero-slides')
export class HeroSlidesController {
    constructor(private readonly heroSlidesService: HeroSlidesService) { }

    @Public()
    @Get()
    async findAll() {
        return this.heroSlidesService.findAll();
    }

    @Public()
    @Get('visible')
    async findVisible() {
        return this.heroSlidesService.findVisible();
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createHeroSlideDto: CreateHeroSlideDto) {
        return this.heroSlidesService.create(createHeroSlideDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateHeroSlideDto: UpdateHeroSlideDto) {
        return this.heroSlidesService.update(id, updateHeroSlideDto);
    }

    @UseGuards(AdminGuard)
    @Patch(':id/visibility')
    async toggleVisibility(@Param('id') id: string) {
        return this.heroSlidesService.toggleVisibility(id);
    }

    @UseGuards(AdminGuard)
    @Patch('reorder')
    async reorder(@Body() reorderDto: ReorderDto) {
        return this.heroSlidesService.reorder(reorderDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.heroSlidesService.remove(id);
    }
}
