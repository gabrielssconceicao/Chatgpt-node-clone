import { Body, Controller, Post } from '@nestjs/common';
import { ChatResponseDto, SendMessageDto } from '../dtos/chat.dto';

@Controller('chat')
export class ChatController {
  constructor() {}
  @Post()
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ChatResponseDto> {
    return {} as any;
  }
}
