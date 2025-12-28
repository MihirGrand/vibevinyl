// Configuration
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// DOM Elements
const vibeInput = document.getElementById("vibeInput");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.querySelector(".btn-text");
const btnLoader = document.querySelector(".btn-loader");
const errorMessage = document.getElementById("errorMessage");
const playlistSection = document.getElementById("playlistSection");
const playlistContainer = document.getElementById("playlistContainer");
const playlistMood = document.getElementById("playlistMood");
const examplesSection = document.getElementById("examplesSection");
const exampleBtns = document.querySelectorAll(".example-btn");

// Event Listeners
generateBtn.addEventListener("click", () => generatePlaylist(vibeInput.value));
vibeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    generatePlaylist(vibeInput.value);
  }
});

// Example buttons
exampleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const example = btn.dataset.example;
    vibeInput.value = example;
    generatePlaylist(example);
  });
});

// Main function to generate playlist
async function generatePlaylist(mood) {
  const vibe = mood?.trim() || vibeInput.value.trim();

  if (!vibe) {
    showError("Please describe how you're feeling first!");
    return;
  }

  if (API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    showError("Please add your Gemini API key in script.js");
    return;
  }

  setLoading(true);
  hideError();
  playlistSection.style.display = "none";
  examplesSection.style.display = "none";

  try {
    const playlist = await fetchPlaylistFromGemini(vibe);
    displayPlaylist(playlist, vibe);
  } catch (error) {
    showError(error.message || "Failed to generate playlist. Please try again.");
    examplesSection.style.display = "block";
  } finally {
    setLoading(false);
  }
}

// Fetch playlist from Gemini API
async function fetchPlaylistFromGemini(vibe) {
  const prompt = `You are a music curator. Create a 5-song playlist for this mood: "${vibe}"

Return ONLY valid JSON with NO markdown, NO code blocks, NO extra text:

{
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "notes": "Short explanation 2-3 sentences max"
    }
  ]
}

CRITICAL JSON RULES:
- Keep notes SHORT (2-3 sentences, under 200 characters each)
- NO line breaks or newlines in the notes text
- Use \\n for any needed breaks
- Escape all quotes with backslash
- Only straight quotes, no curly quotes
- Make notes concise and punchy
- All 5 songs in one array`;

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "API request failed");
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  // Clean up the response - remove markdown code blocks if present
  let cleanedText = text.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "");
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "");
  }

  // Fix common JSON issues before parsing
  cleanedText = cleanedText
    .replace(/\n/g, ' ')  // Remove all newlines
    .replace(/\r/g, '')   // Remove carriage returns
    .replace(/\t/g, ' ')  // Replace tabs with spaces
    .replace(/\\'/g, "'") // Fix escaped single quotes (not valid JSON)
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  // Try to parse JSON, with better error handling
  let playlist;
  try {
    playlist = JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("Failed to parse JSON:", cleanedText);
    console.error("Parse error:", parseError);
    
    // Try to fix truncated JSON
    if (cleanedText.includes('"songs"') && !cleanedText.endsWith('}')) {
      cleanedText += '"}]}';
      try {
        playlist = JSON.parse(cleanedText);
      } catch (e) {
        throw new Error("The AI response was incomplete. Please try again.");
      }
    } else {
      throw new Error("Failed to parse playlist response. Please try again.");
    }
  }

  if (!playlist.songs || !Array.isArray(playlist.songs) || playlist.songs.length === 0) {
    throw new Error("Invalid playlist format received");
  }

  return playlist.songs;
}

// Display the playlist
function displayPlaylist(songs, mood) {
  playlistContainer.innerHTML = "";
  playlistMood.textContent = mood;
  
  // Enable side-by-side layout
  document.querySelector('.main-layout').classList.add('has-playlist');
  document.querySelector('.container').classList.add('expanded');

  songs.forEach((song, index) => {
    const songCard = document.createElement("div");
    songCard.className = "song-card";
    songCard.style.animationDelay = `${index * 0.1}s`;

    songCard.innerHTML = `
      <div class="song-card-content">
        <div class="song-number">${index + 1}</div>
        <div class="song-details">
          <div class="song-info">
            <h3 class="song-title">${escapeHtml(song.title)}</h3>
            <p class="song-artist">${escapeHtml(song.artist)}</p>
          </div>
          <p class="song-notes">${escapeHtml(song.notes || song.note)}</p>
        </div>
      </div>
    `;

    playlistContainer.appendChild(songCard);
  });

  playlistSection.style.display = "block";
  playlistSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// UI Helper Functions
function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  btnText.style.display = isLoading ? "none" : "inline";
  btnLoader.style.display = isLoading ? "inline" : "none";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError() {
  errorMessage.style.display = "none";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
