export type VideoType = 'long' | 'short' | 'live';

export interface Comment {
  id: string;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface LiveChatMessage {
  id: string;
  author: string;
  authorAvatar: string;
  authorBadge?: 'owner' | 'mod' | 'member';
  text: string;
  timestamp: string;
  isSuperChat?: boolean;
  superChatAmount?: string;
  superChatColor?: string;
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribers: number;
  isSubscribed: boolean;
  description: string;
  joinedDate: string;
  verified?: boolean;
}

export interface Video {
  id: string;
  type: VideoType;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  views: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  channel: Channel;
  category: string;
  tags: string[];
  comments: Comment[];
  isLive?: boolean;
  liveViewers?: number;
  liveChatMessages?: LiveChatMessage[];
}

export type ActiveTab = 'home' | 'shorts' | 'subscriptions' | 'library' | 'liked' | 'history' | 'channel' | 'watch' | 'live';
