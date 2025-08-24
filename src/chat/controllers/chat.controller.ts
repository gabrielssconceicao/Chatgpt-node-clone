import { Body, Controller, Post } from '@nestjs/common';
import { ChatResponseDto, SendMessageDto } from '../dtos/chat.dto';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(sendMessageDto);
  }
}
