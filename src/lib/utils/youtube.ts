const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts a YouTube video id from common URL formats:
 * youtube.com/watch?v=, youtu.be/, /embed/, /shorts/, /live/, youtube-nocookie.com.
 * Returns undefined for anything that is not a recognisable YouTube URL.
 */
export function parseYouTubeId(input: string | undefined | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (YOUTUBE_ID.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return undefined;
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let candidate: string | null | undefined;

  if (host === "youtu.be") {
    candidate = url.pathname.split("/")[1];
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      candidate = url.searchParams.get("v");
    } else {
      const [, kind, id] = url.pathname.split("/");
      if (kind && ["embed", "shorts", "live", "v"].includes(kind)) candidate = id;
    }
  }

  return candidate && YOUTUBE_ID.test(candidate) ? candidate : undefined;
}

/** Privacy-enhanced embed URL (no cookies until the viewer plays the video). */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function isValidYouTubeUrl(input: string | undefined | null): boolean {
  return parseYouTubeId(input) !== undefined;
}
