import React, { useState, useRef, DragEvent } from 'react';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Check, X } from 'lucide-react';

interface ImageUploadWidgetProps {
  id: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploadWidget({
  id,
  value,
  onChange,
  label = "Upload Image File or Provide URL",
  placeholder = "https://images.unsplash.com/photo-..."
}: ImageUploadWidgetProps) {
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File, maxWidth = 1400, maxHeight = 1400, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      // GIFs should skip compression as Canvas doesn't preserve animated GIF frames
      if (file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to process GIF file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Downscale proportionally if too large
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Render image onto canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Standardize on image/jpeg for powerful compression controls
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => {
          // Fallback to uploading non-compressed version if rendering fails
          const fallbackReader = new FileReader();
          fallbackReader.onloadend = () => {
            if (typeof fallbackReader.result === 'string') {
              resolve(fallbackReader.result);
            } else {
              reject(new Error("Failed to load image in browser context"));
            }
          };
          fallbackReader.readAsDataURL(file);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to load file source stream"));
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError("Invalid file type. Please upload an image (PNG, JPG, WEBP, GIF, etc.).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Compress in-browser first to guarantee ultra-fast transfer speeds
      const base64Data = await compressImage(file);

      // Post compressed/optimized base64 data to backend
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name.replace(/\.[^/.]+$/, "") + ".jpg", // adjust ext
          base64Data
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Server rejected the upload file package");
      }

      onChange(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Something went wrong uploading files to server database");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setUploadError(null);
  };

  const handleZoneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    triggerFileSelect();
  };

  return (
    <div className="space-y-2 mt-1">
      {label && (
        <label htmlFor={id} className="text-[10px] text-zinc-400 font-mono uppercase font-bold tracking-wider block">
          {label}
        </label>
      )}

      {/* Main Drag & Drop Zone */}
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
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Left Side: Thumbnail Preview */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {value ? (
            <div className="relative group/thumb w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 flex-shrink-0 shadow-lg">
              <img 
                src={value} 
                alt="Upload preview" 
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                id={`${id}-clear-btn`}
                onClick={clearImage}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300"
                title="Clear Image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl border border-white/5 bg-zinc-900 flex items-center justify-center text-zinc-600 flex-shrink-0">
              <ImageIcon size={22} className="opacity-60" />
            </div>
          )}

          <div className="text-left">
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                <Loader2 size={14} className="animate-spin text-[#D4AF37]" />
                <span>Uploading image file...</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Check size={14} />
                <span>Image loaded successfully!</span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">
                  {value ? "Local Image Linked" : "Add Image File"}
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  Drag and drop image here or click file system
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id={`${id}-select-btn`}
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-[#8A2BE2]/10 hover:bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 rounded-xl text-xs text-purple-300 font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Upload size={13} />
            Browse Image
          </button>
        </div>
      </div>

      {/* Manual Input for Direct URL String Option */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-zinc-500 font-mono">OR PASTE EXTERNAL URL MANUALLY:</span>
          {value && (
            <span className="text-[8px] text-zinc-400 font-mono max-w-[150px] truncate bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
              Ref: {value.substring(0, 30)}...
            </span>
          )}
        </div>
        <input
          type="text"
          id={`${id}-url-input`}
          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50 font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {/* Error Alert panel */}
      {uploadError && (
        <div className="flex items-start gap-2 bg-red-950/20 border border-red-500/20 text-red-400 p-2.5 rounded-xl text-xs">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
