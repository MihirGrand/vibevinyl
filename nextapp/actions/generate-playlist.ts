"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generatePlaylist(vibe: string) {
  const { text } = await generateText({
    model: google("models/gemini-pro"),
    system:
      "You are VibeVinyl, a music curator that creates hyper-specific 5-song playlists based on a user's mood or setting. For each song, provide the title, artist, and a brief 'liner note' (1-2 sentences) explaining why it fits. Return the data in a clear JSON structure: { playlist: [{ title: string, artist: string, note: string }] }",
    prompt: `The user's current vibe is: "${vibe}". Generate a 5-song playlist for them.`,
  });

  console.log("Raw AI Response:", text);

  try {
    // Attempt to parse JSON from the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // The response might be wrapped in ```json ... ```, so we need to clean it
      const cleanedJson = jsonMatch[0].replace(/```json\n/, "").replace(/\n```/, "");
      return JSON.parse(cleanedJson);
    }
    return null;
  } catch (e) {
    console.error("[v0] Error parsing AI response:", e);
    return null;
  }
}

