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
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto, ReorderDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Public()
    @Get()
    async findAll(@Query('category') category?: string) {
        return this.skillsService.findAll(category);
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createSkillDto: CreateSkillDto) {
        return this.skillsService.create(createSkillDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
        return this.skillsService.update(id, updateSkillDto);
    }

    @UseGuards(AdminGuard)
    @Patch('reorder')
    async reorder(@Body() reorderDto: ReorderDto) {
        return this.skillsService.reorder(reorderDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.skillsService.remove(id);
    }
}
