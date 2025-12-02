import { GoogleGenAI, Type } from "@google/genai";
import { BlurType, AISuggestion } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const getBlurSuggestion = async (userPrompt: string): Promise<AISuggestion> => {
  try {
    const ai = getClient();
    
    // We use gemini-2.5-flash for speed and efficiency
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `User requirement for image blurring: "${userPrompt}". 
      Analyze the request and suggest the best blur algorithm (Gaussian, Motion, or Box) and an intensity level (1-30).
      
      Guidelines:
      - Gaussian: Good for privacy, smoothing, general defocus.
      - Motion: Good for artistic movement, speed effects.
      - Box: Good for retro/pixelated aesthetic or heavy obfuscation.
      
      Provide a helpful reasoning tip.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blurType: {
              type: Type.STRING,
              enum: [BlurType.GAUSSIAN, BlurType.MOTION, BlurType.BOX],
              description: "The recommended blur algorithm."
            },
            intensity: {
              type: Type.NUMBER,
              description: "Recommended intensity between 1 and 30."
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of why this setting was chosen."
            }
          },
          required: ["blurType", "intensity", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AISuggestion;
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    return {
      blurType: BlurType.GAUSSIAN,
      intensity: 5,
      reasoning: "Unable to connect to AI. Defaulting to standard Gaussian blur."
    };
  }
};
