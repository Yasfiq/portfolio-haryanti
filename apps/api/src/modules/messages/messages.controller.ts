import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AdminGuard } from '../../common/guards';
import { Public } from '../../common/decorators';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    // Public endpoint for contact form submission
    @Public()
    @Post()
    async create(@Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(createMessageDto);
    }

    // Admin-only endpoints
    @UseGuards(AdminGuard)
    @Get()
    async findAll() {
        return this.messagesService.findAll();
    }

    @UseGuards(AdminGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.messagesService.findOne(id);
    }

    @UseGuards(AdminGuard)
    @Patch(':id/read')
    async toggleRead(@Param('id') id: string) {
        return this.messagesService.toggleRead(id);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.messagesService.remove(id);
    }
}
