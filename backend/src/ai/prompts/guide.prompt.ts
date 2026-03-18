/**
 * Guide prompt — injects real portfolio data for hero context.
 */

// Real project data injected into prompt
const PORTFOLIO_DATA = {
  projects: [
    {
      title: 'Company Profile',
      category: 'UMKM Digital Presence',
      tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
      impact: 'Increased engagement rate by 40%',
    },
    {
      title: 'SportZone',
      category: 'E-Commerce Frontend',
      tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      impact: 'High-performance e-commerce prototype ready for any backend',
    },
    {
      title: 'YOMU',
      category: 'Digital Library System',
      tech: ['React', 'NestJS', 'PostgreSQL', 'Prisma', 'WebSocket'],
      impact: 'Real-time chat, auto-fines via cron, optimized N+1 queries',
    },
  ],
  labExperiments: [
    'Cross-Window Portal — multi-window sync via BroadcastChannel',
    'Sentient UI — self-mutating UI based on user heatmaps',
    'Adaptive Survivor — hardware-aware UI that saves battery',
    'Neural Gesture — hand tracking interface via MediaPipe',
    'Chaos Desktop — physics-based window manager',
    'Kinetic Typography — GPU-accelerated text effects',
    'Magnetic Grid — cursor-reactive grid system',
    'Cymatic Geometry — audio-reactive particle visualizer',
    'Code Cosmos — 3D codebase visualizer',
  ],
  sections: ['Projects', 'Lab Experiments', 'Tech Stack', 'Contact'],
};

export function buildGuidePrompt(message: string): string {
  return `CONTEXT: User is on the portfolio homepage.

AVAILABLE SECTIONS:
${PORTFOLIO_DATA.sections.map(s => `- ${s}`).join('\n')}

PROJECTS:
${PORTFOLIO_DATA.projects.map(p => `- **${p.title}** (${p.category}) — Impact: ${p.impact}`).join('\n')}

LAB EXPERIMENTS (9 total):
${PORTFOLIO_DATA.labExperiments.map(e => `- ${e}`).join('\n')}

INVOKE TERMINAL:
- A hacker-style terminal overlay built into the portfolio
- Open it with: Ctrl+J shortcut, or click the "Invoke Terminal" button on the hero section
- Available commands: whoami (bio), skills (tech stack), projects (featured work), contact (email & WA), lab (go to lab page), ask <question> (AI-powered Q&A), clear, exit
- It's a fun, interactive way to explore the portfolio like a developer would
- Think of it as a CLI version of this portfolio

Help the user navigate. If they seem interested in visual/interactive work, suggest Lab. If they want real projects, suggest Projects. If they ask about terminal/invoke terminal, explain it clearly with the commands. If unclear, offer the top 2 options.`;
}
