import React, { useState } from 'react';
import { Video } from '../types';
import { useVideo } from '../context/VideoContext';
import { Clock, Check, Share2, MoreVertical } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onShare?: (video: Video) => void;
  layout?: 'grid' | 'list';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onShare, layout = 'grid' }) => {
  const { 
    setActiveVideoId, 
    setActiveTab, 
    addToHistory, 
    setActiveChannelId,
    watchLaterIds,
    toggleSaveWatchLater,
    setActiveShortIndex,
    videos
  } = useVideo();

  const [isHovered, setIsHovered] = useState(false);
  const isSaved = watchLaterIds.includes(video.id);

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleCardClick = () => {
    if (video.type === 'live' || video.isLive) {
      setActiveVideoId(video.id);
      setActiveTab('live');
      addToHistory(video.id);
    } else if (video.type === 'short') {
      // Find index in shorts list
      const shortsList = videos.filter(v => v.type === 'short');
      const idx = shortsList.findIndex(s => s.id === video.id);
      setActiveShortIndex(idx >= 0 ? idx : 0);
      setActiveTab('shorts');
      addToHistory(video.id);
    } else {
      setActiveVideoId(video.id);
      setActiveTab('watch');
      addToHistory(video.id);
    }
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveChannelId(video.channel.id);
    setActiveTab('channel');
    setActiveVideoId(null);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 group cursor-pointer p-2 rounded-xl hover:bg-zinc-900/60 transition-colors"
      >
        <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-zinc-900 shrink-0">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {video.isLive ? (
            <span className="absolute bottom-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              LIVE
            </span>
          ) : (
            <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-zinc-100 text-[11px] font-medium font-mono px-1.5 py-0.5 rounded tabular-nums">
              {video.duration}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-100 line-clamp-2 group-hover:text-white leading-snug">
              {video.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1.5">
              {video.isLive ? (
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {formatViews(video.liveViewers || 1200)} watching now
                </span>
              ) : (
                <span>{formatViews(video.views)} views</span>
              )}
              <span>·</span>
              <span>{video.createdAt}</span>
            </div>
            <div 
              onClick={handleChannelClick}
              className="flex items-center gap-2 mt-2 hover:text-white group/ch w-fit"
            >
              <img 
                src={video.channel.avatar} 
                alt={video.channel.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover" 
              />
              <span className="text-xs text-zinc-400 group-hover/ch:text-zinc-200">
                {video.channel.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-3 border border-zinc-800/40">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Duration / LIVE badge */}
        {video.isLive ? (
          <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 bg-black/85 text-zinc-100 text-[11px] font-medium font-mono px-1.5 py-0.5 rounded-md tabular-nums backdrop-blur-xs">
            {video.duration}
          </span>
        )}

        {/* Quick Action Overlay on hover */}
        {isHovered && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 transition-opacity duration-150">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveWatchLater(video.id);
              }}
              className={`p-1.5 rounded-md backdrop-blur-md shadow-md text-white transition-colors ${
                isSaved ? 'bg-blue-600' : 'bg-black/75 hover:bg-black/90'
              }`}
              title={isSaved ? 'Saved to Watch Later' : 'Watch Later'}
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(video);
                }}
                className="p-1.5 rounded-md bg-black/75 hover:bg-black/90 backdrop-blur-md text-white transition-colors shadow-md"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="flex gap-3 items-start px-0.5">
        <div 
          onClick={handleChannelClick}
          className="shrink-0 mt-0.5 hover:opacity-85 transition-opacity"
          title={video.channel.name}
        >
          <img 
            src={video.channel.avatar} 
            alt={video.channel.name}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-zinc-800" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
            {video.title}
          </h3>

          <div 
            onClick={handleChannelClick}
            className="text-xs text-zinc-400 hover:text-zinc-200 mt-1 truncate flex items-center gap-1 w-fit"
          >
            <span>{video.channel.name}</span>
            {video.channel.verified && (
              <span className="w-3.5 h-3.5 rounded-full bg-zinc-700 text-zinc-300 inline-flex items-center justify-center text-[9px]">
                ✓
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
            {video.isLive ? (
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {formatViews(video.liveViewers || 1200)} watching now
              </span>
            ) : (
              <span>{formatViews(video.views)} views</span>
            )}
            <span>·</span>
            <span>{video.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
