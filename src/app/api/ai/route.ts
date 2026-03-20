import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts/system.prompt';
import { buildGuidePrompt } from '@/lib/ai/prompts/guide.prompt';
import { buildLabPrompt } from '@/lib/ai/prompts/lab.prompt';
import { buildTerminalPrompt } from '@/lib/ai/prompts/terminal.prompt';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(req: Request) {
  try {
    const { feature, message, context, previousMessages } = await req.json();

    if (!API_KEY) {
      console.error('⚠️ GEMINI_API_KEY is not set!');
      return NextResponse.json({ reply: 'AI configuration error. Please check environment variables.' }, { status: 500 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Select the appropriate prompt builder based on the feature
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

    // Build conversation contents
    const contents: any[] = [];
    
    // Add history (max 4 messages)
    if (previousMessages && previousMessages.length > 0) {
      const recent = previousMessages.slice(-4);
      for (const msg of recent) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current message with feature context
    contents.push({
      role: 'user',
      parts: [{ text: `${featurePrompt}\n\nUser message: ${message}` }],
    });

    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
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
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      
      if (response.status === 429) {
        return NextResponse.json({ 
          reply: 'Whoa, slow down! I need a few seconds to catch my breath. Try again in a bit?' 
        });
      }

      return NextResponse.json({ reply: 'I am taking a quick break from AI things. Try again in a second?' }, { status: response.status });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      return NextResponse.json({ reply: 'Something went off. Try asking again!' });
    }

    // Generate a suggestion based on keywords in the reply
    const lower = reply.toLowerCase();
    let suggestion = undefined;
    if (feature === 'hero' || feature === 'terminal') {
      if (lower.includes('lab') || lower.includes('experiment')) suggestion = 'Explore Lab';
      else if (lower.includes('project') || lower.includes('portfolio')) suggestion = 'View Projects';
      else if (lower.includes('contact') || lower.includes('reach') || lower.includes('pesan')) suggestion = 'Get in Touch';
      else if (lower.includes('tech') || lower.includes('stack') || lower.includes('skill')) suggestion = 'View Tech Stack';
    }

    return NextResponse.json({ reply, suggestion });
  } catch (error) {
    console.error('AI Route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
