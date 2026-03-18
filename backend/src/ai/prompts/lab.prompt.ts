/**
 * Lab prompt — explains experiments with real data context.
 */
export function buildLabPrompt(
  message: string,
  metadata?: Record<string, unknown>,
): string {
  // If metadata contains experiment info, inject it
  const experimentContext = metadata
    ? `
EXPERIMENT DETAILS:
- Title: ${metadata.title || 'Unknown'}
- Description: ${metadata.description || 'N/A'}
- Tech: ${(metadata.tech as string[])?.join(', ') || 'N/A'}
- Use Cases: ${(metadata.useCase as string[])?.join(', ') || 'N/A'}
- Impact: ${(metadata.impact as string[])?.join(', ') || 'N/A'}
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
