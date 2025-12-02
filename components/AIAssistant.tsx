import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { getBlurSuggestion } from '../services/geminiService';
import { AISuggestion } from '../types';
import Button from './Button';
import { CARD_BG } from '../constants';

interface AIAssistantProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onApplySuggestion }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const result = await getBlurSuggestion(prompt);
      setSuggestion(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl flex flex-col ${CARD_BG}`}>
      <div className="flex items-center gap-2 mb-3 text-blue-600">
        <Sparkles className="w-5 h-5" />
        <h2 className="text-md font-semibold text-slate-900">AI Assistant</h2>
      </div>

      <div className="flex-1 flex flex-col">
        {!suggestion ? (
          <>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Describe your goal (e.g., "Hide sensitive text" or "Artistic motion") and I'll suggest the best settings.
            </p>
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="I want to blur..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-16 mb-2 transition-all focus:bg-white"
                />
                <Button 
                  type="submit" 
                  disabled={!prompt.trim()} 
                  isLoading={isLoading}
                  className="w-full text-sm py-2"
                >
                  Get Suggestions
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="animate-fade-in">
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
               <div className="flex items-start gap-3">
                 <div className="bg-blue-600 p-1.5 rounded-lg mt-0.5">
                   <MessageSquare className="w-3.5 h-3.5 text-white" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-blue-800 text-xs mb-1">Recommendation</h3>
                   <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3">
                     {suggestion.reasoning}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-blue-700 bg-blue-100/50 p-1.5 rounded-lg border border-blue-200">
                     <span>Type: <span className="font-bold">{suggestion.blurType}</span></span>
                     <span className="w-px h-2 bg-blue-300"></span>
                     <span>Level: <span className="font-bold">{suggestion.intensity}</span></span>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2 mt-auto">
               <Button 
                variant="secondary" 
                onClick={() => setSuggestion(null)}
                className="text-xs py-1.5 px-2"
              >
                 Cancel
               </Button>
               <Button 
                onClick={() => {
                  onApplySuggestion(suggestion);
                  setSuggestion(null);
                  setPrompt('');
                }}
                className="text-xs py-1.5 px-2"
              >
                 Apply <ArrowRight className="w-3 h-3 ml-1" />
               </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;