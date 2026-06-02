import React, { useState, useRef, DragEvent } from 'react';
import { Upload, Video as VideoIcon, Loader2, AlertCircle, Check, X, Film } from 'lucide-react';

interface VideoUploadWidgetProps {
  id: string;
  value: string;
  onChange: (url: string) => void;
  onDurationLoaded?: (duration: string) => void;
  label?: string;
  placeholder?: string;
}

export function VideoUploadWidget({
  id,
  value,
  onChange,
  onDurationLoaded,
  label = "Upload Video File or YouTube ID/URL",
  placeholder = "e.g. dQw4w9WgXcQ or /uploads/video.mp4"
}: VideoUploadWidgetProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
1
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setUploadError("Invalid file type. Please upload a valid video (MP4, WebM, OGG, MOV, etc.).");
      return;
    }

    // A limit check to alert if a file is too massive (e.g. > 150MB)
    if (file.size > 150 * 1024 * 1024) {
      setUploadError("The file is too large (> 150MB). Please select a compressed 1.5 min video.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Calculate video duration locally before uploading
      try {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(file);
        videoElement.onloadedmetadata = () => {
          URL.revokeObjectURL(videoElement.src);
          const minutes = Math.floor(videoElement.duration / 60);
          const seconds = Math.floor(videoElement.duration % 60);
          const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          if (onDurationLoaded) {
            onDurationLoaded(formattedDuration);
          }
        };
      } catch (err) {
        console.warn("Failed to extract video duration metadata locally:", err);
      }

      // Convert video file to Base64
      const reader = new FileReader();
      const fileLoadedPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to parse video file to buffer"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      const base64Data = await fileLoadedPromise;

      // Post base64 data to backend upload api
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          base64Data
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Server rejected the video file upload package");
      }

      onChange(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("Video Upload error:", err);
      setUploadError(err.message || "Something went wrong uploading video to backend server");
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    onChange('');
    setUploadError(null);
  };

  const handleZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    triggerFileSelect();
  };

  const isLocalUpload = value.startsWith('/uploads/');

  return (
    <div className="space-y-2 mt-1">
      {label && (
        <label htmlFor={id} className="text-[10px] text-zinc-400 font-mono uppercase font-bold tracking-wider block">
          {label}
        </label>
      )}

      {/* Drag & Drop Upload Space */}
      <div 
        id={`${id}-upload-zone`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleZoneClick}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col md:flex-row gap-4 items-center justify-between cursor-pointer group/zone ${
          isDragActive 
            ? 'border-[#D4AF37] bg-yellow-500/5 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
            : 'border-white/10 bg-black/30 hover:border-[#8A2BE2]/40 hover:bg-[#8A2BE2]/5'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file"
          id={id}
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-3 w-full md:w-auto">
          {value ? (
            <div className="relative group/thumb w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 flex-shrink-0 shadow-lg flex items-center justify-center">
              <Film className="w-6 h-6 text-[#D4AF37]" />
              <button
                type="button"
                id={`${id}-clear-vbtn`}
                onClick={clearVideo}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300"
                title="Clear Video"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl border border-white/5 bg-zinc-900 flex items-center justify-center text-zinc-600 flex-shrink-0">
              <VideoIcon size={22} className="opacity-60" />
            </div>
          )}

          <div className="text-left">
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                <Loader2 size={14} className="animate-spin text-[#D4AF37]" />
                <span>Uploading direct video stream file...</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Check size={14} />
                <span>Video stream linked successfully!</span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">
                  {isLocalUpload ? "Local Video Linked" : value ? "YouTube ID Linked" : "Upload Video from Gallery"}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Drag and drop 1.5+ minute video files or click browser path
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id={`${id}-select-vbtn`}
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-[#8A2BE2]/10 hover:bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 rounded-xl text-xs text-purple-300 font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Upload size={13} />
            Browse Gallery
          </button>
        </div>
      </div>

      {/* Direct Input for YouTube Embedded ID or Custom Url */}
      <div className="space-y-1">
        <span className="text-[9px] text-zinc-500 font-mono block">OR LINK / YOUTUBE ID MANUALLY:</span>
        <input
          type="text"
          id={`${id}-vid-input`}
          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {uploadError && (
        <div className="flex items-start gap-2 bg-red-950/20 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-xs">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
