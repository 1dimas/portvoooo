"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLabPrompt = buildLabPrompt;
function buildLabPrompt(message, metadata) {
    const experimentContext = metadata
        ? `
EXPERIMENT DETAILS:
- Title: ${metadata.title || 'Unknown'}
- Description: ${metadata.description || 'N/A'}
- Tech: ${metadata.tech?.join(', ') || 'N/A'}
- Use Cases: ${metadata.useCase?.join(', ') || 'N/A'}
- Impact: ${metadata.impact?.join(', ') || 'N/A'}
`
        : '';
    return `CONTEXT: User is viewing the Lab experiments page.
${experimentContext}
Explain this experiment clearly. Focus on:
1. What it actually does (in simple terms)
2. Why it matters / real-world application
3. What makes it technically impressive

Be enthusiastic but concise. Make the user want to try it.`;
}
//# sourceMappingURL=lab.prompt.js.map