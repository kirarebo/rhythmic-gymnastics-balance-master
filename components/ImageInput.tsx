import React, { ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageState } from '../types';

interface ImageInputProps {
  label: string;
  imageState: ImageState;
  onChange: (file: File | null, preview: string | null, base64: string | null) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ label, imageState, onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(file, url, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange(null, null, null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{label}</span>
      
      {!imageState.previewUrl ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all group relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="mb-1 text-sm text-slate-500 font-medium">Click to upload image</p>
            <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
          <img 
            src={imageState.previewUrl} 
            alt={label} 
            className="w-full h-full object-contain bg-slate-900" 
          />
          <button 
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
