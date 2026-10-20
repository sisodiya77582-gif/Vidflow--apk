import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Radio, 
  Camera, 
  Mic, 
  MicOff, 
  Video as VideoCam, 
  VideoOff, 
  Sparkles, 
  Play, 
  AlertCircle,
  Settings,
  Monitor
} from 'lucide-react';
import { useVideo } from '../context/VideoContext';

export const GoLiveModal: React.FC = () => {
  const { isGoLiveModalOpen, setIsGoLiveModalOpen, startLiveStream } = useVideo();

  const [streamSource, setStreamSource] = useState<'webcam' | 'virtual'>('virtual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Gaming');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Turn on camera when webcam source is selected
  useEffect(() => {
    if (!isGoLiveModalOpen) {
      // stop stream when modal closes
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      setIsCameraActive(false);
      return;
    }

    if (streamSource === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          mediaStreamRef.current = stream;
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = stream;
            previewVideoRef.current.play().catch(console.warn);
          }
          setIsCameraActive(true);
          setCameraError(null);
        })
        .catch(err => {
          console.warn('Camera access error or permission denied:', err);
          setCameraError('Camera access not available or permission denied. Using Virtual Studio Stream instead.');
          setStreamSource('virtual');
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      setIsCameraActive(false);
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isGoLiveModalOpen, streamSource]);

  if (!isGoLiveModalOpen) return null;

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Kripya Live Stream ka Title darj karein');
      return;
    }

    setIsStarting(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Launch Live Stream
          startLiveStream({
            title: `🔴 LIVE: ${title.trim()}`,
            description: description.trim() || 'Welcome to my Live Stream on VidFlow! Chat and subscribe to stay updated.',
            category,
            cameraStream: streamSource === 'webcam' ? mediaStreamRef.current : null,
            streamUrl: streamSource === 'virtual' 
              ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' 
              : undefined,
          });
          setIsStarting(false);
          setIsGoLiveModalOpen(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Go Live Studio (Live Stream Shuru Karein)
              </h2>
              <p className="text-xs text-zinc-400">
                Setup your camera, stream title, and broadcast to your audience
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoLiveModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleStartLive} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {cameraError && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Broadcast Source Switcher */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Broadcast Source
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStreamSource('webcam')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  streamSource === 'webcam'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${streamSource === 'webcam' ? 'bg-red-600 text-white' : 'bg-zinc-800'}`}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Webcam &amp; Mic</div>
                  <div className="text-[11px] text-zinc-400">Your camera video feed</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStreamSource('virtual')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  streamSource === 'virtual'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${streamSource === 'virtual' ? 'bg-red-600 text-white' : 'bg-zinc-800'}`}>
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Virtual Studio</div>
                  <div className="text-[11px] text-zinc-400">Esports / Coding / Lofi</div>
                </div>
              </button>
            </div>
          </div>

          {/* Stream Preview Box */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center">
            {streamSource === 'webcam' ? (
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="relative w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" 
                  alt="Stream preview"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-40" 
                />
                <div className="relative z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-red-600/80 text-white flex items-center justify-center mx-auto shadow-lg">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Virtual Studio Ready</h4>
                  <p className="text-xs text-zinc-300">Ultra-low latency 1080p stream will broadcast</p>
                </div>
              </div>
            )}

            {/* Countdown Overlay if starting */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-30 animate-in zoom-in-90">
                <div className="text-6xl font-black text-red-500 font-mono mb-2">
                  {countdown}
                </div>
                <p className="text-sm font-semibold text-white">Going LIVE in...</p>
              </div>
            )}

            {/* Live Audio / Stream Status overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono">Audio Meter: Optimal</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(b => (
                  <span 
                    key={b} 
                    className="w-1 h-3 rounded-full bg-emerald-400 animate-pulse" 
                    style={{ animationDelay: `${b * 150}ms` }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Title Input ("Live Stream ka Title") */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Stream Title / Taital <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. 🔴 Grand Sunday Gaming Live Stream & Q&A With Viewers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Stream Description / Vivaran &amp; Chat Rules
            </label>
            <textarea
              rows={3}
              placeholder="Stream ke baare me likhein, chat ke niyam, links, social handles..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              >
                <option value="Gaming">Gaming &amp; Esports</option>
                <option value="Technology">Technology &amp; Gadgets</option>
                <option value="Music">Music &amp; Chill</option>
                <option value="Education">Education &amp; Coding</option>
                <option value="Entertainment">Entertainment &amp; Chit Chat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Privacy
              </label>
              <select
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              >
                <option value="Public">Public (Sabke liye open)</option>
                <option value="Unlisted">Unlisted (Link wale dekh sakein)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isStarting}
              onClick={() => setIsGoLiveModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Go Live Now (Live Shuru Karein)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
