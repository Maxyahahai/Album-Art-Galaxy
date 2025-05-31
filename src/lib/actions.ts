"use server";

import { generateUiTheme } from '@/ai/flows/generate-ui-theme';
import type { GenerateUiThemeOutput } from '@/ai/flows/generate-ui-theme';

// A placeholder Base64 encoded small transparent PNG.
// In a real scenario, this would be the actual album art data URI.
const MOCK_ALBUM_ART_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export async function generateThemeFromArtAction(albumId: string, albumArtUrl: string): Promise<GenerateUiThemeOutput | { error: string }> {
  try {
    // Here, we use a MOCK_ALBUM_ART_DATA_URI because converting remote URLs (like placehold.co)
    // to data URIs on the server can be complex and is outside the scope of this demonstration.
    // The AI flow expects a data URI.
    // console.log(`Generating theme for albumId: ${albumId} with artUrl: ${albumArtUrl}`);
    // console.log(`Using MOCK_ALBUM_ART_DATA_URI for AI processing.`);
    
    const theme = await generateUiTheme({
      albumArtDataUri: MOCK_ALBUM_ART_DATA_URI 
    });
    return theme;
  } catch (error) {
    console.error("Error generating UI theme:", error);
    return { error: "Failed to generate UI theme. Please try again." };
  }
}
