import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { validateAndProcessFileUpload } from '../lib/fileUpload';

interface ImageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  currentImageUrl?: string;
  onSaveImage: (newUrl: string) => void;
}

// Preset Hardware & Engineering Sample Photos
const SAMPLE_HARDWARE_IMAGES = [
  {
    name: 'ESP32 MCU Board',
    category: 'Microcontrollers',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Arduino Uno MCU',
    category: 'Microcontrollers',
    url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gas & Air Sensor',
    category: 'Sensors',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Temperature Sensor',
    category: 'Sensors',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Robotic Arm / Actuator',
    category: 'Robotics',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Electronics Circuit Board',
    category: 'Circuitry',
    url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Smart IoT Gateway',
    category: 'IoT',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'OLED Display Module',
    category: 'Displays',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  },
];

export const ImageChangeModal: React.FC<ImageChangeModalProps> = ({
  isOpen,
  onClose,
  title = 'Change & Customize Photo',
  currentImageUrl = '',
  onSaveImage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState<string>(currentImageUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);

    try {
      const result = await validateAndProcessFileUpload(file, { maxSizeMb: 5 });
      if (result.success && result.dataUrl) {
        setPreviewUrl(result.dataUrl);
        setImageUrlInput(result.dataUrl);
      } else {
        setUploadError(result.error || 'Failed to process selected file.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'An unexpected error occurred uploading file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);

    try {
      const result = await validateAndProcessFileUpload(file, { maxSizeMb: 5 });
      if (result.success && result.dataUrl) {
        setPreviewUrl(result.dataUrl);
        setImageUrlInput(result.dataUrl);
      } else {
        setUploadError(result.error || 'Failed to process dropped image.');
      }
    } catch (err: any) {
      setUploadError('Failed to upload image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setPreviewUrl(imageUrlInput.trim());
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    setImageUrlInput(url);
  };

  const handleSave = () => {
    if (!previewUrl.trim()) {
      setUploadError('Please select or upload a valid image before saving.');
      return;
    }
    onSaveImage(previewUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
              <p className="text-xs text-slate-400">Upload a device photo, enter a web link, or choose a preset.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 pt-2 space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device File</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'url'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image Web Link</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-3.5 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'presets'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-t-lg'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hardware Gallery</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* Error Banner */}
          {uploadError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Tab 1: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
                    : 'border-slate-700 bg-slate-950/50 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Drag & drop photo here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WebP, GIF, SVG up to 5MB</p>
                </div>

                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Local Photo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3 text-xs">
              <label className="block text-slate-300 font-bold">Image Web Address (URL)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or image link"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700"
                >
                  Preview
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Presets Gallery */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Click any high-resolution stock hardware image to use:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_HARDWARE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(img.url)}
                    className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                      previewUrl === img.url
                        ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-16 object-cover rounded-lg bg-slate-900 group-hover:scale-105 transition-transform"
                    />
                    <div className="mt-1">
                      <p className="text-[10px] font-bold text-white line-clamp-1">{img.name}</p>
                      <p className="text-[9px] text-slate-400">{img.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          {previewUrl && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center space-x-1 text-blue-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected Image Preview</span>
                </span>
                <span className="text-[10px] text-slate-500">Live Render</span>
              </div>
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => {
                    setUploadError('Failed to load image from given link. Check URL format.');
                  }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end space-x-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || !previewUrl}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Apply New Photo</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
