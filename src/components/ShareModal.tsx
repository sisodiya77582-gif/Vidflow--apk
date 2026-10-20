import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Globe, Share2 } from 'lucide-react';
import { Video } from '../types';

interface ShareModalProps {
  video: Video | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const currentUrl = window.location.href.split('?')[0] + `?v=${video.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Watch "${video.title}" on VidFlow: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`Check out "${video.title}" on VidFlow:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-red-500" />
            <span>Share Video</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3 p-2 bg-zinc-950/60 rounded-xl border border-zinc-800">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              referrerPolicy="no-referrer"
              className="w-16 h-10 object-cover rounded-lg shrink-0" 
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-white truncate">{video.title}</h4>
              <p className="text-[11px] text-zinc-400">{video.channel.name}</p>
            </div>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs text-zinc-200"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-1.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleTwitter}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs text-zinc-200"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-1.5">
                <Send className="w-5 h-5" />
              </div>
              <span>X / Twitter</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs text-zinc-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mb-1.5">
                <Globe className="w-5 h-5" />
              </div>
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Direct Copy Bar */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
