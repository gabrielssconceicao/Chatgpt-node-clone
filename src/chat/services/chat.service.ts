import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ChatResponseDto, SendMessageDto } from '../dtos/chat.dto';
import {
  Conversation,
  Message,
  MessageRole,
} from '../entities/conversation.entity';
import { OpenAIService } from './openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly openaiService: OpenAIService,
  ) {}
  async sendMessage(sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    try {
      console.log('Recieved message:', sendMessageDto.message);

      let conversation: Conversation;

      if (sendMessageDto.conversationId) {
        console.log(
          'Finding conversation with id:',
          sendMessageDto.conversationId,
        );
        const foundConversation = await this.conversationRepository.findOne({
          where: { id: sendMessageDto.conversationId },
        });

        if (!foundConversation) {
          throw new NotFoundException('Conversation not found');
        }
        conversation = foundConversation;
      } else {
        console.log('Creating new conversation');
        conversation = this.conversationRepository.create({
          messages: [],
          isFinished: false,
        });
      }

      const userMessage: Message = {
        id: uuidv4(),
        role: MessageRole.USER,
        content: sendMessageDto.message,
        timestamp: new Date(),
      };

      conversation.messages.push(userMessage);
      console.log('User message added to conversation', userMessage);

      const messageForOpenIA = conversation.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      console.log('Send message to OpenAI');
      const apiResponse =
        await this.openaiService.sendMessage(messageForOpenIA);
      console.log("OpenAI's response:", apiResponse);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: MessageRole.ASSISTANT,
        content: apiResponse,
        timestamp: new Date(),
      };

      conversation.messages.push(assistantMessage);
      console.log('Assistant message added to conversation', assistantMessage);

      await this.conversationRepository.save(conversation);
      console.log(
        'Conversation saved with messages: ',
        conversation.messages.length,
      );
      return {
        conversationId: conversation.id,
        messages: conversation.messages,
      };
    } catch (error) {
      console.log('Error sending message:', error);
      throw new Error('Error sending message');
    }
  }
}
