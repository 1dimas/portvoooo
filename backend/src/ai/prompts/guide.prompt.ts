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
  experience: [
    'Freelance Full Stack Developer (2023-now) — Company Profile, SportZone, YOMU',
    'Full Stack Developer intern at Bangun Kreatif Abadi (2024) — built a complete e-commerce platform with Midtrans payment gateway using Next.js + NestJS. It was a PKL project and was never released to production; do not claim it is live.',
    'OSIS Sekbid 4 (2024-2025) — student council, academic & non-academic achievement development',
    'Senior Developer at Solit03 (Jul-Sep 2026), a second-hand laptop retail & repair business. Worked AS PART OF A TEAM developing and maintaining a 14-module internal ERP used by 80 staff across 35 access roles. His own specific contributions: integrating a DeepSeek-powered AI assistant over operational data, leading the Supabase-to-self-hosted-PostgreSQL migration, and setting up/running the Linux mini-server. IMPORTANT: never say he single-handedly built the whole ERP or all 14 modules - it was team work. He also built the public company profile website solit03.com. IMPORTANT: the ERP itself is an internal system - never claim a public demo, repo, or screenshots of the ERP exist. The public site solit03.com is a separate, publicly visitable piece of his work.',
  ],
  sections: ['Projects', 'Experience', 'Certificates', 'Lab Experiments', 'Tech Stack', 'Contact'],
};

export function buildGuidePrompt(message: string): string {
  return `CONTEXT: User is on the portfolio homepage.

AVAILABLE SECTIONS:
${PORTFOLIO_DATA.sections.map(s => `- ${s}`).join('\n')}

EXPERIENCE:
${PORTFOLIO_DATA.experience.map(e => `- ${e}`).join('\n')}

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
