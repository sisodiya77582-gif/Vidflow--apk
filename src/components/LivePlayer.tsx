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
  Send, 
  Sparkles,
  Users,
  Radio,
  SlidersHorizontal,
  Flame,
  Heart,
  Smile,
  ShieldCheck,
  StopCircle,
  AlertTriangle
} from 'lucide-react';
import { Video, LiveChatMessage } from '../types';
import { useVideo } from '../context/VideoContext';

interface LivePlayerProps {
  video: Video;
  onShare: (video: Video) => void;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({ video, onShare }) => {
  const { 
    toggleSubscribe, 
    toggleLike, 
    toggleDislike, 
    toggleSaveWatchLater, 
    watchLaterIds,
    addLiveChatMessage,
    currentUser,
    setActiveChannelId,
    setActiveTab,
    channels,
    endLiveStream,
    activeLiveStream
  } = useVideo();

  const currentChannel = channels.find(c => c.id === video.channel.id) || video.channel;
  const isHost = currentChannel.id === currentUser.id;

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState('₹100');
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [isChatOpenMobile, setIsChatOpenMobile] = useState(false);
  const [viewerCount, setViewerCount] = useState(video.liveViewers || 1420);
  const [flyingReactions, setFlyingReactions] = useState<{ id: number; emoji: string }[]>([]);

  // Assign live camera media stream if current user is streaming via webcam
  useEffect(() => {
    if (isHost && activeLiveStream && videoRef.current) {
      videoRef.current.srcObject = activeLiveStream;
      videoRef.current.play().catch(console.warn);
    }
  }, [isHost, activeLiveStream]);

  // Periodic simulated live viewer fluctuations & simulated chat activity
  useEffect(() => {
    if (!video.isLive) return;

    // Viewers count micro fluctuation
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => Math.max(10, prev + Math.floor(Math.random() * 11) - 5));
    }, 4000);

