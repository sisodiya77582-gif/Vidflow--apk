import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Film, 
  Flame, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  FileVideo,
  Play
} from 'lucide-react';
import { useVideo } from '../context/VideoContext';
import { VideoType } from '../types';

interface PresetVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: VideoType;
  category: string;
  duration: string;
}

const PRESET_LIBRARY: PresetVideo[] = [
  {
    title: 'Ultimate 2026 Full-Stack Web Development Roadmap',
    description: `Complete guide on becoming a modern full-stack developer in 2026. Topics covered: React 19, TypeScript, Cloud deployments, and AI tools.

Timestamps:
00:00 - Introduction
02:15 - Frontend Fundamentals
06:30 - Backend & Cloud Integrations
09:45 - AI Tools & Workflow

Subscribe for weekly tech guides!`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    type: 'long',
    category: 'Technology',
    duration: '11:20'
  },
  {
    title: '15-Minute Easy Garlic Butter Butter Chicken Recipe',
    description: `Restaurant-style butter chicken at home in under 15 minutes! Creamy gravy, tender marinated chicken, and smoky aroma.

Ingredients:
- Chicken breast: 400g
- Butter & Cream: 50g each
- Fresh tomato puree: 2 cups
- Spices: Kasuri methi, garam masala, kashmiri mirch

Share with your food enthusiast friends!`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&auto=format&fit=crop&q=80',
    type: 'long',
    category: 'Cooking',
    duration: '08:45'
  },
  {
    title: 'Mind-Blowing 3-Second Phone Photography Hack! 📸',
    description: `Turn your normal mobile camera into a DSLR with this 1 setting change in grid and exposure lock. Like and Subscribe for daily camera tricks! #Shorts #PhotoHack #MobileCamera`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    category: 'Technology',
    duration: '0:28'
  },
  {
    title: 'Crispy Korean Fried Street Dumplings in Seoul 🥟🔥',
    description: `Crispiest dumpling crunch in Myeongdong night market! Would you try this spicy chili dip? #Shorts #KoreanFood #StreetFood #Seoul`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80',
    type: 'short',
    category: 'Cooking',
    duration: '0:35'
  }
];

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadVideo } = useVideo();

  const [videoType, setVideoType] = useState<VideoType>('long');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('Tech, Hindi, New');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);

    // Auto-fill title from filename if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Try to capture a thumbnail from the uploaded video
    const tempVideo = document.createElement('video');
    tempVideo.src = objectUrl;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.currentTime = 1;
    tempVideo.onloadeddata = () => {
      // detect aspect ratio: if height > width, suggest shorts
      if (tempVideo.videoHeight > tempVideo.videoWidth) {
        setVideoType('short');
      }
    };
    tempVideo.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = tempVideo.videoWidth || 640;
        canvas.height = tempVideo.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
          const thumb = canvas.toDataURL('image/jpeg');
          setThumbnailUrl(thumb);
        }
      } catch {
        // Fallback default
      }
    };
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnailUrl(objectUrl);
  };

  const handleSelectPreset = (preset: PresetVideo) => {
    setVideoType(preset.type);
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setVideoUrl(preset.videoUrl);
    setThumbnailUrl(preset.thumbnailUrl);
    setSelectedFile(null);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a video title (Title likhna zaroori he)');
      return;
    }
    if (!videoUrl) {
      setErrorMessage('Please select a video file or choose from the presets');
      return;
    }

    setErrorMessage('');
    setIsUploading(true);

    // Simulated fast progressive upload
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          uploadVideo({
            type: videoType,
            title: title.trim(),
            description: description.trim() || 'Uploaded via VidFlow Creator Studio.',
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl || (videoType === 'short' 
              ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80'),
            category: category,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            duration: videoType === 'short' ? '0:35' : '12:00'
          });
          setIsUploading(false);
          setIsUploadModalOpen(false);
        }, 400);
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Upload Video / Create Video
            </h2>
            <p className="text-xs text-zinc-400">
              Long video ya Shorts upload karein, Title aur Description set karein
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePublish} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Type Selector: Long Video vs Shorts */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Choose Video Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVideoType('long')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  videoType === 'long'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${videoType === 'long' ? 'bg-red-600 text-white' : 'bg-zinc-800'}`}>
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Long Video</div>
                  <div className="text-[11px] text-zinc-400">Landscape (16:9) Standard Video</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVideoType('short')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  videoType === 'short'
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${videoType === 'short' ? 'bg-red-600 text-white' : 'bg-zinc-800'}`}>
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Shorts Video</div>
                  <div className="text-[11px] text-zinc-400">Vertical (9:16) Quick Reel</div>
                </div>
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Select Video File (Apna Video Choose Karein)
            </label>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-zinc-950/40 hover:bg-zinc-950/80"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-zinc-800 text-red-500 mx-auto flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">
                {selectedFile ? selectedFile.name : 'Click to browse MP4, WebM or MOV video'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Drag and drop your video file here, or choose from ready sample presets below
              </p>
            </div>
          </div>

          {/* Preset Samples Picker for Instant 1-Click Testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Or Select Ready High-Definition Preset</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_LIBRARY.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all text-left ${
                    videoUrl === preset.videoUrl
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-1.5">
                    <img 
                      src={preset.thumbnailUrl} 
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-mono">
                      {preset.type === 'short' ? 'Short' : preset.duration}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-medium text-zinc-200 line-clamp-1">{preset.title}</h4>
                  <span className="text-[10px] text-zinc-500">{preset.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Title Input ("taital de ske") */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Title / Taital <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. My Amazing Video | Tips, Tricks & Review in Hindi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Description Input ("description De sake") */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Description / Vivaran
              </label>
              <span className="text-[11px] text-zinc-500">
                Timestamps, links, and hashtags supported
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Video ke baare me detail likhein (e.g. In this video we explore...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              >
                <option value="Technology">Technology</option>
                <option value="Travel">Travel &amp; Nature</option>
                <option value="Cooking">Cooking &amp; Food</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Music">Music</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tags (Separated by commas)
              </label>
              <input
                type="text"
                placeholder="tech, review, hindi, 2026"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Thumbnail Preview / Upload */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300">
                Thumbnail
              </label>
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Custom Thumbnail</span>
              </button>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbSelect}
                className="hidden"
              />
            </div>

            {thumbnailUrl ? (
              <div className="relative aspect-video w-48 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  Selected
                </span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                Auto-generated from video or standard platform default will be applied.
              </p>
            )}
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between text-xs text-zinc-300">
                <span>Publishing to VidFlow...</span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{videoType === 'short' ? 'Publish Short' : 'Publish Long Video'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
