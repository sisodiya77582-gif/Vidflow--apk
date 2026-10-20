import React, { createContext, useContext, useState, useEffect } from 'react';
import { Channel, Comment, Video, VideoType, ActiveTab } from '../types';
import { INITIAL_CHANNELS, INITIAL_VIDEOS, CURRENT_USER } from '../data/initialData';

interface UploadVideoPayload {
  type: VideoType;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  category: string;
  tags?: string[];
}

export interface StartLivePayload {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  streamUrl?: string;
  cameraStream?: MediaStream | null;
}

interface VideoContextType {
  videos: Video[];
  channels: Channel[];
  currentUser: Channel;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isGoLiveModalOpen: boolean;
  setIsGoLiveModalOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSubscribe: (channelId: string) => void;
  toggleLike: (videoId: string) => void;
  toggleDislike: (videoId: string) => void;
  toggleSaveWatchLater: (videoId: string) => void;
  addComment: (videoId: string, text: string) => void;
  addReply: (videoId: string, parentCommentId: string, text: string) => void;
  likeComment: (videoId: string, commentId: string) => void;
  addLiveChatMessage: (videoId: string, text: string, isSuperChat?: boolean, amount?: string) => void;
  startLiveStream: (payload: StartLivePayload) => string;
  endLiveStream: (videoId: string) => void;
  uploadVideo: (payload: UploadVideoPayload) => void;
  watchHistory: string[];
  addToHistory: (videoId: string) => void;
  watchLaterIds: string[];
  currentWatchVideo: Video | null;
  activeShortIndex: number;
  setActiveShortIndex: (idx: number | ((prev: number) => number)) => void;
  activeLiveStream: MediaStream | null;
  setActiveLiveStream: (stream: MediaStream | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const STORAGE_KEY_VIDEOS = 'vidflow_videos_v1';
const STORAGE_KEY_CHANNELS = 'vidflow_channels_v1';
const STORAGE_KEY_HISTORY = 'vidflow_history_v1';
const STORAGE_KEY_WATCHLATER = 'vidflow_watchlater_v1';

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_VIDEOS;
  });

  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CHANNELS;
  });

  const [currentUser] = useState<Channel>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeShortIndex, setActiveShortIndex] = useState<number>(0);
  const [activeLiveStream, setActiveLiveStream] = useState<MediaStream | null>(null);

  const [watchHistory, setWatchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['vid-1'];
  });

  const [watchLaterIds, setWatchLaterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLATER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
    } catch (e) {
      console.warn('Could not save videos to localStorage', e);
    }
  }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.warn('Could not save channels to localStorage', e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [watchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLATER, JSON.stringify(watchLaterIds));
    } catch (e) {
      console.warn('Could not save watchLater to localStorage', e);
    }
  }, [watchLaterIds]);

  const addToHistory = (videoId: string) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(id => id !== videoId);
      return [videoId, ...filtered];
    });

    // Also increment view count
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, views: v.views + 1 } : v))
    );
  };

  const toggleSubscribe = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === channelId) {
          const newStatus = !ch.isSubscribed;
          return {
            ...ch,
            isSubscribed: newStatus,
            subscribers: newStatus ? ch.subscribers + 1 : Math.max(0, ch.subscribers - 1),
          };
        }
        return ch;
      })
    );

    // Also synchronize inside all videos
    setVideos(prev =>
      prev.map(v => {
        if (v.channel.id === channelId) {
          const newStatus = !v.channel.isSubscribed;
          return {
            ...v,
            channel: {
              ...v.channel,
              isSubscribed: newStatus,
              subscribers: newStatus ? v.channel.subscribers + 1 : Math.max(0, v.channel.subscribers - 1),
            },
          };
        }
        return v;
      })
    );
  };

  const toggleLike = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const wasLiked = !!v.isLiked;
          const wasDisliked = !!v.isDisliked;
          return {
            ...v,
            isLiked: !wasLiked,
            isDisliked: false,
            likes: wasLiked ? v.likes - 1 : v.likes + 1,
            dislikes: wasDisliked ? Math.max(0, v.dislikes - 1) : v.dislikes,
          };
        }
        return v;
      })
    );
  };

  const toggleDislike = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const wasDisliked = !!v.isDisliked;
          const wasLiked = !!v.isLiked;
          return {
            ...v,
            isDisliked: !wasDisliked,
            isLiked: false,
            dislikes: wasDisliked ? v.dislikes - 1 : v.dislikes + 1,
            likes: wasLiked ? Math.max(0, v.likes - 1) : v.likes,
          };
        }
        return v;
      })
    );
  };

  const toggleSaveWatchLater = (videoId: string) => {
    setWatchLaterIds(prev =>
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const addComment = (videoId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Just now',
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: [newComment, ...v.comments],
          };
        }
        return v;
      })
    );
  };

  const addReply = (videoId: string, parentCommentId: string, text: string) => {
    if (!text.trim()) return;
    const newReply: Comment = {
      id: `rep-${Date.now()}`,
      author: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const updatedComments = v.comments.map(c => {
            if (c.id === parentCommentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply],
              };
            }
            return c;
          });
          return { ...v, comments: updatedComments };
        }
        return v;
      })
    );
  };

  const likeComment = (videoId: string, commentId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const updatedComments = v.comments.map(c => {
            if (c.id === commentId) {
              const wasLiked = !!c.isLiked;
              return {
                ...c,
                isLiked: !wasLiked,
                likes: wasLiked ? c.likes - 1 : c.likes + 1,
              };
            }
            // check in replies if any
            if (c.replies && c.replies.length > 0) {
              const updatedReplies = c.replies.map(r => {
                if (r.id === commentId) {
                  const wasLiked = !!r.isLiked;
                  return {
                    ...r,
                    isLiked: !wasLiked,
                    likes: wasLiked ? r.likes - 1 : r.likes + 1,
                  };
                }
                return r;
              });
              return { ...c, replies: updatedReplies };
            }
            return c;
          });
          return { ...v, comments: updatedComments };
        }
        return v;
      })
    );
  };

  const addLiveChatMessage = (videoId: string, text: string, isSuperChat = false, amount = '₹100') => {
    if (!text.trim()) return;
    const newMsg = {
      id: `lcm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBadge: 'owner' as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSuperChat,
      superChatAmount: isSuperChat ? amount : undefined,
      superChatColor: isSuperChat ? 'bg-amber-500' : undefined,
    };

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            liveChatMessages: [...(v.liveChatMessages || []), newMsg],
          };
        }
        return v;
      })
    );
  };

  const startLiveStream = (payload: StartLivePayload): string => {
    const liveId = `live-${Date.now()}`;
    const newLiveVideo: Video = {
      id: liveId,
      type: 'live',
      isLive: true,
      liveViewers: 142,
      title: payload.title,
      description: payload.description || 'Live stream broadcast started with VidFlow Live Studio.',
      videoUrl: payload.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      duration: 'LIVE',
      durationSeconds: 0,
      views: 350,
      likes: 12,
      dislikes: 0,
      isLiked: true,
      createdAt: 'Just started streaming',
      category: payload.category || 'Live',
      tags: payload.tags || ['Live', 'Stream', 'Hindi'],
      channel: currentUser,
      comments: [],
      liveChatMessages: [
        {
          id: `lcm-init-1`,
          author: 'VidFlow Bot',
          authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          authorBadge: 'mod',
          text: '🎉 Stream is now live! Chat rules are active. Welcome viewers!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    if (payload.cameraStream) {
      setActiveLiveStream(payload.cameraStream);
    }

    setVideos(prev => [newLiveVideo, ...prev]);
    setActiveVideoId(liveId);
    setActiveTab('live');
    return liveId;
  };

  const endLiveStream = (videoId: string) => {
    if (activeLiveStream) {
      activeLiveStream.getTracks().forEach(track => track.stop());
      setActiveLiveStream(null);
    }

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            isLive: false,
            duration: '18:40',
            durationSeconds: 1120,
            title: v.title.replace('🔴 LIVE:', '[Stream Replay]'),
          };
        }
        return v;
      })
    );
  };

  const uploadVideo = (payload: UploadVideoPayload) => {
    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      type: payload.type,
      title: payload.title,
      description: payload.description,
      videoUrl: payload.videoUrl,
      thumbnailUrl: payload.thumbnailUrl || (payload.type === 'short' 
        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80'),
      duration: payload.duration || (payload.type === 'short' ? '0:35' : '10:00'),
      durationSeconds: payload.type === 'short' ? 35 : 600,
      views: 1,
      likes: 1,
      dislikes: 0,
      isLiked: true,
      createdAt: 'Just now',
      category: payload.category || 'General',
      tags: payload.tags || ['New', payload.type === 'short' ? 'Shorts' : 'Video'],
      channel: currentUser,
      comments: [],
    };

    setVideos(prev => [newVideo, ...prev]);

    // If it's a short, navigate to shorts; if it's long, navigate to watch
    if (payload.type === 'short') {
      setActiveTab('shorts');
      setActiveShortIndex(0);
    } else {
      setActiveTab('watch');
      setActiveVideoId(newVideo.id);
    }
  };

  const currentWatchVideo = videos.find(v => v.id === activeVideoId) || null;

  return (
    <VideoContext.Provider
      value={{
        videos,
        channels,
        currentUser,
        activeTab,
        setActiveTab,
        activeVideoId,
        setActiveVideoId,
        activeChannelId,
        setActiveChannelId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isGoLiveModalOpen,
        setIsGoLiveModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSubscribe,
        toggleLike,
        toggleDislike,
        toggleSaveWatchLater,
        addComment,
        addReply,
        likeComment,
        addLiveChatMessage,
        startLiveStream,
        endLiveStream,
        uploadVideo,
        watchHistory,
        addToHistory,
        watchLaterIds,
        currentWatchVideo,
        activeShortIndex,
        setActiveShortIndex,
        activeLiveStream,
        setActiveLiveStream,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

