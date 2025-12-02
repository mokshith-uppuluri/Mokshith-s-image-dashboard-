export enum BlurType {
  GAUSSIAN = 'Gaussian Blur',
  MOTION = 'Motion Blur',
  BOX = 'Box Blur'
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface AISuggestion {
  blurType: BlurType;
  intensity: number;
  reasoning: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number; // 0 to 100
}

export interface HistogramData {
  name: string;
  original: number;
  blurred: number;
}
