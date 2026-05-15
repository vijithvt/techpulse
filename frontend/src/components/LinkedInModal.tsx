import React, { useState, useEffect } from 'react';
import { X, Copy, RotateCcw, Check, Loader2, Sparkles } from 'lucide-react';

interface LinkedInModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    description: string;
    topics: string[];
    source: string;
  };
}

type Mode = 'Simple' | 'Developer' | 'Architect';

export function LinkedInModal({ isOpen, onClose, article }: LinkedInModalProps) {
  const [mode, setMode] = useState<Mode>('Architect');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [isShortVersion, setIsShortVersion] = useState(false);

  const generatePost = async (currentMode: Mode = mode) => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/linkedin/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          topics: article.topics,
          mode: currentMode,
          includeHashtags,
          isShortVersion
        }),
      });

      if (!response.ok) throw new Error('Failed to generate post');
      
      const data = await response.json();
      setGeneratedPost(data.post);
    } catch (err) {
      setError('System unavailable. Please try again later.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && !generatedPost) {
      generatePost();
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const charCount = generatedPost.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="h-full w-full max-w-lg border-l border-[#1F2933] bg-[#0D1117] p-6 shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/10 text-[#3B82F6]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">LinkedIn Post Generator</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-[#9AA4AF] hover:bg-[#1F2933] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#9AA4AF]">
                Generation Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isShortVersion} 
                    onChange={(e) => setIsShortVersion(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-7 h-4 rounded-full transition-colors relative ${isShortVersion ? 'bg-[#3B82F6]' : 'bg-[#30363D]'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isShortVersion ? 'translate-x-3' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[#9AA4AF] group-hover:text-white transition-colors">SHORT</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={includeHashtags} 
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-7 h-4 rounded-full transition-colors relative ${includeHashtags ? 'bg-[#3B82F6]' : 'bg-[#30363D]'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${includeHashtags ? 'translate-x-3' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[#9AA4AF] group-hover:text-white transition-colors">#TAGS</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#161B22] rounded-xl border border-[#1F2933]">
              {(['Simple', 'Developer', 'Architect'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    generatePost(m);
                  }}
                  className={`px-3 py-2 text-[12px] font-semibold rounded-lg transition-all ${
                    mode === m 
                      ? 'bg-[#3B82F6] text-white shadow-lg' 
                      : 'text-[#9AA4AF] hover:text-white hover:bg-[#1F2933]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Post */}
          <div className="relative group">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9AA4AF] mb-3 block">
              Generated Post
            </label>
            <div className="relative">
              <textarea
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                placeholder="Generating post..."
                className="w-full h-[400px] bg-[#161B22] border border-[#1F2933] rounded-2xl p-5 text-[14px] leading-relaxed text-[#E6EDF3] focus:outline-none focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 resize-none transition-all placeholder:text-[#30363D]"
              />
              
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#161B22]/80 backdrop-blur-[2px] rounded-2xl border border-dashed border-[#3B82F6]/30">
                  <Loader2 className="h-8 w-8 text-[#3B82F6] animate-spin mb-3" />
                  <p className="text-sm font-medium text-[#9AA4AF] animate-pulse">Synthesizing insights...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                  <p className="text-sm text-red-400">{error}</p>
                  <button 
                    onClick={() => generatePost()}
                    className="mt-2 text-xs font-bold text-red-400 underline"
                  >
                    Retry Generation
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className={`text-[11px] font-medium transition-colors ${charCount > 3000 ? 'text-red-400' : 'text-[#6B7280]'}`}>
                {charCount} / 3000 characters
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => generatePost()}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#9AA4AF] hover:text-white bg-[#161B22] hover:bg-[#1F2933] border border-[#1F2933] rounded-lg transition-all"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!generatedPost || isGenerating}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                    copied 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-[#3B82F6]/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-auto pt-8 border-t border-[#1F2933]/50">
          <div className="rounded-xl bg-[#3B82F6]/5 border border-[#3B82F6]/10 p-4">
            <h4 className="text-[12px] font-bold text-[#E6EDF3] mb-1">Architect Tone Active</h4>
            <p className="text-[11px] leading-relaxed text-[#9AA4AF]">
              Generating a post focused on system design, trade-offs, and engineer-to-engineer insights. Best for tech leads and architects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
