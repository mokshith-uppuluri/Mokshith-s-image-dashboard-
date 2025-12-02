import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { CARD_BG } from '../constants';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert("Please upload a valid image file (JPG, PNG, JPEG)");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
      } ${CARD_BG}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-slate-900">Upload an Image</h3>
      <p className="text-slate-500 text-sm mb-4 text-center max-w-xs">
        Drag and drop your image here, or click to browse files
      </p>
      <div className="flex gap-2 text-xs text-slate-500 uppercase tracking-wider">
        <span className="bg-slate-100 px-2 py-1 rounded">JPG</span>
        <span className="bg-slate-100 px-2 py-1 rounded">PNG</span>
        <span className="bg-slate-100 px-2 py-1 rounded">JPEG</span>
      </div>
    </div>
  );
};

export default ImageUploader;