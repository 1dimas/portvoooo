import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async generate(
    @Body() payload: {
      feature: string;
      message: string;
      context?: any;
      history?: any[];
    },
  ) {
    return this.aiService.generate(payload);
  }
}
