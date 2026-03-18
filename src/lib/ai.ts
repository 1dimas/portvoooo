/**
 * AI fetch wrapper with predefined fast responses and error handling.
 */

type AIContext = 'hero' | 'lab' | 'terminal';

interface AIMessage {
  role: string;
  text: string;
}

interface AIResponse {
  reply: string;
  suggestion?: string;
}

// Predefined fast responses — skip AI for common queries
const FAST_RESPONSES: Record<string, AIResponse> = {
  'projects': {
    reply: "I've built **Company Profile** (engagement +40%), **SportZone** (e-commerce), and **YOMU** (library system with real-time features). Scroll down to see them in action.",
    suggestion: 'View Projects',
  },
  'lab': {
    reply: "The Lab has 9 experimental UI projects — from **hand tracking** to **audio-reactive visualizers**. Each pushes the boundaries of what's possible in the browser.",
    suggestion: 'Explore Lab',
  },
  'about': {
    reply: "I'm Dimas — Frontend Developer specializing in interactive UI. I build interfaces that feel alive and adaptive, using React, Next.js, and Framer Motion.",
    suggestion: 'View Projects',
  },
  'about me': {
    reply: "I'm Dimas — Frontend Developer specializing in interactive UI. I build interfaces that feel alive and adaptive, using React, Next.js, and Framer Motion.",
    suggestion: 'View Projects',
  },
  'contact': {
    reply: "You can reach me via **WhatsApp** (08998076063) or **Email** (dimasdwianandaputra@gmail.com). I'm available for freelance work.",
    suggestion: 'Go to Contact',
  },
  'hi': {
    reply: "Hey! 👋 I'm your portfolio guide. Want to see **projects**, explore the **lab**, or learn more **about me**?",
  },
  'hello': {
    reply: "Hello! 👋 I can help you navigate this portfolio. Check out the **projects** for real-world work, or the **lab** for experimental UI.",
  },
  'tech stack': {
    reply: "Built with **React, Next.js, NestJS, Framer Motion, Tailwind CSS, PostgreSQL, and Prisma**. Modern tools for modern solutions.",
    suggestion: 'View Tech Stack',
  },
};

/**
 * Send message to AI backend.
 * First checks for predefined fast responses, then falls back to API.
 */
export async function sendAIMessage(
  message: string,
  context: AIContext,
  metadata?: Record<string, unknown>,
  previousMessages?: AIMessage[],
): Promise<AIResponse> {
  // Check fast responses first (case-insensitive)
  const normalizedMsg = message.trim().toLowerCase();
  const fastResponse = FAST_RESPONSES[normalizedMsg];
  if (fastResponse && context !== 'lab') {
    return fastResponse;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s client timeout

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context,
        metadata,
        previousMessages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { reply: 'AI is temporarily unavailable. Try again in a moment.' };
    }

    const data = await res.json();

    // Generate smart suggestion based on AI response
    const suggestion = generateSuggestion(data.reply, context);

    return {
      reply: data.reply,
      suggestion,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { reply: 'AI is taking too long. Try again.' };
    }
    return { reply: 'Connection failed. Check if the AI backend is running.' };
  }
}

/**
 * Generate smart suggestion CTA based on response content.
 */
function generateSuggestion(reply: string, context: string): string | undefined {
  const lower = reply.toLowerCase();

  if (context === 'hero') {
    if (lower.includes('lab') || lower.includes('experiment')) return 'Explore Lab';
    if (lower.includes('project') || lower.includes('portfolio')) return 'View Projects';
    if (lower.includes('contact') || lower.includes('reach')) return 'Get in Touch';
  }

  return undefined;
}
