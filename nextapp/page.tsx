"use client";

import { useState } from "react";
import { VinylLogo } from "@/components/vinyl-logo";
import { MoodInput } from "@/components/mood-input";
import { PlaylistDisplay } from "@/components/playlist-display";
import { useToast } from "@/hooks/use-toast";
import { generatePlaylist } from "@/app/actions/generate-playlist";

interface Song {
  title: string;
  artist: string;
  note: string;
}

interface Playlist {
  playlist: Song[];
}

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlaylist = async (mood: string) => {
    setIsLoading(true);
    setCurrentMood(mood);
    setPlaylist(null);

    try {
      const result = await generatePlaylist(mood);
      if (result && result.playlist) {
        setPlaylist(result);
      } else {
        throw new Error("Failed to generate playlist. The AI response might be invalid.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <VinylLogo />
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
              {
                "Tell us exactly how you're feeling right now, and we'll curate a 5-song playlist with liner notes explaining why each track captures your vibe."
              }
            </p>
          </div>

          <div className="flex flex-col items-center gap-12">
            <MoodInput onSubmit={handleGeneratePlaylist} isLoading={isLoading} />

            {playlist && <PlaylistDisplay songs={playlist.playlist} mood={currentMood} />}
          </div>

          {!playlist && (
            <div className="text-center space-y-6 pt-8">
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-foreground">{"Try these vibes:"}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Early morning coffee, watching the sunrise",
                    "Late night coding session, focused energy",
                    "Sunday afternoon, lazy and content",
                    "Driving through the city at golden hour",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => handleGeneratePlaylist(example)}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-pretty"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
