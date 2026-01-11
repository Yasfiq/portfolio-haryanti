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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Public()
    @Get()
    async findAll() {
        return this.categoriesService.findAll();
    }

    @UseGuards(AdminGuard)
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @UseGuards(AdminGuard)
    @Patch('reorder')
    async reorder(@Body() reorderDto: ReorderDto) {
        return this.categoriesService.reorder(reorderDto);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
