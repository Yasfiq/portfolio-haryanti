import {
    Controller,
    Get,
    Put,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, CreateEducationDto, UpdateEducationDto } from './dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Public()
    @Get()
    async getProfile() {
        return this.profileService.getProfile();
    }

    @UseGuards(AdminGuard)
    @Put()
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateProfile(updateProfileDto);
    }

    // Education endpoints
    @Public()
    @Get('educations')
    async getEducations() {
        return this.profileService.getEducations();
    }

    @UseGuards(AdminGuard)
    @Post('educations')
    async createEducation(@Body() createEducationDto: CreateEducationDto) {
        return this.profileService.createEducation(createEducationDto);
    }

    @UseGuards(AdminGuard)
    @Put('educations/:id')
    async updateEducation(
        @Param('id') id: string,
        @Body() updateEducationDto: UpdateEducationDto,
    ) {
        return this.profileService.updateEducation(id, updateEducationDto);
    }

    @UseGuards(AdminGuard)
    @Delete('educations/:id')
    async deleteEducation(@Param('id') id: string) {
        return this.profileService.deleteEducation(id);
    }
}
