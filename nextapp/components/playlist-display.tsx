import { Card, CardContent } from "@/components/ui/card";

interface Song {
  title: string;
  artist: string;
  note: string;
}

interface PlaylistDisplayProps {
  songs: Song[];
  mood: string;
}

export function PlaylistDisplay({ songs, mood }: PlaylistDisplayProps) {
  return (
    <div className="space-y-6 w-full animate-fade-in">
      <div className="space-y-2">
        <h2 className="font-serif text-xl font-semibold text-foreground text-balance">
          {"Your Curated Playlist"}
        </h2>
        <p className="text-sm text-muted-foreground italic text-pretty">
          {mood}
        </p>
      </div>

      <div className="space-y-4">
        {songs.map((song, index) => (
          <Card
            key={index}
            className="border-border bg-card transition-all hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground text-balance">
                      {song.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {song.artist}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 text-pretty">
                    {song.note}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

