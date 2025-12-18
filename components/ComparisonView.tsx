import React, { useState } from 'react';

interface ComparisonViewProps {
  originalImage: string;
  generatedImage: string;
  onDownload: () => void;
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalImage, generatedImage, onDownload, onClose }) => {
  const [viewMode, setViewMode] = useState<'split' | 'toggle'>('split');
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'split' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Chia 2 Cửa Sổ
          </button>
          <button
            onClick={() => setViewMode('toggle')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'toggle' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Xem Toàn Ảnh
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            Tạo Ảnh Khác 
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
            Tải Xuống
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-slate-700">
            <div className="relative group">
              <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">Original</span>
              <img src={originalImage} alt="Original" className="w-full h-full object-contain bg-slate-950/50 max-h-[600px]" />
            </div>
            <div className="relative group">
              <span className="absolute top-3 left-3 bg-brand-600/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded">Edited</span>
              <img src={generatedImage} alt="Generated" className="w-full h-full object-contain bg-slate-950/50 max-h-[600px]" />
            </div>
          </div>
        ) : (
          <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center bg-slate-950">
            <img 
              src={showOriginal ? originalImage : generatedImage} 
              alt="Result" 
              className="max-w-full max-h-full object-contain transition-opacity duration-300"
            />
            <button
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-full text-white text-sm font-medium shadow-xl hover:bg-slate-700 select-none active:scale-95 transition-all"
            >
              Hold to Compare
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
