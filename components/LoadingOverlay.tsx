import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Processing..." }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 rounded-xl">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-t-4 border-brand-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-b-4 border-purple-500 border-solid rounded-full animate-spin direction-reverse"></div>
      </div>
      <p className="text-white font-medium text-lg animate-pulse">{message}</p>
      <p className="text-slate-400 text-sm mt-2"> Đang Tạo Ảnh Vui Lòng Đợi ^.^</p>
    </div>
  );
};
