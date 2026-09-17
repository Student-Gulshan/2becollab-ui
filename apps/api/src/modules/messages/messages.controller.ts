import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import {
  ConversationResponse,
  MessageResponse,
  UnreadCountResponse,
  PaginationMeta,
} from '@2becollab/types';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getUserConversations(
    @CurrentUser('id') userId: string,
  ): Promise<ConversationResponse[]> {
    return this.messagesService.getUserConversations(userId);
  }

  @Get('unread-count')
  async getUnreadCount(
    @CurrentUser('id') userId: string,
  ): Promise<UnreadCountResponse> {
    return this.messagesService.getUnreadCount(userId);
  }

  @Post()
  async startConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: StartConversationDto,
  ): Promise<ConversationResponse> {
    return this.messagesService.findOrCreateConversation(
      userId,
      dto.recipientId,
      dto.campaignId,
      dto.initialMessage,
    );
  }

  @Get(':id/messages')
  async getConversationMessages(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<{ items: MessageResponse[]; pagination: PaginationMeta }> {
    return this.messagesService.getConversationMessages(
      conversationId,
      userId,
      page,
      limit,
    );
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageResponse> {
    return this.messagesService.createMessage(
      conversationId,
      userId,
      dto.content,
      dto.attachments,
    );
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
  ): Promise<{ success: boolean }> {
    return this.messagesService.markAsRead(conversationId, userId);
  }
}
