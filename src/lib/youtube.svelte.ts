export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  published: string;
  thumbnail: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  description: string;
  url: string;
  avatar: string;
  subscriberCount: number;
  videoCount: number;
}

export interface YouTubeState {
  channel: YouTubeChannel | null;
  videos: YouTubeVideo[];
  randomVideo: YouTubeVideo | null;
  loading: boolean;
  error: string | null;
}

export const youtubeState = $state<YouTubeState>({
  channel: null,
  videos: [],
  randomVideo: null,
  loading: true,
  error: null,
});

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const API_BASE = "https://www.googleapis.com/youtube/v3";

export async function fetchYouTubeChannel(channelId: string, handle: string) {
  youtubeState.loading = true;
  youtubeState.error = null;

  if (!API_KEY) {
    youtubeState.error = "YouTube API key not configured";
    youtubeState.loading = false;
    return;
  }

  try {
    // Fetch channel info and uploads playlist ID
    const channelUrl = `${API_BASE}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${API_KEY}`;
    const channelResponse = await fetch(channelUrl);

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status}`);
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Get the uploads playlist ID
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    youtubeState.channel = {
      id: channelId,
      name: channel.snippet.title,
      description: channel.snippet.description,
      url: `https://www.youtube.com/@${handle}`,
      avatar: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
    };

    // Fetch recent videos from uploads playlist
    if (uploadsPlaylistId) {
      const videosUrl = `${API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=15&key=${API_KEY}`;
      const videosResponse = await fetch(videosUrl);

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        const videos: YouTubeVideo[] = (videosData.items || []).map(
          (item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description?.slice(0, 200) +
              (item.snippet.description?.length > 200 ? "..." : ""),
            published: item.snippet.publishedAt,
            thumbnail:
              item.snippet.thumbnails?.maxres?.url ||
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              `https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
          }),
        );

        youtubeState.videos = videos;

        // Pick a random video
        if (videos.length > 0) {
          const randomIndex = Math.floor(Math.random() * videos.length);
          youtubeState.randomVideo = videos[randomIndex];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch YouTube channel:", error);
    youtubeState.error = error instanceof Error
      ? error.message
      : "Failed to load YouTube data";
  } finally {
    youtubeState.loading = false;
  }
}
