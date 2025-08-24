import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openAI: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openAI = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async sendMessage(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await this.openAI.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        max_tokens: 1000,
        temperature: 0.7,
        store: true,
      });
      return (
        response.choices[0]?.message?.content ||
        'Desculpe não consegui gerar uma resposta'
      );
    } catch (error) {
      console.log('Error sending message to OpenAI');
      throw new Error('Error sending message to OpenAI');
    }
  }
}
