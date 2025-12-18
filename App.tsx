import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ComparisonView } from './components/ComparisonView';
import { editImageWithGemini } from './services/geminiService';

const EXAMPLE_PROMPTS = [
  "ảnh đang tạo dáng giống như trong Ảnh Mẫu Để Thay (Optional) đang mặc áo đồng phục giống như mẫu áo như mình gửi. Mẫu nữ luôn mặc chân váy dài, mẫu nam quần tây. Đều bỏ áo vào quần, áo đồng phục phải mặc đồng bộ cho tất cả người trong ảnh, áo ôm theo form, mẫu tạo dáng giống người mẫu, vui tươi, cười tự nhiên. Ảnh sắc nét, độ phân giải lớn.",
  "Hai người mẫu nữ Việt Nam, mặc chân váy đen kaki, sắc nét, form ôm dáng người mẫu. Đứng nói chuyện về công việc; áo polo đồng phục giống mẫu mình gửi.",
  "1 bức ảnh đủ số người trong 'Ảnh Mẫu Để Thay (Optional)' đang mặc áo đồng phục giống như mẫu áo trong 'Ảnh cần làm'. Mẫu nữ luôn mặc chân váy dài, mẫu nam quần tây. Đều bỏ áo vào quần, áo đồng phục phải mặc đồng bộ cho tất cả người trong ảnh. Ảnh sắc nét, độ phân giải lớn,",
  "Hai người mẫu nữ Việt Nam, mặc chân váy đen kaki, sắc nét. Đứng dối diện nhau và đang cười với nhau; áo polo đồng phục giống mẫu mình gửi.",
  "Nhóm 5 nữ người Việt Nam, khuôn mặt khác nhau không giống ai, độ tuổi 20–35, ngoại hình xinh xắn, khỏe khoắn, tạo thành đội hình cân đối, chuyên nghiệp tự nhiên khoe cá tính, nhìn thẳng máy ảnh, nụ cười tự tin. Trang phục: Váy công sở đen form gọn gàng. Áo giống mẫu mình gửi. Phong cách chụp ảnh quảng cáo thể thao chuyên nghiệp, ánh sáng nhân tạo cân bằng, da người chân thật, màu sắc hài hòa, không gắt. Chất liệu vải váy và áo hiển thị rõ, form đẹp, phù hợp doanh nghiệp. Ảnh siêu chân thực, phong cách commercial lifestyle, DSLR, góc chụp ngang, chiều sâu ảnh tốt, độ phân giải cao, chất lượng 8K.",
  "4 người mẫu nữ trẻ người Việt Nam tạo dáng chụp nhóm trong studio nền trắng. Tất cả mặc áo thun đồng phục công ty giống như mẫu mình gửi. Tất cả đều đứng, tạo dáng, cười tự nhiên. Mọi người đều chân váy công sở đen hoặc trắng đồng bộ. Ánh sáng tự nhiên, bố cục chặt chẽ, phong cách chụp đồng phục thương hiệu cao cấp. Giữ nguyên tư thế và vị trí của từng người. Background là văn phòng công ty.",
  "A group of 7 Việt Nam office staff posing in professional team photo styles. Keep the same faces and body proportions but vary the poses naturally: some people crossing arms, some with hands in pockets, some smiling confidently. Random camera angles (eye-level, slight low-angle, 3/4 angle). Random composition (casual standing formation). Studio lighting variations: softbox, rim light, key light — still clean and elegant. Ultra-realistic, 8K, corporate style, premium uniform catalog look. Background văn phòng công ty, sang xịn .",
  "Nhóm 4 người chơi người Việt Nam (3 nữ, 1 nam), độ tuổi 20–30, ngoại hình trẻ trung, năng động, thân thiện. Đứng cạnh nhau trong khuôn viên công ty. Nhân vật nữ mặc váy zip công sở màu trắng đẹp, áo thì giống mẫu mình gửi, form ôm gọn, nữ tính. Nhân vật nam mặc áo thì giống mẫu mình gửi, quần tây dài, mang dày tây, dáng đứng tự tin. Phong cách chụp ảnh quảng cáo chuyên nghiệp, ánh sáng tự nhiên, da người chân thật, màu sắc hài hòa. Chất liệu vải áo rõ nét, form áo đẹp, phù hợp làm đồng phục công ty. Ảnh siêu chân thực, độ phân giải cao, phong cách chụp commercial, DSLR, xóa phông nhẹ, chiều sâu ảnh tốt, chất lượng 8K.",
  "Một nữ người Việt Nam trẻ trung, gương mặt xinh xắn, tươi tắn, phong cách thể thao năng động. Mặc váy zip công sở màu trắng, mặc áo giống mẫu mình gửi, form gọn gàng, tôn dáng, chất liệu cao cấp. Phong cách chụp ảnh quảng cáo chuyên nghiệp, ánh sáng tự nhiên ban ngày, da người chân thật, màu sắc dịu, hài hòa. Chất liệu vải váy và áo hiển thị rõ, form đẹp, phù hợp làm đồng phục doanh nghiệp. Ảnh siêu chân thực, chất lượng cao, DSLR, xóa phông nhẹ, chiều sâu ảnh tốt, phong cách commercial, độ phân giải 8K.",
  "1 nhân vật mẫu nữ Việt Nam mặc quần ống loe công sở màu đen, tay tập hồ sơ chuẩn bị vào họp, toàn cảnh rộng. Ánh sáng tự nhiên, mềm. Mẫu áo polo đồng phục giống mẫu mình gửi nhé.",
  "1 nhân vật mẫu Nam Việt Nam mặc quần tây công sở, tay xách túi đựng chiếc macbook pro M1, toàn cảnh rộng, ngồi tạo dáng trước ống kính như người mẫu. Ánh sáng tự nhiên, mềm. Mẫu áo polo đồng phục giống mẫu áo mình gửi nhé.",
  "Nhóm 3 người bạn Việt Nam (2 nam, 1 nữ), độ tuổi 20–30, vóc dáng nhân viên công sở, phong thái tự tin ra sếp. Hai nam đứng cạnh ghế đá, nữ ngồi ở giữa trên ghế đá dài 1m2 tại khuôn viên công ty, tạo dáng tự nhiên, nhìn thẳng vào ống kính chuyên nghiệp. Trang phục: Nam bên trái mặc áo thun đồng phục công ty giống hình mình gửi, quần tây đen, giày tây. Nữ ở giữa giống hình mình gửi, váy công sở đẹp dài, lịch sự. Nam bên phải mặc áo thun đồng phục công ty giống hình mình gửi, quần jean kaki đen. Bối cảnh: ngoài trời, có cây cảnh xung quanh, trời nắng nhẹ, ánh sáng chiều tự nhiên, không gian chuyên nghiệp của 1 tập đoàn. Phong cách chụp ảnh quảng cáo thể thao chuyên nghiệp, ánh sáng tự nhiên, da người chân thật, màu sắc hài hòa, không quá gắt. Chất liệu vải áo hiển thị rõ, form đứng đẹp, phù hợp làm đồng phục doanh nghiệp. Ảnh siêu chân thực, phong cách commercial lifestyle, DSLR, góc chụp ngang, chiều sâu ảnh tốt, độ phân giải cao, chất lượng 8K.",
  "1 nhân vật mẫu nữ Việt Nam mặc váy thể thao xếp ly màu đen, cầm vợt pickleball đứng trong studio"
];

