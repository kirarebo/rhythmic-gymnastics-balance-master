
import React, { ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageState } from './types';

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
      <span className="font-semibold text-slate-700 text-sm">{label}</span>
      {!imageState.previewUrl ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50 transition-colors">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">クリックして画像を選択</p>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border bg-slate-100">
          <img src={imageState.previewUrl} alt={label} className="w-full h-full object-contain" />
          <button onClick={clearImage} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
