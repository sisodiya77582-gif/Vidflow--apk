import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Music, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown,
  Check,
  Send,
  X,
  Volume2,
  VolumeX,
  MoreVertical
} from 'lucide-react';
import { Video } from '../types';
import { useVideo } from '../context/VideoContext';

interface ShortsFeedProps {
  onShare: (video: Video) => void;
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({ onShare }) => {
  const { 
    videos, 
    activeShortIndex, 
    setActiveShortIndex, 
    toggleLike, 
    toggleDislike, 
    toggleSubscribe, 
    addComment,
    likeComment,
    currentUser,
    setActiveChannelId,
    setActiveTab
  } = useVideo();

  const shorts = videos.filter(v => v.type === 'short');
  const currentShort = shorts[activeShortIndex] || shorts[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isExpandedCaption, setIsExpandedCaption] = useState(false);

  // Play current short when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
    setProgress(0);
    setIsExpandedCaption(false);
  }, [activeShortIndex, currentShort?.id]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog || 0);
    }
  };

  const handleNext = () => {
    if (activeShortIndex < shorts.length - 1) {
      setActiveShortIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeShortIndex > 0) {
      setActiveShortIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowUp') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeShortIndex, shorts.length, isPlaying]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentShort) return;
    addComment(currentShort.id, commentText);
    setCommentText('');
  };

  if (!currentShort) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-400">
        <p className="text-lg">No Shorts available yet.</p>
        <p className="text-sm text-zinc-500 mt-1">Upload a vertical short video to get started!</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4.5rem)] py-2 px-2 select-none">
      <div className="relative flex items-center gap-4 h-full max-h-[820px]">
        {/* Navigation Arrows on Left (Desktop) */}
        <div className="hidden lg:flex flex-col gap-3">
          <button
            onClick={handlePrev}
            disabled={activeShortIndex === 0}
            className={`p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-all ${
              activeShortIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
            }`}
            title="Previous Short (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeShortIndex === shorts.length - 1}
            className={`p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-all ${
              activeShortIndex === shorts.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'
            }`}
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Vertical Video Phone Frame */}
        <div className="relative h-full w-[360px] sm:w-[420px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex items-center justify-center">
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            poster={currentShort.thumbnailUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
            onClick={togglePlay}
            loop={shorts.length === 1}
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Top Audio / Sound Mute Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Gradient Scrim & Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pb-5 text-white z-10 pointer-events-none">
            {/* Channel info & Subscribe */}
            <div className="flex items-center gap-2 mb-2 pointer-events-auto">
              <div 
                onClick={() => {
                  setActiveChannelId(currentShort.channel.id);
                  setActiveTab('channel');
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img 
                  src={currentShort.channel.avatar} 
                  alt={currentShort.channel.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-white/20" 
                />
                <span className="font-semibold text-sm hover:underline drop-shadow-md">
                  {currentShort.channel.handle || currentShort.channel.name}
                </span>
              </div>

              {/* Subscribe button right on Short! */}
              <button
                onClick={() => toggleSubscribe(currentShort.channel.id)}
                className={`ml-2 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 ${
                  currentShort.channel.isSubscribed
                    ? 'bg-zinc-800/90 text-zinc-200 border border-zinc-600'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {currentShort.channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Video Title & Description / Caption ("taital aur description") */}
            <div className="pointer-events-auto space-y-1">
              <h3 className="text-sm font-semibold text-white drop-shadow leading-snug">
                {currentShort.title}
              </h3>
              
              <p className={`text-xs text-zinc-300 drop-shadow-sm ${
                isExpandedCaption ? '' : 'line-clamp-2'
              }`}>
                {currentShort.description}
              </p>

              {currentShort.description.length > 70 && (
                <button
                  onClick={() => setIsExpandedCaption(!isExpandedCaption)}
                  className="text-[11px] font-bold text-zinc-200 hover:text-white"
                >
                  {isExpandedCaption ? 'less' : 'more'}
                </button>
              )}
            </div>

            {/* Audio Track marquee */}
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-300 drop-shadow">
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-[11px]">Original Audio · {currentShort.channel.name}</span>
            </div>

            {/* Thin Progress bar at bottom */}
            <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-100" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* Comments Slide-over / Modal for Shorts */}
          {showComments && (
            <div className="absolute inset-0 z-30 bg-zinc-950/95 backdrop-blur-md rounded-3xl flex flex-col text-white animate-in slide-in-from-bottom duration-200">
              {/* Comments Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">Comments</h4>
                  <span className="text-xs text-zinc-400 font-mono">
                    {currentShort.comments.length}
                  </span>
                </div>
                <button 
                  onClick={() => setShowComments(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentShort.comments.length === 0 ? (
                  <p className="text-center text-xs text-zinc-500 py-8">
                    No comments yet. Leave a thought!
                  </p>
                ) : (
                  currentShort.comments.map(c => (
                    <div key={c.id} className="flex gap-2.5 items-start text-xs">
                      <img 
                        src={c.authorAvatar} 
                        alt={c.author}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-300">{c.author}</span>
                          <span className="text-[10px] text-zinc-500">{c.createdAt}</span>
                        </div>
                        <p className="text-zinc-200 mt-0.5 leading-relaxed">{c.text}</p>
                        <div className="flex items-center gap-2 mt-1 text-zinc-400">
                          <button 
                            onClick={() => likeComment(currentShort.id, c.id)}
                            className={`flex items-center gap-1 hover:text-white ${c.isLiked ? 'text-red-400' : ''}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{c.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="p-3 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-full bg-red-600 disabled:opacity-50 text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Action Rail on Right (Like, Dislike, Comments, Share) */}
        <div className="flex flex-col gap-4 text-white items-center">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleLike(currentShort.id)}
              className={`p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-all ${
                currentShort.isLiked ? 'text-red-500 bg-red-500/20' : ''
              }`}
              title="Like"
            >
              <ThumbsUp className={`w-5 h-5 ${currentShort.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <span className="text-xs font-semibold text-zinc-200 tabular-nums">
              {currentShort.likes.toLocaleString()}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleDislike(currentShort.id)}
              className={`p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-all ${
                currentShort.isDisliked ? 'text-zinc-100 bg-zinc-700' : 'text-zinc-300'
              }`}
              title="Dislike"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-zinc-400">Dislike</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-all text-zinc-200"
              title="Comments"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-zinc-200 tabular-nums">
              {currentShort.comments.length}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onShare(currentShort)}
              className="p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-all text-zinc-200"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-zinc-400">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};
