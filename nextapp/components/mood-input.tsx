"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

interface MoodInputProps {
  onSubmit: (mood: string) => Promise<void>
  isLoading: boolean
}

export function MoodInput({ onSubmit, isLoading }: MoodInputProps) {
  const [mood, setMood] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mood.trim() && !isLoading) {
      await onSubmit(mood)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <label htmlFor="mood" className="text-sm font-medium text-foreground">
          {"Describe your vibe"}
        </label>
        <Textarea
          id="mood"
          placeholder="I'm sitting in a coffee shop on a rainy Tuesday and feeling a bit nostalgic..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="min-h-[120px] resize-none bg-card text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!mood.trim() || isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            {"Curating your playlist..."}
          </span>
        ) : (
          "Generate Playlist"
        )}
      </Button>
    </form>
  )
}
