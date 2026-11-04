import type { VideoEmbed } from "@/domain/content";
import { youTubeEmbedUrl } from "@/lib/utils/youtube";

export function YouTubeEmbed({ video }: { video: VideoEmbed }) {
  if (!video.youtubeId) return null;
  const title = video.title || "YouTube video";
  return (
    <figure className="space-y-2">
      <div className="aspect-video overflow-hidden rounded-lg bg-surface">
        <iframe
          src={youTubeEmbedUrl(video.youtubeId)}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {video.title && <figcaption className="text-sm text-muted">{video.title}</figcaption>}
    </figure>
  );
}

export function VideoList({ videos }: { videos: VideoEmbed[] }) {
  const playable = videos.filter((v) => v.youtubeId);
  if (playable.length === 0) return null;
  return (
    <section aria-label="Videos" className="space-y-4">
      <h2 className="text-xl font-semibold">Videos</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {playable.map((video) => (
          <YouTubeEmbed key={video.youtubeId} video={video} />
        ))}
      </div>
    </section>
  );
}
