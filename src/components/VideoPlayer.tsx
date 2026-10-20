import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Bell, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw,
  MessageSquare,
  Sparkles,
  Send,
  MoreVertical,
  SlidersHorizontal,
  CornerDownRight
} from 'lucide-react';
import { Video, Comment } from '../types';
import { useVideo } from '../context/VideoContext';
import { VideoCard } from './VideoCard';

interface VideoPlayerProps {
  video: Video;
  onShare: (video: Video) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onShare }) => {
  const { 
    videos, 
    toggleSubscribe, 
    toggleLike, 
    toggleDislike, 
    toggleSaveWatchLater, 
    watchLaterIds,
    addComment,
    addReply,
    likeComment,
    currentUser,
    setActiveChannelId,
    setActiveTab,
    channels
  } = useVideo();

  // Find latest channel data to keep subscription in sync
  const currentChannel = channels.find(c => c.id === video.channel.id) || video.channel;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<'top' | 'newest'>('top');
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const isSaved = watchLaterIds.includes(video.id);

  // Auto-play when video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
    setIsDescriptionExpanded(false);
  }, [video.id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSeekToSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsControlsVisible(false);
    }, 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(video.id, commentText);
    setCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;
    addReply(video.id, commentId, text);
    setReplyText(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  // Clickable timestamp regex parser for description
  const renderFormattedDescription = (text: string) => {
    const lines = text.split('\n');
    const timestampRegex = /(\d{1,2}:\d{2})/g;

    return lines.map((line, lIdx) => {
      const parts = line.split(timestampRegex);
      return (
        <div key={lIdx} className="min-h-[1.25rem]">
          {parts.map((part, pIdx) => {
            if (/^\d{1,2}:\d{2}$/.test(part)) {
              const [minStr, secStr] = part.split(':');
              const secs = parseInt(minStr, 10) * 60 + parseInt(secStr, 10);
              return (
                <button
                  key={pIdx}
                  onClick={() => handleSeekToSeconds(secs)}
                  className="text-blue-400 hover:text-blue-300 font-medium font-mono hover:underline inline-block mr-1"
                >
                  {part}
                </button>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  // Recommended videos (exclude current video)
  const relatedVideos = videos.filter(v => v.id !== video.id && v.type === 'long');

  // Sorted comments
  const sortedComments = [...video.comments].sort((a, b) => {
    if (commentSort === 'top') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="max-w-[1700px] mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Primary Video Column */}
      <div className="lg:col-span-8 space-y-4">
        {/* Custom Video Player Container */}
        <div 
          ref={playerContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl group border border-zinc-800"
        >
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            playsInline
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Big Center Play/Pause button on pause */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer backdrop-blur-[2px]"
            >
              <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Video Control Bar */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 transition-opacity duration-200 ${
              isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Scrubber Slider */}
            <div className="relative flex items-center mb-2 group/scrub">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-700/80 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2.5 transition-all"
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlay} 
                  className="p-1.5 hover:text-red-400 transition-colors"
                  title={isPlaying ? 'Pause (k)' : 'Play (k)'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                {/* Rewind 10s */}
                <button 
                  onClick={() => handleSeekToSeconds(Math.max(0, currentTime - 10))} 
                  className="p-1.5 hover:text-zinc-300 transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol">
                  <button 
                    onClick={toggleMute}
                    className="p-1.5 hover:text-zinc-300 transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                {/* Time Display */}
                <div className="font-mono text-[12px] text-zinc-300 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration || video.durationSeconds)}
                </div>
              </div>

              {/* Right Player Controls */}
              <div className="flex items-center gap-3 relative">
                {/* Speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200"
                  >
                    {playbackSpeed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 w-24 z-50">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-800 flex items-center justify-between ${
                            playbackSpeed === speed ? 'text-red-400 font-bold' : 'text-zinc-300'
                          }`}
                        >
                          <span>{speed}x</span>
                          {playbackSpeed === speed && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:text-zinc-300 transition-colors"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Title (Taital) */}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-zinc-100 leading-snug">
            {video.title}
          </h1>
        </div>

        {/* Channel Info & Video Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-1 border-b border-zinc-800/60 pb-3">
          {/* Creator Channel */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setActiveChannelId(currentChannel.id);
                setActiveTab('channel');
              }}
              className="cursor-pointer"
            >
              <img 
                src={currentChannel.avatar} 
                alt={currentChannel.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-zinc-800 hover:opacity-90 transition-opacity" 
              />
            </div>

            <div>
              <div 
                onClick={() => {
                  setActiveChannelId(currentChannel.id);
                  setActiveTab('channel');
                }}
                className="font-semibold text-sm text-zinc-100 hover:text-white cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentChannel.name}</span>
                {currentChannel.verified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-zinc-700 text-zinc-300 inline-flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {(currentChannel.subscribers || 0).toLocaleString()} subscribers
              </p>
            </div>

            {/* Subscribe / Subscribed Button */}
            <button
              onClick={() => toggleSubscribe(currentChannel.id)}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                currentChannel.isSubscribed
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                  : 'bg-white hover:bg-zinc-200 text-zinc-950 font-bold'
              }`}
            >
              {currentChannel.isSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subscribed</span>
                  <Bell className="w-3.5 h-3.5 ml-1 text-zinc-400" />
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          {/* Action Buttons: Like, Dislike, Share, Save */}
          <div className="flex items-center gap-2">
            {/* Like & Dislike Segmented Pill */}
            <div className="flex items-center bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/60 rounded-full overflow-hidden text-xs text-zinc-200">
              <button
                onClick={() => toggleLike(video.id)}
                className={`flex items-center gap-1.5 px-3 py-2 hover:bg-zinc-700/60 transition-colors ${
                  video.isLiked ? 'text-red-500 font-bold' : ''
                }`}
                title="I like this"
              >
                <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="tabular-nums font-medium">
                  {video.likes.toLocaleString()}
                </span>
              </button>
              <div className="w-[1px] h-4 bg-zinc-700" />
              <button
                onClick={() => toggleDislike(video.id)}
                className={`px-3 py-2 hover:bg-zinc-700/60 transition-colors ${
                  video.isDisliked ? 'text-zinc-100 font-bold' : 'text-zinc-400'
                }`}
                title="I dislike this"
              >
                <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? 'fill-zinc-400' : ''}`} />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={() => onShare(video)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/60 rounded-full text-xs font-semibold text-zinc-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            {/* Save / Watch Later */}
            <button
              onClick={() => toggleSaveWatchLater(video.id)}
              className={`p-2 rounded-full border border-zinc-700/60 transition-colors ${
                isSaved ? 'bg-blue-600/30 border-blue-500 text-blue-400' : 'bg-zinc-800/90 hover:bg-zinc-800 text-zinc-300'
              }`}
              title={isSaved ? 'Saved to Watch Later' : 'Save to Watch Later'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Description Box ("video ke niche description De sake") */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 text-xs md:text-sm text-zinc-200">
          <div className="flex items-center gap-2 font-semibold text-zinc-300 text-xs mb-2">
            <span>{video.views.toLocaleString()} views</span>
            <span>·</span>
            <span>{video.createdAt}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{video.category}</span>
          </div>

          <div className={`space-y-1.5 text-zinc-300 leading-relaxed ${
            isDescriptionExpanded ? '' : 'line-clamp-3'
          }`}>
            {renderFormattedDescription(video.description)}
          </div>

          {video.tags && video.tags.length > 0 && isDescriptionExpanded && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800/60">
              {video.tags.map((tag, idx) => (
                <span key={idx} className="text-blue-400 hover:underline cursor-pointer text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="mt-2 font-bold text-xs text-zinc-100 hover:text-white inline-block"
          >
            {isDescriptionExpanded ? 'Show less' : '...Show more'}
          </button>
        </div>

        {/* Comments Section ("sath hi users comment bhi kar sakein") */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-zinc-100">
                {video.comments.length} Comments
              </h2>
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <button
                  onClick={() => setCommentSort(commentSort === 'top' ? 'newest' : 'top')}
                  className="font-medium hover:text-white"
                >
                  Sort by: <span className="text-zinc-200 font-semibold">{commentSort === 'top' ? 'Top comments' : 'Newest first'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add a Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-3 items-start">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-700" 
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Add a comment... (Comment likhein)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-white text-sm text-zinc-100 placeholder-zinc-500 py-1.5 focus:outline-none transition-colors"
              />
              {commentText.trim() && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCommentText('')}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-sm flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Comment</span>
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {sortedComments.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">
                No comments yet. Be the first to comment on this video!
              </p>
            ) : (
              sortedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3 items-start text-xs sm:text-sm">
                  <img 
                    src={comment.authorAvatar} 
                    alt={comment.author}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-zinc-800" 
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 text-xs">
                        {comment.author}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {comment.createdAt}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {comment.text}
                    </p>

                    {/* Comment Actions: Like & Reply */}
                    <div className="flex items-center gap-3 pt-1 text-zinc-400 text-xs">
                      <button
                        onClick={() => likeComment(video.id, comment.id)}
                        className={`flex items-center gap-1 hover:text-white transition-colors ${
                          comment.isLiked ? 'text-red-400 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-red-400 text-red-400' : ''}`} />
                        <span className="tabular-nums">{comment.likes || 0}</span>
                      </button>

                      <button
                        onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                        className="hover:text-white font-medium transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Inline Reply Form */}
                    {activeReplyId === comment.id && (
                      <div className="mt-2 pl-2 border-l-2 border-zinc-700 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a reply..."
                            value={replyText[comment.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                          />
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 space-y-2 pl-3 border-l-2 border-zinc-800">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-2 items-start text-xs pt-1">
                            <img
                              src={reply.authorAvatar}
                              alt={reply.author}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-zinc-300 text-xs">
                                  {reply.author}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {reply.createdAt}
                                </span>
                              </div>
                              <p className="text-zinc-300 mt-0.5 leading-snug">
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Up Next / Recommendations Column */}
      <div className="lg:col-span-4 space-y-3">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2">
          Up Next
        </h3>
        <div className="space-y-2">
          {relatedVideos.map(item => (
            <VideoCard 
              key={item.id} 
              video={item} 
              layout="list"
              onShare={onShare}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
