import React from 'react';
import { 
  Home, 
  Flame, 
  TvMinimalPlay, 
  History, 
  ThumbsUp, 
  Clock, 
  User, 
  Compass, 
  Film, 
  Gamepad2, 
  Code,
  UtensilsCrossed,
  Sparkles,
  Radio
} from 'lucide-react';
import { useVideo } from '../context/VideoContext';
import { ActiveTab } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    channels, 
    setActiveChannelId, 
    setActiveVideoId,
    currentUser,
    setSelectedCategory
  } = useVideo();

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setActiveVideoId(null);
    setActiveChannelId(null);
  };

  const mainNavItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'shorts' as ActiveTab, label: 'Shorts', icon: Flame, badge: 'Hot' },
    { id: 'live' as ActiveTab, label: 'Live', icon: Radio, isLivePulse: true },
    { id: 'subscriptions' as ActiveTab, label: 'Subscriptions', icon: TvMinimalPlay },
  ];

  const libraryItems = [
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    { id: 'liked' as ActiveTab, label: 'Liked Videos', icon: ThumbsUp },
    { id: 'library' as ActiveTab, label: 'Watch Later', icon: Clock },
  ];

  const exploreCategories = [
    { label: 'Technology', icon: Code, cat: 'Technology' },
    { label: 'Travel', icon: Compass, cat: 'Travel' },
    { label: 'Cooking', icon: UtensilsCrossed, cat: 'Cooking' },
    { label: 'Gaming', icon: Gamepad2, cat: 'Gaming' },
    { label: 'Movies', icon: Film, cat: 'Entertainment' },
  ];

  // Subscribed channels
  const subscribedChannels = channels.filter(c => c.isSubscribed);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-zinc-950 border-r border-zinc-900 overflow-y-auto shrink-0 transition-all duration-200 select-none ${
          isSidebarCollapsed ? 'w-18 px-2 py-3' : 'w-60 p-3'
        }`}
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        {/* Main Nav */}
        <div className="space-y-1">
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-800 text-white font-semibold' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                } ${isSidebarCollapsed ? 'flex-col gap-1 py-3 px-1 text-center justify-center' : ''}`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${
                  isActive && item.id === 'shorts' ? 'text-red-500 fill-red-500' : ''
                } ${item.id === 'live' ? 'text-red-500' : ''}`} />
                <span className={isSidebarCollapsed ? 'text-[10px] truncate w-full' : 'truncate'}>
                  {item.label}
                </span>
                {item.id === 'live' && !isSidebarCollapsed && (
                  <span className="ml-auto text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                )}
                {item.badge && !isSidebarCollapsed && (
                  <span className="ml-auto text-[10px] font-semibold bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isSidebarCollapsed && (
          <>
            <div className="my-3 border-t border-zinc-800/60" />

            {/* You / Library Section */}
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>You</span>
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveChannelId(currentUser.id);
                    setActiveTab('channel');
                  }}
                  className={`w-full flex items-center gap-4 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'channel' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span className="truncate">Your Channel</span>
                </button>

                {libraryItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-4 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-3 border-t border-zinc-800/60" />

            {/* Subscriptions List */}
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Subscriptions</span>
                <span className="text-[11px] text-zinc-500 font-normal">
                  {subscribedChannels.length}
                </span>
              </div>

              {subscribedChannels.length === 0 ? (
                <p className="px-3 py-2 text-xs text-zinc-500">
                  No channels subscribed yet. Click Subscribe on any video!
                </p>
              ) : (
                <div className="space-y-0.5 mt-1">
                  {subscribedChannels.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChannelId(ch.id);
                        setActiveTab('channel');
                        setActiveVideoId(null);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors group"
                    >
                      <img
                        src={ch.avatar}
                        alt={ch.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate text-xs text-left flex-1 font-medium group-hover:text-white">
                        {ch.name}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="New content" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="my-3 border-t border-zinc-800/60" />

            {/* Explore Section */}
            <div>
              <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Explore
              </div>
              <div className="space-y-0.5">
                {exploreCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setSelectedCategory(cat.cat);
                        setActiveTab('home');
                        setActiveVideoId(null);
                      }}
                      className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer quiet disclaimer */}
            <div className="mt-auto pt-6 pb-2 px-3 text-[11px] text-zinc-600 space-y-1">
              <p>VidFlow &copy; 2026</p>
              <p>Long &amp; Shorts Video Community</p>
            </div>
          </>
        )}
      </aside>

      {/* Mobile Fixed Bottom Navigation Bar (Following Mobile Touch Guidelines) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 grid grid-cols-5 items-center h-14 px-2">
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        <button
          onClick={() => handleNav('shorts')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'shorts' ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Flame className={`w-5 h-5 ${activeTab === 'shorts' ? 'fill-red-500' : ''}`} />
          <span className="text-[10px] font-medium mt-0.5">Shorts</span>
        </button>

        <button
          onClick={() => handleNav('live')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            activeTab === 'live' ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Radio className="w-5 h-5 text-red-500" />
          <span className="text-[10px] font-bold mt-0.5 text-red-400">Live</span>
          <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        </button>

        <button
          onClick={() => handleNav('subscriptions')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'subscriptions' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TvMinimalPlay className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Subscriptions</span>
        </button>

        <button
          onClick={() => handleNav('library')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'library' || activeTab === 'channel' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">You</span>
        </button>
      </nav>
    </>
  );
};
