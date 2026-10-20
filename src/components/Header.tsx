import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Mic, 
  Video as VideoIcon, 
  Bell, 
  X, 
  Play, 
  ArrowLeft,
  Check,
  Radio
} from 'lucide-react';
import { useVideo } from '../context/VideoContext';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    setIsUploadModalOpen, 
    setIsGoLiveModalOpen,
    setIsSidebarCollapsed,
    setActiveTab,
    videos,
    setActiveVideoId,
    currentUser,
    setActiveChannelId
  } = useVideo();

  const [isSearchingMobile, setIsSearchingMobile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Suggestions filtered by search query
  const suggestions = searchQuery.trim()
    ? videos
        .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('Futuristic Desk Setup 2026');
      setIsListening(false);
      setShowSuggestions(false);
    }, 2000);
  };

  const handleSelectSuggestion = (title: string, videoId?: string) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    if (videoId) {
      setActiveVideoId(videoId);
      setActiveTab('watch');
    }
  };

  return (
    <header className="sticky top-0 z-40 h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-3 md:px-4 flex items-center justify-between text-zinc-100">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="p-2 rounded-full hover:bg-zinc-800 active:scale-95 transition-all text-zinc-300 hover:text-white"
          title="Toggle Navigation"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => {
            setActiveTab('home');
            setActiveVideoId(null);
            setActiveChannelId(null);
            setSearchQuery('');
          }}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center shadow-md shadow-red-600/30 group-hover:bg-red-500 transition-colors">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
          <span className="font-bold text-lg tracking-tight font-sans text-white flex items-center">
            VidFlow
            <span className="text-[10px] text-zinc-400 font-medium ml-1.5 px-1 py-0.2 bg-zinc-800/80 rounded border border-zinc-700/50">
              IN
            </span>
          </span>
        </div>
      </div>

      {/* Center: Search Box */}
      <div 
        ref={searchContainerRef}
        className={`flex-1 max-w-xl mx-4 transition-all duration-200 relative ${
          isSearchingMobile ? 'fixed inset-0 bg-zinc-950 z-50 p-3 flex items-center' : 'hidden sm:flex items-center'
        }`}
      >
        {isSearchingMobile && (
          <button 
            onClick={() => setIsSearchingMobile(false)}
            className="p-2 mr-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center w-full relative">
          <div className="flex items-center flex-1 bg-zinc-900 border border-zinc-700 rounded-l-full focus-within:border-blue-500 px-4 py-1.5 transition-colors">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search videos, creators, or topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false);
                }
              }}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setShowSuggestions(false)}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-700 rounded-r-full text-zinc-300 hover:text-white transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`ml-3 p-2.5 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors shrink-0 ${
            isListening ? 'bg-red-600/20 border-red-500 text-red-500 animate-pulse' : 'bg-zinc-900 text-zinc-300'
          }`}
          title="Search with your voice"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-14 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectSuggestion(item.title, item.id)}
                className="px-4 py-2.5 hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between text-sm text-zinc-200 border-b border-zinc-800/40 last:border-0"
              >
                <div className="flex items-center gap-3 truncate">
                  <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider shrink-0 ml-2">
                  {item.type === 'short' ? 'Short' : 'Video'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice Search Modal if active */}
      {isListening && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 mx-auto flex items-center justify-center mb-4 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Listening...</h3>
            <p className="text-sm text-zinc-400 mb-6">Bolkar search karein (Say something)</p>
            <button 
              onClick={() => setIsListening(false)}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setIsSearchingMobile(true)}
          className="sm:hidden p-2 rounded-full hover:bg-zinc-800 text-zinc-300"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Upload / Create Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-full text-xs font-bold text-white transition-all shadow-md shadow-red-600/30 active:scale-95"
            title="Create video or go live"
          >
            <VideoIcon className="w-4 h-4" />
            <span className="hidden md:inline">+ Create</span>
            <span className="md:hidden">+</span>
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-in zoom-in-95">
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  setIsUploadModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-800 text-xs text-zinc-200 flex items-center gap-3 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-red-500">
                  <VideoIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Upload video</div>
                  <div className="text-[10px] text-zinc-400">Long video ya Shorts</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  setIsGoLiveModalOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-800 text-xs text-zinc-200 flex items-center gap-3 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600/20 flex items-center justify-center text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    <span>Go live</span>
                    <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">LIVE</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Live stream shuru karein</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="font-semibold text-sm text-zinc-100">Notifications</span>
                <span className="text-xs text-blue-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-red-400" />
                  </div>
                  <div className="text-xs">
                    <p className="text-zinc-200 font-medium">TechPulse India uploaded a new video!</p>
                    <span className="text-zinc-500 text-[11px]">2 hours ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/60 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="text-zinc-200 font-medium">New subscriber joined your channel!</p>
                    <span className="text-zinc-500 text-[11px]">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Channel Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 ring-2 ring-transparent hover:ring-zinc-600 transition-all cursor-pointer"
            title={currentUser.name}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-white truncate">{currentUser.name}</h4>
                  <p className="text-xs text-zinc-400 truncate">{currentUser.handle}</p>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setActiveChannelId(currentUser.id);
                    setActiveTab('channel');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2"
                >
                  <span>Your Channel (Aapka Channel)</span>
                </button>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2"
                >
                  <span>Upload Video / Shorts</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('liked');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2"
                >
                  <span>Liked Videos</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2"
                >
                  <span>Watch History</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
