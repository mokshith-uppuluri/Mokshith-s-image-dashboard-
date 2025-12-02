import { BlurType } from '../types';

// Helper to get image data from canvas
const getImageData = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  return ctx.getImageData(0, 0, width, height);
};

// Gaussian Blur using native canvas filter (most performant)
export const applyGaussianBlur = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  intensity: number
) => {
  ctx.clearRect(0, 0, width, height);
  ctx.filter = `blur(${intensity}px)`;
  ctx.drawImage(image, 0, 0, width, height);
  ctx.filter = 'none'; // Reset
};

// Box Blur Implementation
// This is a simplified approximate box blur for performance in JS
export const applyBoxBlur = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  intensity: number
) => {
  // Draw original first
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  if (intensity < 1) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const radius = Math.floor(intensity);
  
  // Create a copy to read from
  const sourceData = new Uint8ClampedArray(data);

  const w = width;
  const h = height;
  
  // Horizontal pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;

      for (let k = -radius; k <= radius; k++) {
        const px = Math.min(w - 1, Math.max(0, x + k));
        const idx = (y * w + px) * 4;
        r += sourceData[idx];
        g += sourceData[idx + 1];
        b += sourceData[idx + 2];
        a += sourceData[idx + 3];
        count++;
      }

      const idx = (y * w + x) * 4;
      data[idx] = r / count;
      data[idx + 1] = g / count;
      data[idx + 2] = b / count;
      data[idx + 3] = a / count;
    }
  }

  // Vertical pass would strictly make it a full box blur, but for "Box" look 
  // sometimes just one dimension or a simple average is enough. 
  // To keep it responsive, we'll do a simplified single-pass average logic 
  // or a second pass. Let's do a second pass for quality.
  
  const hSourceData = new Uint8ClampedArray(data);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;

      for (let k = -radius; k <= radius; k++) {
        const py = Math.min(h - 1, Math.max(0, y + k));
        const idx = (py * w + x) * 4;
        r += hSourceData[idx];
        g += hSourceData[idx + 1];
        b += hSourceData[idx + 2];
        a += hSourceData[idx + 3];
        count++;
      }

      const idx = (y * w + x) * 4;
      data[idx] = r / count;
      data[idx + 1] = g / count;
      data[idx + 2] = b / count;
      data[idx + 3] = a / count;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

// Motion Blur Implementation
export const applyMotionBlur = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  intensity: number
) => {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  if (intensity < 1) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const sourceData = new Uint8ClampedArray(data);
  const w = width;
  const h = height;
  
  // Limit max intensity for JS performance
  const range = Math.min(intensity * 2, 50); 
  // 0 degrees (Horizontal motion)
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;

      for (let k = 0; k < range; k++) {
        const px = Math.min(w - 1, x + k); // Look ahead
        const idx = (y * w + px) * 4;
        
        r += sourceData[idx];
        g += sourceData[idx + 1];
        b += sourceData[idx + 2];
        a += sourceData[idx + 3];
        count++;
      }

      const idx = (y * w + x) * 4;
      data[idx] = r / count;
      data[idx + 1] = g / count;
      data[idx + 2] = b / count;
      data[idx + 3] = a / count;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const processImage = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  type: BlurType,
  intensity: number
) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Set canvas size to match image
  canvas.width = image.width;
  canvas.height = image.height;

  switch (type) {
    case BlurType.GAUSSIAN:
      applyGaussianBlur(ctx, image, canvas.width, canvas.height, intensity);
      break;
    case BlurType.BOX:
      applyBoxBlur(ctx, image, canvas.width, canvas.height, intensity);
      break;
    case BlurType.MOTION:
      applyMotionBlur(ctx, image, canvas.width, canvas.height, intensity);
      break;
  }
};
