/**
 * Client-side AI handler for frontend integration.
 * All requests go to the internal /api/ai route.
 * Includes fast responses for common queries to save tokens and time.
 */

export interface AIResponse {
  reply: string;
  suggestion?: string;
}

// Predefined fast responses for common queries
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
  'contact': {
    reply: "You can reach me via **WhatsApp** (08998076063) or **Email** (dimasdwianandaputra@gmail.com). I'm available for freelance work.",
    suggestion: 'Get in Touch',
  },
  'hi': {
    reply: "Hey! 👋 I'm your portfolio guide. Want to see **projects**, explore the **lab**, or learn more **about me**?",
  },
};

let lastRequestTime = 0;
const COOLDOWN_MS = 2000; // 2 sec minimum between reqs

export async function sendAIMessage(
  message: string,
  feature: 'hero' | 'lab' | 'terminal',
  context?: any,
  previousMessages?: { role: string; text: string }[]
): Promise<AIResponse> {
  const normalizedMsg = message.trim().toLowerCase();

  // Check cooldown
  const now = Date.now();
  if (now - lastRequestTime < COOLDOWN_MS) {
    return { reply: "I'm thinking a bit too fast! Give me a second..." };
  }
  lastRequestTime = now;

  // Check fast responses for hero/terminal context
  if (feature !== 'lab' && FAST_RESPONSES[normalizedMsg]) {
    return FAST_RESPONSES[normalizedMsg];
  }

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature,
        message,
        context,
        previousMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        reply: data.reply || 'AI is temporarily unavailable. Try again in a moment.' 
      };
    }
    
    // Generate simple suggestion contextually if none provided
    const suggestion = generateSuggestion(data.reply, feature);

    return {
      reply: data.reply,
      suggestion: data.suggestion || suggestion,
    };
  } catch (error) {
    console.error('AI Client error:', error);
    return {
      reply: 'Sorry, I am having trouble connecting to the AI system right now.',
    };
  }
}

function generateSuggestion(reply: string, feature: string): string | undefined {
  const lower = reply.toLowerCase();
  if (feature === 'hero') {
    if (lower.includes('lab') || lower.includes('experiment')) return 'Explore Lab';
    if (lower.includes('project') || lower.includes('portfolio')) return 'View Projects';
    if (lower.includes('contact') || lower.includes('reach')) return 'Get in Touch';
  }
  return undefined;
}
