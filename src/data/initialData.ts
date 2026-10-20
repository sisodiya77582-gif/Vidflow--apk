import { Channel, Video } from '../types';
import techThumb from '../assets/images/tech_gadget_thumb_1792513767648.jpg';
import travelThumb from '../assets/images/travel_nature_thumb_1792513769189.jpg';
import cookingThumb from '../assets/images/cooking_artisan_thumb_1792513769651.jpg';
import creatorAvatar from '../assets/images/creator_avatar_alex_1792513768778.jpg';

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'ch-tech-creator',
    name: 'TechPulse India',
    handle: '@TechPulseIn',
    avatar: creatorAvatar,
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80',
    subscribers: 284000,
    isSubscribed: false,
    description: 'Welcome to TechPulse! Latest smartphones, futuristic gadgets, desk setups, coding gear, and honest reviews in Hindi & English.',
    joinedDate: 'Jan 2023',
    verified: true,
  },
  {
    id: 'ch-mountain-wanderer',
    name: 'Wanderlust Diaries',
    handle: '@WanderlustDiaries',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80',
    subscribers: 512000,
    isSubscribed: true,
    description: 'Exploring the most breathtaking hidden mountain lakes, trekking trails, and cultural stories around the globe.',
    joinedDate: 'Mar 2021',
    verified: true,
  },
  {
    id: 'ch-chef-kabir',
    name: 'Chef Kabir Rasoi',
    handle: '@ChefKabirRasoi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80',
    subscribers: 145000,
    isSubscribed: false,
    description: 'Secret authentic recipes made simple! From wood-fired artisan pizza to street food and traditional curries.',
    joinedDate: 'Oct 2022',
    verified: true,
  },
  {
    id: 'ch-vibe-coder',
    name: 'DevFlow Coding',
    handle: '@DevFlowOfficial',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
    subscribers: 98400,
    isSubscribed: false,
    description: 'Full-stack web development tutorials, React, AI integrations, and UI/UX design masterclasses.',
    joinedDate: 'Aug 2023',
    verified: false,
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // LIVE STREAM 1
  {
    id: 'live-stream-1',
    type: 'live',
    isLive: true,
    liveViewers: 8420,
    title: '🔴 LIVE: Grand Gaming Championship 2026 Finals | Esports Arena Hindi',
    description: `Welcome to the Grand Finals of 2026 Championship! Watch top esports players clash live.
Rules of Chat:
- Be respectful to everyone
- No spamming or self promotion
- Use Super Chat to support the stream!

Streaming in 1080p 60FPS. Drop your predictions in the live chat!`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 48900,
    likes: 12400,
    dislikes: 110,
    isLiked: false,
    createdAt: 'Started streaming 35 mins ago',
    category: 'Gaming',
    tags: ['Live', 'Gaming', 'Esports', 'Hindi'],
    channel: INITIAL_CHANNELS[0],
    comments: [],
    liveChatMessages: [
      {
        id: 'lc-1',
        author: 'Esports Fan India',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        authorBadge: 'mod',
        text: 'Welcome everyone! Stream rules: Be respectful in chat 🙌',
        timestamp: '12:02'
      },
      {
        id: 'lc-2',
        author: 'Ravi Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'Team Alpha is definitely taking round 3! What a clutch play 🔥🔥',
        timestamp: '12:04'
      },
      {
        id: 'lc-3',
        author: 'Aarav Gupta',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        isSuperChat: true,
        superChatAmount: '₹200',
        superChatColor: 'bg-amber-500',
        text: 'Huge shoutout to the stream! Best gameplay ever! ❤️',
        timestamp: '12:05'
      },
      {
        id: 'lc-4',
        author: 'Sneha Roy',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        authorBadge: 'member',
        text: 'Audio and video quality is crisp! Loving this broadcast!',
        timestamp: '12:06'
      }
    ]
  },
  // LIVE STREAM 2
  {
    id: 'live-stream-2',
    type: 'live',
    isLive: true,
    liveViewers: 3250,
    title: '🔴 LIVE: 24/7 Relaxing Lofi Beats & Code Jam | Chill Music Study Session',
    description: `Chill lofi study beats and deep focus coding session.
Ask questions in chat, share what you are studying or coding today!
Support the stream by subscribing and sharing with fellow creators.`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    duration: 'LIVE',
    durationSeconds: 0,
    views: 18200,
    likes: 5400,
    dislikes: 32,
    isLiked: true,
    createdAt: 'Started streaming 2 hours ago',
    category: 'Music',
    tags: ['Live', 'Lofi', 'Coding', 'Music'],
    channel: INITIAL_CHANNELS[3],
    comments: [],
    liveChatMessages: [
      {
        id: 'lc-5',
        author: 'Pooja Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        text: 'This lofi stream helps me focus so much on my college assignments ☕✨',
        timestamp: '11:45'
      },
      {
        id: 'lc-6',
        author: 'Kunal Dev',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        text: 'Coding React + Tailwind right now with this stream in background 💻',
        timestamp: '11:50'
      }
    ]
  },
  {
    id: 'vid-1',
    type: 'long',
    title: 'Top 5 Futuristic Desk Setup Gadgets for 2026 | Ultimate Review & Tour',
    description: `Namaste dosto! Aaj ke is video mein hum explore karenge 2026 ke top 5 desk setup gadgets jo aapke workspace ko next level bana denge.

Timestamps:
00:00 - Introduction & Setup Overview
01:35 - Transparent Mechanical Keyboard with OLED Screen
04:20 - 4K Curved Display & Ergo Monitor Arm
07:15 - Wireless Studio Backlighting & Sound Dampening
10:45 - Final Verdict & Pricing

Dosto agar video pasand aaye to LIKE karein, COMMENT mein apna favorite gadget batayein aur channel ko SUBSCRIBE zaroor karein!

Links & Specs:
- Keyboard: Lumina Chroma 75
- Audio: Studio Pro Studio Monitors
- Lighting: HexaGlow LED Panels

#TechSetup #DeskTour #Gadgets2026 #HindiTech`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: techThumb,
    duration: '14:28',
    durationSeconds: 868,
    views: 148520,
    likes: 8940,
    dislikes: 124,
    isLiked: false,
    createdAt: '2 days ago',
    category: 'Technology',
    tags: ['Tech', 'Setup', 'Gadgets', 'Hindi', 'Review'],
    channel: INITIAL_CHANNELS[0],
    comments: [
      {
        id: 'c-1',
        author: 'Rahul Sharma',
        authorHandle: '@rahul_dev',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'Bhai keyboard ka lighting setup sach me kamaal ka he! What an aesthetic video quality 🔥',
        createdAt: '1 day ago',
        likes: 42,
        isLiked: false,
        replies: [
          {
            id: 'c-1-r1',
            author: 'TechPulse India',
            authorHandle: '@TechPulseIn',
            authorAvatar: creatorAvatar,
            text: 'Shukriya Rahul bhai! Next video me custom keycaps par detail video aayegi 🙌',
            createdAt: '18 hours ago',
            likes: 15,
            isLiked: false,
          }
        ]
      },
      {
        id: 'c-2',
        author: 'Anjali Verma',
        authorHandle: '@anjaliv',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        text: 'Clean explanation and the camera angles are so cinematic! Subscribed instantly!',
        createdAt: '20 hours ago',
        likes: 19,
        isLiked: false,
      },
      {
        id: 'c-3',
        author: 'Vikram Singh',
        authorHandle: '@vikram_s',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        text: 'Monitor arm ka model name kya he bro? Description me link update kar dijiye please.',
        createdAt: '12 hours ago',
        likes: 7,
        isLiked: false,
      }
    ]
  },
  {
    id: 'vid-2',
    type: 'long',
    title: 'Secret Himalayan Alpine Lake Trek - 4K Drone Cinematic Experience',
    description: `We hiked 18 kilometers through dense golden pine forests to reach this untamed turquoise alpine lake sitting at 3,800 meters altitude.

In this full-length documentary film, witness raw Himalayan beauty, crisp mountain reflections, and the calm serenity of untouched nature.

Camera equipment used:
- DJI Mavic 3 Pro Cine
- Sony A7S III 24-70mm f/2.8 GM
- Rode VideoMic Pro+

If this tranquil journey touched your soul, please drop a comment below and subscribe for more mountain adventures every Sunday!

#Travel #Himalayas #Nature #4KDrone #Cinematic`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: travelThumb,
    duration: '22:15',
    durationSeconds: 1335,
    views: 389400,
    likes: 24100,
    dislikes: 86,
    isLiked: true,
    createdAt: '5 days ago',
    category: 'Travel',
    tags: ['Travel', 'Mountains', 'Drone', '4K', 'Adventure'],
    channel: INITIAL_CHANNELS[1],
    comments: [
      {
        id: 'c-4',
        author: 'Rohan Mehra',
        authorHandle: '@rohan_wander',
        authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        text: 'The water color looks unbelievable! Pure peace watching this after a stressful work week. 🏔️✨',
        createdAt: '3 days ago',
        likes: 67,
        isLiked: false,
      },
      {
        id: 'c-5',
        author: 'Priya Kapoor',
        authorHandle: '@priya_k',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        text: 'The background music harmonizes so nicely with the drone pan shots. Masterpiece work!',
        createdAt: '2 days ago',
        likes: 28,
        isLiked: false,
      }
    ]
  },
  {
    id: 'vid-3',
    type: 'long',
    title: 'Authentic Wood-Fired Neapolitan Pizza Recipe from Scratch | Step by Step',
    description: `Pizza lovers ke liye khushkhabri! Is video me hum banayenge authentic Neapolitan pizza jisme crust me perfect leopard spots aayenge aur cheese melt bilkul restaurant jesa hoga.

Ingredients:
- 00 Flour (Caputo): 500g
- Warm water: 325ml (65% hydration)
- Active dry yeast: 3g
- Sea salt: 12g
- San Marzano tomatoes, fresh buffalo mozzarella, fresh basil & extra virgin olive oil.

Step by step follow karein aur ghar pe banayein world-class pizza! Agar recipe achi lage to video ko like karein aur apne food lover dosto ke sath share karein.

#Pizza #Recipe #Cooking #ChefKabir #Foodie`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: cookingThumb,
    duration: '18:50',
    durationSeconds: 1130,
    views: 212900,
    likes: 16800,
    dislikes: 95,
    isLiked: false,
    createdAt: '1 week ago',
    category: 'Cooking',
    tags: ['Pizza', 'Food', 'Cooking', 'Recipe', 'Italian'],
    channel: INITIAL_CHANNELS[2],
    comments: [
      {
        id: 'c-6',
        author: 'Neha Gupta',
        authorHandle: '@neha_cooks',
        authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
        text: 'Chef sir kal maine ye banaya tha aur meri family ko bohot zyada pasand aaya! Thank you for the secret dough tips ❤️',
        createdAt: '4 days ago',
        likes: 54,
        isLiked: false,
      }
    ]
  },
  // SHORTS
  {
    id: 'short-1',
    type: 'short',
    title: '5 Hidden Windows 11 Shortcuts You Never Knew Existed! ⚡',
    description: `Supercharge your productivity with these 5 insane Windows 11 keyboard shortcuts! Win + V for clipboard history, Win + Shift + S for smart crop. Subscribe for daily tech tips! #Shorts #TechHacks #Windows11`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    duration: '0:45',
    durationSeconds: 45,
    views: 942000,
    likes: 67400,
    dislikes: 410,
    isLiked: false,
    createdAt: '3 days ago',
    category: 'Technology',
    tags: ['Shorts', 'Windows', 'Hacks'],
    channel: INITIAL_CHANNELS[0],
    comments: [
      {
        id: 'sc-1',
        author: 'Sameer Khan',
        authorHandle: '@sameer_k',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Win + V was literally a life changer for me bro! 👏',
        createdAt: '2 days ago',
        likes: 312,
        isLiked: false,
      },
      {
        id: 'sc-2',
        author: 'Aarav Patel',
        authorHandle: '@aarav_p',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'Next short Mac OS ke shortcuts par lao please!',
        createdAt: '1 day ago',
        likes: 89,
        isLiked: false,
      }
    ]
  },
  {
    id: 'short-2',
    type: 'short',
    title: 'POV: Waking up in a Glass Cabin deep in the Swiss Alps 🏔️☕',
    description: `Would you stay here alone for 1 month for 10 Lakh rupees? Listen to that alpine breeze! Subscribe to Wanderlust Diaries for more dream destinations. #Shorts #Switzerland #TravelVlog #Alps`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    duration: '0:32',
    durationSeconds: 32,
    views: 1850000,
    likes: 142000,
    dislikes: 920,
    isLiked: true,
    createdAt: '4 days ago',
    category: 'Travel',
    tags: ['Shorts', 'Swiss', 'Alps', 'Travel'],
    channel: INITIAL_CHANNELS[1],
    comments: [
      {
        id: 'sc-3',
        author: 'Kavita Roy',
        authorHandle: '@kavita_r',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'I would stay there for free forever! What a dream view ❤️',
        createdAt: '3 days ago',
        likes: 420,
        isLiked: false,
      }
    ]
  },
  {
    id: 'short-3',
    type: 'short',
    title: 'The Satisfying Cheese Pull You Have Been Waiting For! 🧀🤤',
    description: `Triple blend mozzarella + smoked provolone + cheddar stretch! Sound on for that crunch crust. Like and subscribe for more delicious bites! #Shorts #FoodPorn #CheesePull #Pizza`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    duration: '0:24',
    durationSeconds: 24,
    views: 654000,
    likes: 58200,
    dislikes: 210,
    isLiked: false,
    createdAt: '1 day ago',
    category: 'Cooking',
    tags: ['Shorts', 'Cheese', 'Food'],
    channel: INITIAL_CHANNELS[2],
    comments: [
      {
        id: 'sc-4',
        author: 'Deepak Joshi',
        authorHandle: '@deepak_j',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: 'Raat ke 2 baje ye dekh ke bhook lag gayi yaar! 😂🔥',
        createdAt: '18 hours ago',
        likes: 180,
        isLiked: false,
      }
    ]
  }
];

export const CURRENT_USER: Channel = {
  id: 'my-channel-user',
  name: 'Aapka Channel',
  handle: '@AapkaChannel',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
  subscribers: 1250,
  isSubscribed: false,
  description: 'Creator on VidFlow. Sharing tutorials, daily shorts, and tech insights.',
  joinedDate: 'Oct 2026',
  verified: true,
};
