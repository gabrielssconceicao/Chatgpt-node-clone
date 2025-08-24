import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ChatController } from './controllers/chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  controllers: [ChatController],
  providers: [],
})
export class ChatModule {}
