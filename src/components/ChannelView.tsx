import React, { useState } from 'react';
import { Channel, Video } from '../types';
import { useVideo } from '../context/VideoContext';
import { VideoCard } from './VideoCard';
import { Check, Bell, Flame, Film, Info, Calendar, Users, Eye } from 'lucide-react';

interface ChannelViewProps {
  onShare: (video: Video) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({ onShare }) => {
  const { 
    activeChannelId, 
    channels, 
    videos, 
    currentUser, 
    toggleSubscribe,
    setActiveShortIndex,
    setActiveTab,
    addToHistory
  } = useVideo();

  const [activeTabSub, setActiveTabSub] = useState<'videos' | 'shorts' | 'about'>('videos');

  // Find channel
  const channel = channels.find(c => c.id === activeChannelId) || 
    (activeChannelId === currentUser.id ? currentUser : channels[0]);

  // Channel videos
  const channelLongVideos = videos.filter(v => v.channel.id === channel.id && v.type === 'long');
  const channelShorts = videos.filter(v => v.channel.id === channel.id && v.type === 'short');
  const totalViews = [...channelLongVideos, ...channelShorts].reduce((sum, v) => sum + v.views, 0);

  const handleShortClick = (shortId: string) => {
    const shortsList = videos.filter(v => v.type === 'short');
    const idx = shortsList.findIndex(s => s.id === shortId);
    setActiveShortIndex(idx >= 0 ? idx : 0);
    setActiveTab('shorts');
    addToHistory(shortId);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
      {/* Banner */}
      <div className="relative w-full h-36 sm:h-52 md:h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <img 
          src={channel.banner} 
          alt={channel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
      </div>

      {/* Channel Header Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="relative -mt-10 sm:-mt-14 w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-zinc-950 shadow-2xl shrink-0">
            <img 
              src={channel.avatar} 
              alt={channel.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {channel.name}
              </h1>
              {channel.verified && (
                <span className="w-4 h-4 rounded-full bg-zinc-700 text-zinc-200 inline-flex items-center justify-center text-[10px]" title="Verified Channel">
                  ✓
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300">{channel.handle}</span>
              <span>·</span>
              <span>{(channel.subscribers || 0).toLocaleString()} subscribers</span>
              <span>·</span>
              <span>{channelLongVideos.length + channelShorts.length} videos</span>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
              {channel.description}
            </p>
          </div>
        </div>

        {/* Subscribe Button */}
        {channel.id !== currentUser.id && (
          <button
            onClick={() => toggleSubscribe(channel.id)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 ${
              channel.isSubscribed
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-white hover:bg-zinc-200 text-zinc-950'
            }`}
          >
            {channel.isSubscribed ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Subscribed</span>
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 flex items-center gap-8 text-sm font-semibold text-zinc-400">
        <button
          onClick={() => setActiveTabSub('videos')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTabSub === 'videos'
              ? 'border-white text-white'
              : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Videos ({channelLongVideos.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('shorts')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTabSub === 'shorts'
              ? 'border-white text-white'
              : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>Shorts ({channelShorts.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('about')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTabSub === 'about'
              ? 'border-white text-white'
              : 'border-transparent hover:text-zinc-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTabSub === 'videos' && (
        <div>
          {channelLongVideos.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No long videos published yet by this channel.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {channelLongVideos.map(video => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onShare={onShare} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTabSub === 'shorts' && (
        <div>
          {channelShorts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-sm">
              No shorts published yet by this channel.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {channelShorts.map(short => (
                <div
                  key={short.id}
                  onClick={() => handleShortClick(short.id)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img 
                      src={short.thumbnailUrl} 
                      alt={short.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <h4 className="text-xs font-semibold text-white line-clamp-2 drop-shadow">
                        {short.title}
                      </h4>
                      <span className="text-[10px] text-zinc-300 mt-1 font-mono">
                        {short.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTabSub === 'about' && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Description</h3>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {channel.description}
          </p>

          <div className="border-t border-zinc-800 pt-4 space-y-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span>Joined {channel.joinedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-500" />
              <span>{totalViews.toLocaleString()} total views</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              <span>{(channel.subscribers || 0).toLocaleString()} subscribers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
