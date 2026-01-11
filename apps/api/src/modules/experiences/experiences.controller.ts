import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('experiences')
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @Public()
    @Get()
    async findAll() {
        return this.experiencesService.findAll();
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.experiencesService.findOne(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createExperienceDto: CreateExperienceDto) {
        return this.experiencesService.create(createExperienceDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
        return this.experiencesService.update(id, updateExperienceDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.experiencesService.remove(id);
    }
}
