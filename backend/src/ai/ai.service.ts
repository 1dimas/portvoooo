import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_PROMPT } from './prompts/system.prompt';
import { buildGuidePrompt } from './prompts/guide.prompt';
import { buildLabPrompt } from './prompts/lab.prompt';
import { buildTerminalPrompt } from './prompts/terminal.prompt';

@Injectable()
export class AiService {
  private readonly apiKey: string | undefined;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    console.log('AI Service initialized. API Key present:', !!this.apiKey);
  }

  async generate(payload: {
    feature: string;
    message: string;
    context?: any;
    history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  }) {
    const { feature, message, context, history } = payload;

    // 1. Validation
    if (!message || message.trim().length === 0) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }
    if (message.length > 500) {
      throw new HttpException('Message too long (max 500 chars)', HttpStatus.BAD_REQUEST);
    }

    if (!this.apiKey) {
      throw new HttpException('AI configuration error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2. Build Prompt
    let featurePrompt = '';
    switch (feature) {
      case 'hero':
        featurePrompt = buildGuidePrompt(message);
        break;
      case 'lab':
        featurePrompt = buildLabPrompt(message, context);
        break;
      case 'terminal':
        featurePrompt = buildTerminalPrompt(message);
        break;
      default:
        featurePrompt = message;
    }

    const contents: any[] = [];
    if (history && history.length > 0) {
      contents.push(...history.slice(-4));
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${featurePrompt}\n\nUser message: ${message}` }],
    });

    // 3. Timeout Handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Gemini API error:', response.status, errorBody);
        
        if (response.status === 429) {
          return { reply: 'Whoa, slow down! Try again in a bit?' };
        }
        throw new HttpException('AI service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        return { reply: 'Something went off. Try asking again!' };
      }

      // 4. Suggestion Logic (Senior addition)
      let suggestion: string | undefined = undefined;
      const lower = reply.toLowerCase();
      if (feature === 'hero' || feature === 'terminal') {
        if (lower.includes('lab') || lower.includes('experiment')) suggestion = 'Explore Lab';
        else if (lower.includes('project') || lower.includes('portfolio')) suggestion = 'View Projects';
        else if (lower.includes('contact') || lower.includes('reach')) suggestion = 'Get in Touch';
      }

      return { reply, suggestion };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new HttpException('AI response timeout', HttpStatus.GATEWAY_TIMEOUT);
      }
      throw error;
    }
  }
}
