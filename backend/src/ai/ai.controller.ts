import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';

interface ChatRequest {
  message: string;
  context: 'hero' | 'lab' | 'terminal';
  metadata?: Record<string, unknown>;
  previousMessages?: { role: string; text: string }[];
}

@Controller('chat')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async chat(@Body() body: ChatRequest) {
    // Input validation
    if (!body.message || typeof body.message !== 'string') {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    if (!body.context || !['hero', 'lab', 'terminal'].includes(body.context)) {
      throw new HttpException('Valid context required (hero | lab | terminal)', HttpStatus.BAD_REQUEST);
    }

    try {
      const reply = await this.aiService.generateResponse(
        body.message,
        body.context,
        body.metadata,
        body.previousMessages,
      );
      return { reply };
    } catch (error) {
      console.error('AI Error:', error);
      throw new HttpException(
        'AI is temporarily unavailable. Please try again.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