type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const ASPECT_RATIOS: { label: string; value: AspectRatio; icon: string }[] = [
  { label: "1:1 Vuông", value: "1:1", icon: "▢" },
  { label: "3:4 Dọc", value: "3:4", icon: "▯" },
  { label: "4:3 Ngang", value: "4:3", icon: "▭" },
  { label: "9:16 Story", value: "9:16", icon: "📱" },
  { label: "16:9 Wide", value: "16:9", icon: "🖥️" },
];

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<{ data: string, mimeType: string } | null>(null);

  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string, type: string) => {
    setOriginalImage(base64);
    setMimeType(type);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleReferenceSelected = useCallback((base64: string, type: string) => {
    setReferenceImage({ data: base64, mimeType: type });
  }, []);

  const clearReference = () => {
    setReferenceImage(null);
  }

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Combine prompt and context
    const fullPrompt = context.trim() 
      ? `${prompt}. Bối cảnh: ${context.trim()}`
      : prompt;

    try {
      const result = await editImageWithGemini(
        originalImage, 
        mimeType, 
        fullPrompt,
        referenceImage ? referenceImage : undefined,
        aspectRatio
      );
      setGeneratedImage(result.imageData);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `akopa-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setReferenceImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setContext('');
    setAspectRatio("1:1");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-brand-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AKOPA Uniform
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <span className="hidden md:block text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">Đồng Phục Khởi Phát</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Intro / Empty State */}
        {!originalImage && (
          <div className="text-center mb-10 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Tạo Ảnh AI Đồng Phục Công Ty & Doanh Nghiệp
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg mb-8">
              Tải lên ảnh Mockup 3D. Sau đó chọn Prompt để tạo Ảnh.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <ImageUploader onImageSelected={handleImageSelected} className="h-64" />
            </div>
          </div>
        )}

        {/* Workspace */}
        {originalImage && !generatedImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {/* Left: Images */}
            <div className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                 <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl group">
                   <img src={originalImage} alt="Source" className="w-full h-auto object-cover max-h-[400px]" />
                   <button 
                    onClick={resetAll}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove and start over"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                   </button>
                 </div>
                 <p className="text-center text-sm text-slate-500 font-medium italic">Ảnh cần làm</p>
               </div>

               <div className="flex flex-col gap-2 p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Ảnh Mẫu Để Thay <span className="text-slate-500 font-normal">(Optional)</span></label>
                    {referenceImage && (
                       <button onClick={clearReference} className="text-xs text-red-400 hover:text-red-300 transition-colors">Gỡ ảnh</button>
                    )}
                  </div>
                  
                  {referenceImage ? (
                    <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-700 h-40 flex items-center justify-center">
                       <img src={referenceImage.data} alt="Reference" className="h-full w-full object-contain" />
                    </div>
                  ) : (
                    <ImageUploader onImageSelected={handleReferenceSelected} className="h-32" />
                  )}
                  <p className="text-[10px] text-slate-500 mt-1 italic">Lưu ý: Chọn ảnh mẫu có người mặc đồng phục để AI hiểu bối cảnh tốt nhất.</p>
               </div>
            </div>

            {/* Right: Controls */}
            <div className="flex flex-col gap-6">
              {/* Prompt Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  1. Mô tả yêu cầu sáng tạo
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Sáng tạo ảnh như thế nào thì gõ vào đây hoặc chọn prompts ở dưới..."
                    className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all shadow-inner"
                  />
                   <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                    {prompt.length} chars
                   </div>
                </div>
              </div>

              {/* Context Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  2. Bối cảnh (Optional)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Ví dụ: Văn phòng công ty, quán cafe, sân vận động..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
                />
              </div>

              {/* Aspect Ratio Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  3. Tỉ lệ ảnh (Aspect Ratio)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`
                        flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] font-medium transition-all
                        ${aspectRatio === ratio.value 
                          ? 'bg-brand-600/20 border-brand-500 text-brand-400 shadow-sm' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                      `}
                    >
                      <span className="text-lg mb-1">{ratio.icon}</span>
                      <span className="text-center leading-tight">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Example Prompts */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Thư viện Prompts mẫu</p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {EXAMPLE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(p)}
                      className="text-[11px] px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors text-left max-w-full truncate"
                      title={p}
                    >
                      {p.length > 50 ? p.substring(0, 50) + '...' : p}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                   <strong>Lỗi:</strong> {error}
                 </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 transition-all transform
                  ${!prompt.trim() || isLoading 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-brand-600 hover:bg-brand-500 text-white hover:scale-[1.02] active:scale-[0.98]'}
                `}
              >
                {isLoading ? (
                  <>Đang xử lý...</>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L13.95 13.684Z" />
                    </svg>
                    Tạo Ảnh Ngay
                  </>
                )}
              </button>
            </div>
            
             {isLoading && <LoadingOverlay message="Đang pha trà, chờ 1 xíu nha..." />}
          </div>
        )}

        {/* Results View */}
        {originalImage && generatedImage && (
          <div className="w-full max-w-6xl mx-auto animate-fade-in">
             <div className="mb-6 flex items-center justify-between">
               <div>
                <h3 className="text-xl font-semibold text-white">🎉 Hoàn thành!</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl truncate">"{prompt}"</p>
               </div>
             </div>
             
             <ComparisonView 
                originalImage={originalImage}
                generatedImage={generatedImage}
                onDownload={handleDownload}
                onClose={resetAll}
             />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 mt-12 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 AKOPA Uniform - Đồng Phục Khởi Phát</p>
        </div>
      </footer>
    </div>
  );
}

export default App;