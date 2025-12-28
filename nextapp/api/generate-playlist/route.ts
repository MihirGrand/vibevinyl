import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const playlistSchema = z.object({
  songs: z
    .array(
      z.object({
        title: z.string().describe("The song title"),
        artist: z.string().describe("The artist name"),
        linerNotes: z.string().describe("2-3 sentences explaining why this song fits the vibe"),
      }),
    )
    .length(5),
})

export async function POST(req: Request) {
  try {
    const { mood } = await req.json()

    if (!mood || mood.trim().length === 0) {
      return Response.json({ error: "Please provide a mood or vibe description" }, { status: 400 })
    }

    const { object: playlist } = await generateObject({
      model: google("gemini-1.5-pro-latest", {
        apiKey: process.env.GOOGLE_API_KEY,
      }),
      schema: playlistSchema,
      prompt: `You are a expert music curator with deep knowledge of all genres and eras. A user has described their current mood/vibe as: "${mood}"

Generate a carefully curated playlist of exactly 5 songs that perfectly match this specific vibe. 

For each song, provide:
1. The song title
2. The artist name  
3. Liner notes (2-3 sentences) that explain why this particular song captures the essence of their described mood

Be specific and thoughtful. Consider tempo, lyrics, instrumentation, and emotional resonance. Mix well-known classics with deeper cuts when appropriate. Make each selection intentional and meaningful to the exact vibe they described.`,
    })

    return Response.json(playlist)
  } catch (error) {
    console.error("Error generating playlist:", error)
    return Response.json({ error: "Failed to generate playlist. Please try again." }, { status: 500 })
  }
}
