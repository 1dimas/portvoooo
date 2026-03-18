import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_PROMPT } from './prompts/system.prompt';
import { buildGuidePrompt } from './prompts/guide.prompt';
import { buildLabPrompt } from './prompts/lab.prompt';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  // Simple rate limiter: track last request time
  private lastRequestTime = 0;
  private readonly minInterval = 1500; // 1.5s between requests

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('GEMINI_API_KEY') ?? '';
    if (!this.apiKey) {
      console.error('⚠️ GEMINI_API_KEY is not set!');
    }
  }

  async generateResponse(
    message: string,
    context: 'hero' | 'lab' | 'terminal',
    metadata?: Record<string, unknown>,
    previousMessages?: { role: string; text: string }[],
  ): Promise<string> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest),
      );
    }
    this.lastRequestTime = Date.now();

    const prompt = this.buildPrompt(message, context, metadata);

    // Build conversation contents with memory
    const contents = this.buildContents(prompt, message, previousMessages);

    // Call Gemini with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
            topP: 0.9,
          },
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errBody = await response.text();
        console.error('Gemini API error:', response.status, errBody);
        return this.getFallbackResponse(context);
      }

      const data = await response.json();

      // Extract text from Gemini response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        return this.getFallbackResponse(context);
      }

      return text.trim();
    } catch (error: any) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        return 'AI is taking too long. Try again in a moment.';
      }
      console.error('Gemini fetch error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildPrompt(
    message: string,
    context: 'hero' | 'lab' | 'terminal',
    metadata?: Record<string, unknown>,
  ): string {
    switch (context) {
      case 'hero':
        return buildGuidePrompt(message);
      case 'lab':
        return buildLabPrompt(message, metadata);
      case 'terminal':
        return `User typed in the portfolio terminal: "${message}"\n\nRespond as a terminal AI assistant. Be technical, concise, and slightly playful.`;
      default:
        return message;
    }
  }

  private buildContents(
    contextPrompt: string,
    currentMessage: string,
    previousMessages?: { role: string; text: string }[],
  ) {
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add conversation history (memory)
    if (previousMessages?.length) {
      // Keep only last 4 messages for context window
      const recent = previousMessages.slice(-4);
      for (const msg of recent) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Current message with context
    contents.push({
      role: 'user',
      parts: [{ text: `${contextPrompt}\n\nUser message: ${currentMessage}` }],
    });

    return contents;
  }

  private getFallbackResponse(context: string): string {
    switch (context) {
      case 'hero':
        return "I'm here to guide you! Check out **Projects** to see my work, or explore the **Lab** for experimental UI.";
      case 'lab':
        return "This experiment explores cutting-edge UI/UX patterns. Check the description above for details.";
      case 'terminal':
        return "Connection unstable. Try `help` for available commands, or `ask` followed by your question.";
      default:
        return "Something went off. Try asking again!";
    }
  }
}
