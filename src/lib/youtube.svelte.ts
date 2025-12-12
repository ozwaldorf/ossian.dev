declare const __BUILD_DATA__: {
  youtube: {
    channel: YouTubeChannel | null;
    videos: YouTubeVideo[];
  };
};

export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

export interface YouTubeChannel {
  name: string;
  description: string;
  url: string;
  avatar: string;
}

export interface YouTubeState {
  channel: YouTubeChannel | null;
  videos: YouTubeVideo[];
  randomVideo: YouTubeVideo | null;
  loading: boolean;
  error: string | null;
}

const buildData = __BUILD_DATA__.youtube;

// Pick a random video at runtime for variety
const randomVideo = buildData.videos.length > 0
  ? buildData.videos[Math.floor(Math.random() * buildData.videos.length)]
  : null;

export const youtubeState = $state<YouTubeState>({
  channel: buildData.channel,
  videos: buildData.videos,
  randomVideo,
  loading: false,
  error: null,
});
