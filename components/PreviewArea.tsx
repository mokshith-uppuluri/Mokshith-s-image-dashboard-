import React, { useEffect, useRef, useState } from 'react';
import { BlurType } from '../types';
import { processImage } from '../services/imageProcessing';
import { Download, RefreshCw } from 'lucide-react';
import Button from './Button';
import { CARD_BG } from '../constants';

interface PreviewAreaProps {
  originalFile: File | null;
  blurType: BlurType;
  intensity: number;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ originalFile, blurType, intensity }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image from file
  useEffect(() => {
    if (!originalFile) return;

    const img = new Image();
    const url = URL.createObjectURL(originalFile);
    img.src = url;
    img.onload = () => {
      setImage(img);
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [originalFile]);

  // Process image when params change
  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const process = () => {
      setIsProcessing(true);
      // Use requestAnimationFrame to avoid blocking UI immediately
      requestAnimationFrame(() => {
        if (canvasRef.current && image) {
            // Internal resizing logic for performance
            const maxDim = 1200;
            let w = image.width;
            let h = image.height;
            
            if (w > maxDim || h > maxDim) {
                const ratio = Math.min(maxDim / w, maxDim / h);
                w *= ratio;
                h *= ratio;
            }

            canvasRef.current.width = w;
            canvasRef.current.height = h;

            processImage(canvasRef.current, image, blurType, intensity);
            setProcessedUrl(canvasRef.current.toDataURL());
            setIsProcessing(false);
        }
      });
    };

    // Debounce processing
    const timer = setTimeout(process, 100);
    return () => clearTimeout(timer);

  }, [image, blurType, intensity]);

  const handleDownload = () => {
    if (!processedUrl || !originalFile) return;
    
    // Create full res download
    const link = document.createElement('a');
    if (image) {
        const fullCanvas = document.createElement('canvas');
        processImage(fullCanvas, image, blurType, intensity);
        link.href = fullCanvas.toDataURL('image/png');
    } else {
        link.href = processedUrl;
    }

    link.download = `blurred_${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!originalFile || !image) {
    return (
      <div className={`h-full flex flex-col items-center justify-center text-slate-400 rounded-2xl border-2 border-dashed border-slate-200 ${CARD_BG} min-h-[400px]`}>
        <p>No image uploaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Viewport - Darker grey to contrast with the image */}
      <div 
        ref={containerRef}
        className={`relative flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner min-h-[400px] flex items-center justify-center`}
      >
        <div className="relative w-full h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Original */}
            <div className="flex-1 relative group overflow-hidden flex items-center justify-center p-4">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-700 text-xs font-medium px-2 py-1 rounded shadow-sm border border-slate-200 z-10">
                    Original
                </div>
                <img 
                    src={image.src} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                />
            </div>
            
            {/* Processed */}
            <div className="flex-1 relative group overflow-hidden flex items-center justify-center p-4">
                 <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded shadow-sm border border-blue-500 z-10 flex items-center gap-2">
                    {isProcessing && <RefreshCw className="w-3 h-3 animate-spin" />}
                    Preview
                </div>
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                />
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`p-4 rounded-xl flex items-center justify-between ${CARD_BG}`}>
        <div className="text-sm text-slate-500">
            <span className="text-slate-900 font-medium">{image.naturalWidth} x {image.naturalHeight}px</span>
            <span className="mx-2">•</span>
            <span>{(originalFile.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download Processed Image
        </Button>
      </div>
    </div>
  );
};

export default PreviewArea;