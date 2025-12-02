import React from 'react';
import { BlurType } from '../types';
import { MIN_INTENSITY, MAX_INTENSITY, CARD_BG } from '../constants';
import { Settings2, Zap, Box, Activity } from 'lucide-react';

interface BlurControlsProps {
  blurType: BlurType;
  setBlurType: (type: BlurType) => void;
  intensity: number;
  setIntensity: (val: number) => void;
}

const BlurControls: React.FC<BlurControlsProps> = ({
  blurType,
  setBlurType,
  intensity,
  setIntensity
}) => {
  
  const getIcon = (type: BlurType) => {
    switch (type) {
      case BlurType.GAUSSIAN: return <Activity className="w-4 h-4" />;
      case BlurType.MOTION: return <Zap className="w-4 h-4" />;
      case BlurType.BOX: return <Box className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-6 rounded-2xl ${CARD_BG}`}>
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Processing Controls</h2>
      </div>

      {/* Blur Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-3">Blur Algorithm</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(BlurType).map((type) => (
            <button
              key={type}
              onClick={() => setBlurType(type)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                blurType === type
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="mb-2 opacity-90">{getIcon(type)}</div>
              <span className="text-xs font-medium">{type.replace(' Blur', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <label className="text-sm font-medium text-slate-700">Intensity Level</label>
          <span className="text-2xl font-bold text-blue-600">{intensity}</span>
        </div>
        
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={MIN_INTENSITY}
            max={MAX_INTENSITY}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>Subtle</span>
          <span>Moderate</span>
          <span>Strong</span>
        </div>
      </div>
    </div>
  );
};

export default BlurControls;