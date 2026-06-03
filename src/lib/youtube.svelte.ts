declare const __BUILD_DATA__: {
  youtube: {
    channels: { channel: YouTubeChannel; videos: YouTubeVideo[] }[];
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

export interface YouTubeChannelState {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  randomVideo: YouTubeVideo | null;
}

const buildData = __BUILD_DATA__.youtube;

// Pick a random video per channel at runtime for variety
export const youtubeChannels = $state<YouTubeChannelState[]>(
  buildData.channels.map(({ channel, videos }) => ({
    channel,
    videos,
    randomVideo: videos.length > 0
      ? videos[Math.floor(Math.random() * videos.length)]
      : null,
  })),
);
