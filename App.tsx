import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import BlurControls from './components/BlurControls';
import AIAssistant from './components/AIAssistant';
import PreviewArea from './components/PreviewArea';
import Histogram from './components/Histogram';
import { BlurType, AISuggestion } from './types';
import { DEFAULT_INTENSITY, DEFAULT_BLUR_TYPE, THEME_GRADIENT } from './constants';
import { Layers } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [blurType, setBlurType] = useState<BlurType>(DEFAULT_BLUR_TYPE);
  const [intensity, setIntensity] = useState<number>(DEFAULT_INTENSITY);

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setBlurType(suggestion.blurType);
    setIntensity(suggestion.intensity);
  };

  return (
    <div className={`min-h-screen ${THEME_GRADIENT} text-slate-900 selection:bg-blue-200 selection:text-blue-900`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Image Dashboard</h1>
            <p className="text-slate-500 text-sm">Professional AI-Enhanced Image Processing</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <ImageUploader onImageSelect={setFile} />
            
            <BlurControls 
              blurType={blurType}
              setBlurType={setBlurType}
              intensity={intensity}
              setIntensity={setIntensity}
            />

            <AIAssistant onApplySuggestion={handleApplySuggestion} />
            
            {/* Visual Flair: Histogram (Only show if file exists) */}
            {file && <Histogram />}
          </div>

          {/* Main Area - Preview */}
          <div className="lg:col-span-8 h-[calc(100vh-12rem)] min-h-[600px]">
            <PreviewArea 
              originalFile={file}
              blurType={blurType}
              intensity={intensity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;