    // Random incoming viewer comment every 6-9 seconds
    const simulatedAudience = [
      { name: 'Aditya Rajput', text: 'OP gameplay bhai! Keep it up 🔥', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Meera Patel', text: 'Namaste! Greetings from Ahmedabad 🙌', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { name: 'Devendra Verma', text: 'Audio check 10/10 clear voice bro!', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { name: 'Ritu Sen', text: 'Super stream! Subscribed right now ❤️', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    ];

    const chatInterval = setInterval(() => {
      const randomMsg = simulatedAudience[Math.floor(Math.random() * simulatedAudience.length)];
      addLiveChatMessage(video.id, randomMsg.text);
    }, 8000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
    };
  }, [video.id, video.isLive]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [video.liveChatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addLiveChatMessage(video.id, chatInput.trim());
    setChatInput('');
  };

  const handleSendSuperChat = () => {
    if (!superChatMessage.trim()) return;
    addLiveChatMessage(video.id, superChatMessage.trim(), true, superChatAmount);
    setSuperChatMessage('');
    setShowSuperChatModal(false);
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFlyingReactions(prev => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => r.id !== id));
    }, 1800);
  };

  const isSaved = watchLaterIds.includes(video.id);

  return (
    <div className="max-w-[1700px] mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      {/* Floating Reaction Confetti */}
      <div className="pointer-events-none fixed bottom-24 right-8 z-50 flex flex-col gap-2 items-center">
        {flyingReactions.map(r => (
          <div key={r.id} className="text-3xl animate-bounce">
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Main Video Section */}
      <div className="lg:col-span-8 space-y-4">
        {/* Live Stream Player */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-800 group">
          <video
            ref={videoRef}
            src={isHost && activeLiveStream ? undefined : video.videoUrl}
            poster={video.thumbnailUrl}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          {/* Top Live Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-md text-xs font-bold text-white shadow-lg animate-pulse uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>LIVE</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-md text-xs font-semibold text-white border border-white/10">
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span className="tabular-nums font-mono">{viewerCount.toLocaleString()} watching</span>
            </div>
          </div>

          {/* Top Right Controls: Mute & End Stream if host */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {isHost && (
              <button
                onClick={() => endLiveStream(video.id)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/40"
              >
                <StopCircle className="w-4 h-4" />
                <span>End Stream</span>
              </button>
            )}

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Live Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-semibold text-zinc-300">Live Streaming</span>
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Latency: Ultra Low (0.8s) · 1080p60
            </div>
          </div>
        </div>

        {/* Video Title & Live Status */}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-zinc-100 leading-snug">
            {video.title}
          </h1>
        </div>

        {/* Channel Row & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-800/80 pb-4">
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
                className="w-10 h-10 rounded-full object-cover border-2 border-red-500" 
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-800 border border-zinc-700/60 rounded-full overflow-hidden text-xs text-zinc-200">
              <button
                onClick={() => toggleLike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 hover:bg-zinc-700 transition-colors ${
                  video.isLiked ? 'text-red-500 font-bold' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="tabular-nums font-medium">
                  {video.likes.toLocaleString()}
                </span>
              </button>
              <div className="w-[1px] h-4 bg-zinc-700" />
              <button
                onClick={() => toggleDislike(video.id)}
                className="px-3 py-2 hover:bg-zinc-700 text-zinc-400"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onShare(video)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 rounded-full text-xs font-semibold text-zinc-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={() => toggleSaveWatchLater(video.id)}
              className={`p-2 rounded-full border border-zinc-700/60 transition-colors ${
                isSaved ? 'bg-blue-600/30 border-blue-500 text-blue-400' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Stream Description Box */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 text-xs md:text-sm text-zinc-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-zinc-300 text-xs">
            <span className="text-red-400 font-bold">🔴 Streaming Now</span>
            <span>·</span>
            <span>{video.createdAt}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{video.category}</span>
          </div>

          <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-xs md:text-sm">
            {video.description}
          </p>
        </div>
      </div>

      {/* Real-Time Live Chat Sidebar Column (YouTube Live Chat) */}
      <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col h-[680px] shadow-2xl overflow-hidden">
        {/* Live Chat Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold text-sm text-white">Live Chat</span>
            <span className="text-[11px] text-zinc-400 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
              Top Chat
            </span>
          </div>

          <button
            onClick={() => setShowSuperChatModal(true)}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Chat</span>
          </button>
        </div>

        {/* Pinned Stream Rules Banner */}
        <div className="px-3 py-2 bg-blue-950/40 border-b border-blue-900/50 flex items-center gap-2 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="truncate">Welcome to Live chat! Remember to be kind and follow guidelines.</span>
        </div>

        {/* Live Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
          {(video.liveChatMessages || []).map((msg) => (
            <div 
              key={msg.id} 
              className={`p-2 rounded-xl transition-all ${
                msg.isSuperChat 
                  ? 'bg-amber-950/50 border border-amber-500/60 shadow-md' 
                  : 'hover:bg-zinc-800/40'
              }`}
            >
              {msg.isSuperChat && (
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/30 text-[11px] font-bold text-amber-300">
                  <span>Super Chat Support</span>
                  <span className="px-2 py-0.5 bg-amber-500 text-black rounded font-mono font-bold">
                    {msg.superChatAmount}
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2">
                <img 
                  src={msg.authorAvatar} 
                  alt={msg.author} 
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-zinc-300 truncate">
                      {msg.author}
                    </span>
                    {msg.authorBadge === 'owner' && (
                      <span className="text-[10px] bg-red-600/30 text-red-400 px-1 rounded font-bold">
                        Host
                      </span>
                    )}
                    {msg.authorBadge === 'mod' && (
                      <span className="text-[10px] bg-blue-600/30 text-blue-400 px-1 rounded font-bold">
                        Mod
                      </span>
                    )}
                    {msg.authorBadge === 'member' && (
                      <span className="text-[10px] bg-emerald-600/30 text-emerald-400 px-1 rounded font-bold">
                        Member
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-zinc-200 mt-0.5 leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Reactions Bar */}
        <div className="px-3 py-1.5 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-sm">
          <span className="text-[11px] text-zinc-400 font-medium">Reactions:</span>
          <div className="flex items-center gap-2">
            {['🔥', '❤️', '👏', '🎉', '💯'].map(emoji => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                className="hover:scale-125 transition-transform active:scale-95 p-1"
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendChat} className="p-3 border-t border-zinc-800 bg-zinc-950/90 flex items-center gap-2">
          <input
            type="text"
            placeholder="Send a live message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="p-2 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white transition-all shadow-md"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Super Chat Modal */}
      {showSuperChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Send Super Chat</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Highlight your message in live chat and support the creator!
            </p>

            <div className="grid grid-cols-3 gap-2">
              {['₹50', '₹100', '₹500'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setSuperChatAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    superChatAmount === amt
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Your highlighted message..."
              value={superChatMessage}
              onChange={(e) => setSuperChatMessage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSuperChatModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSuperChat}
                disabled={!superChatMessage.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl disabled:opacity-50"
              >
                Send {superChatAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
