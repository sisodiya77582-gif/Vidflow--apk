/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VideoProvider, useVideo } from './context/VideoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoCard } from './components/VideoCard';
import { VideoPlayer } from './components/VideoPlayer';
import { ShortsFeed } from './components/ShortsFeed';
import { UploadModal } from './components/UploadModal';
import { GoLiveModal } from './components/GoLiveModal';
import { LivePlayer } from './components/LivePlayer';
import { ChannelView } from './components/ChannelView';
import { ShareModal } from './components/ShareModal';
import { Video } from './types';
import { 
  Flame, 
  Sparkles, 
  TvMinimalPlay, 
  History as HistoryIcon, 
  ThumbsUp, 
  Clock, 
  Search, 
  Plus, 
  Video as VideoIcon, 
  Film,
  ArrowRight,
  Radio,
  Users
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Live 🔴',
  'Technology',
  'Travel',
  'Cooking',
  'Gaming',
  'Entertainment',
  'Tutorials',
  'Hindi Tech',
  'Shorts'
];

const MainContent: React.FC = () => {
  const { 
    videos, 
    activeTab, 
    setActiveTab, 
    activeVideoId, 
    activeChannelId, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory,
    watchHistory,
    watchLaterIds,
    setIsUploadModalOpen,
    setIsGoLiveModalOpen,
    setActiveShortIndex,
    channels,
    addToHistory
  } = useVideo();

  const [shareTargetVideo, setShareTargetVideo] = useState<Video | null>(null);

  // Filtered videos based on search and category
  const filteredVideos = videos.filter(v => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchChannel = v.channel.name.toLowerCase().includes(q);
      const matchTag = v.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchChannel && !matchTag) return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Shorts') return v.type === 'short';
      if (selectedCategory === 'Live 🔴') return v.type === 'live' || v.isLive;
      if (selectedCategory === 'Hindi Tech') {
        return v.category === 'Technology' || v.tags.some(t => t.toLowerCase().includes('hindi'));
      }
      return v.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    return true;
  });

  const liveVideos = videos.filter(v => v.type === 'live' || v.isLive);
  const longVideos = filteredVideos.filter(v => v.type === 'long');
  const shortsVideos = videos.filter(v => v.type === 'short');
  const activeVideo = videos.find(v => v.id === activeVideoId);

  // Render Watch view
  if (activeTab === 'watch' && activeVideo) {
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 pb-16 md:pb-6">
        <VideoPlayer 
          video={activeVideo} 
          onShare={(v) => setShareTargetVideo(v)} 
        />
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Live Player View
  if (activeTab === 'live') {
    if (activeVideo && (activeVideo.type === 'live' || activeVideo.isLive)) {
      return (
        <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 pb-16 md:pb-6">
          <LivePlayer 
            video={activeVideo} 
            onShare={(v) => setShareTargetVideo(v)} 
          />
          <ShareModal 
            video={shareTargetVideo} 
            onClose={() => setShareTargetVideo(null)} 
          />
        </main>
      );
    }

    // Live Streams Hub
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 pb-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>Live Streams Hub</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  🔴 LIVE
                </span>
              </h1>
              <p className="text-xs text-zinc-400">
                Real-time broadcasts happening right now with active live chat
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoLiveModalOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Go Live (Live Shuru Karein)</span>
          </button>
        </div>

        {liveVideos.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">No active live streams right now</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Be the first to go live! Start a webcam or virtual live stream with your audience.
            </p>
            <button
              onClick={() => setIsGoLiveModalOpen(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold"
            >
              Start Live Stream
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onShare={(v) => setShareTargetVideo(v)} 
              />
            ))}
          </div>
        )}

        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Shorts View
  if (activeTab === 'shorts') {
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 pb-16 md:pb-0">
        <ShortsFeed onShare={(v) => setShareTargetVideo(v)} />
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Channel View
  if (activeTab === 'channel' && activeChannelId) {
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 pb-16 md:pb-6">
        <ChannelView onShare={(v) => setShareTargetVideo(v)} />
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Subscriptions Feed
  if (activeTab === 'subscriptions') {
    const subscribedChannelIds = channels.filter(c => c.isSubscribed).map(c => c.id);
    const subVideos = videos.filter(v => subscribedChannelIds.includes(v.channel.id));

    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 pb-20 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <TvMinimalPlay className="w-5 h-5 text-red-500" />
            <h1 className="text-xl font-bold">Subscriptions Feed</h1>
          </div>
          <span className="text-xs text-zinc-400">
            {subVideos.length} videos from your subscribed channels
          </span>
        </div>

        {subVideos.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <TvMinimalPlay className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">Don't miss new videos</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Subscribe to your favorite channels to see their latest videos and shorts here.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-semibold"
            >
              Discover Channels on Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onShare={(v) => setShareTargetVideo(v)} 
              />
            ))}
          </div>
        )}
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render History
  if (activeTab === 'history') {
    const historyVideos = watchHistory
      .map(id => videos.find(v => v.id === id))
      .filter((v): v is Video => !!v);

    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 pb-20 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-bold">Watch History</h1>
          </div>
          <span className="text-xs text-zinc-400">{historyVideos.length} videos</span>
        </div>

        {historyVideos.length === 0 ? (
          <p className="text-sm text-zinc-500 py-12 text-center">No watch history yet.</p>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {historyVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                layout="list"
                onShare={(v) => setShareTargetVideo(v)} 
              />
            ))}
          </div>
        )}
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Liked Videos
  if (activeTab === 'liked') {
    const likedVideos = videos.filter(v => v.isLiked);

    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 pb-20 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-red-500 fill-red-500" />
            <h1 className="text-xl font-bold">Liked Videos</h1>
          </div>
          <span className="text-xs text-zinc-400">{likedVideos.length} videos</span>
        </div>

        {likedVideos.length === 0 ? (
          <p className="text-sm text-zinc-500 py-12 text-center">No liked videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {likedVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onShare={(v) => setShareTargetVideo(v)} 
              />
            ))}
          </div>
        )}
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Render Watch Later
  if (activeTab === 'library') {
    const savedVideos = videos.filter(v => watchLaterIds.includes(v.id));

    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 p-4 md:p-6 pb-20 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold">Watch Later</h1>
          </div>
          <span className="text-xs text-zinc-400">{savedVideos.length} videos</span>
        </div>

        {savedVideos.length === 0 ? (
          <p className="text-sm text-zinc-500 py-12 text-center">No videos saved to Watch Later.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedVideos.map(video => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onShare={(v) => setShareTargetVideo(v)} 
              />
            ))}
          </div>
        )}
        <ShareModal 
          video={shareTargetVideo} 
          onClose={() => setShareTargetVideo(null)} 
        />
      </main>
    );
  }

  // Default: HOME Feed
  return (
    <main className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 pb-20">
      {/* Category Filter Horizontal Pills */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-md px-4 py-3 border-b border-zinc-900/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === category
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 space-y-8 max-w-[1800px] mx-auto">
        {/* Search header indicator if searching */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Results for "<span className="text-white font-semibold">{searchQuery}</span>"</span>
            </div>
            <span className="text-xs text-zinc-500">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>
        )}

        {/* Live Shelf on Home feed if live broadcasts exist */}
        {!searchQuery && selectedCategory === 'All' && liveVideos.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Live Now</span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-md">
                    LIVE
                  </span>
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveTab('live');
                }}
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 group"
              >
                <span>View all Live</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {liveVideos.map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onShare={(v) => setShareTargetVideo(v)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Home Shorts Shelf (YouTube Authentic Shorts Reel) */}
        {!searchQuery && selectedCategory === 'All' && shortsVideos.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Shorts
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveShortIndex(0);
                  setActiveTab('shorts');
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {shortsVideos.map((short, idx) => (
                <div
                  key={short.id}
                  onClick={() => {
                    setActiveShortIndex(idx);
                    setActiveTab('shorts');
                    addToHistory(short.id);
                  }}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md">
                    <img 
                      src={short.thumbnailUrl} 
                      alt={short.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug drop-shadow">
                        {short.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-300 font-mono">
                        <span>{short.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Long Videos Grid */}
        <div className="space-y-4">
          {!searchQuery && selectedCategory === 'All' && (
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" />
                <span>Recommended Videos</span>
              </h2>
              <span className="text-xs text-zinc-500">Updated today</span>
            </div>
          )}

          {longVideos.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm text-zinc-400">No videos found matching your selection.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-4">
              {longVideos.map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onShare={(v) => setShareTargetVideo(v)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Creator Banner / Callout for uploading or going live */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <span>Go Live ya Video Upload Karein (Creator Studio)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Webcam ya software se real-time Live streaming shuru karein, viewers ke sath live chat karein aur Super Chats receive karein!
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsGoLiveModalOpen(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Go Live Now</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-full border border-zinc-700 active:scale-95 transition-all"
            >
              Upload Video
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        video={shareTargetVideo} 
        onClose={() => setShareTargetVideo(null)} 
      />
    </main>
  );
};

export default function App() {
  return (
    <VideoProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <UploadModal />
        <GoLiveModal />
      </div>
    </VideoProvider>
  );
}
