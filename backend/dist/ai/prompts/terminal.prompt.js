"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTerminalPrompt = buildTerminalPrompt;
function buildTerminalPrompt(message) {
    return `CONTEXT: User is interacting via the portfolio's Terminal Overlay (hacker-style CLI).

INSTRUCTIONS:
- Respond like a terminal-based AI assistant.
- Be technical, concise, and slightly playful.
- Use mono-spaced style references if needed.
- If the user asks about commands, mention: whoami, skills, projects, contact, lab, ask, clear, exit.
- Keep the response short (max 2-3 sentences).

User typed: "${message}"`;
}
//# sourceMappingURL=terminal.prompt.js.map