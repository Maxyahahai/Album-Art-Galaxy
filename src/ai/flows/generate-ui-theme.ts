'use server';

/**
 * @fileOverview Generates UI themes based on the dominant colors of album art.
 *
 * - generateUiTheme - A function that generates a UI theme based on album art.
 * - GenerateUiThemeInput - The input type for the generateUiTheme function.
 * - GenerateUiThemeOutput - The return type for the generateUiTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUiThemeInputSchema = z.object({
  albumArtDataUri: z
    .string()
    .describe(
      'The album art as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});

export type GenerateUiThemeInput = z.infer<typeof GenerateUiThemeInputSchema>;

const GenerateUiThemeOutputSchema = z.object({
  primaryColor: z.string().describe('The primary color for the UI theme.'),
  backgroundColor: z.string().describe('The background color for the UI theme.'),
  accentColor: z.string().describe('The accent color for the UI theme.'),
});

export type GenerateUiThemeOutput = z.infer<typeof GenerateUiThemeOutputSchema>;

export async function generateUiTheme(input: GenerateUiThemeInput): Promise<GenerateUiThemeOutput> {
  return generateUiThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUiThemePrompt',
  input: {schema: GenerateUiThemeInputSchema},
  output: {schema: GenerateUiThemeOutputSchema},
  prompt: `You are an expert UI theme generator. You will receive an album art image and will generate a UI theme consisting of a primary color, background color, and accent color. Respond with hex codes only, and make sure they are visually distinct.

Album Art: {{media url=albumArtDataUri}}

Output (JSON):`,
});

const generateUiThemeFlow = ai.defineFlow(
  {
    name: 'generateUiThemeFlow',
    inputSchema: GenerateUiThemeInputSchema,
    outputSchema: GenerateUiThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
