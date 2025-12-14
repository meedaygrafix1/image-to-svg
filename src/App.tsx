import React, { useState, useEffect } from 'react';
import { Upload, ArrowRight, Download, Copy, RefreshCw, X, Image as ImageIcon, Layers, Zap, Star, Loader2, AlertCircle, MousePointer2, LucideIcon } from 'lucide-react';

// --- Improved Script Loader ---
const SCRIPT_URLS = [
  "https://unpkg.com/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js",
  "https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/imagetracerjs/1.2.6/imagetracer_v1.2.6.min.js"
];

// Extend Window interface for ImageTracer
declare global {
  interface Window {
    ImageTracer: any;
  }
}

const loadVectorEngine = async () => {
  if (window.ImageTracer) return true;

  for (const url of SCRIPT_URLS) {
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        // Removing crossOrigin to be less strict about headers
        script.onload = () => {
          if (window.ImageTracer) resolve();
          else reject(new Error("Loaded but object missing"));
        };
        script.onerror = () => reject(new Error("Network error"));
        document.head.appendChild(script);
      });
      return true;
    } catch (e) {
      console.warn(`Failed to load from ${url}`, e);
    }
  }
  return false;
};

// --- Neubrutalist Components ---

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger';
  className?: string;
  disabled?: boolean;
  title?: string;
}

const NeoButton: React.FC<NeoButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false, title = '' }) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold border-4 border-black px-6 py-3 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-[#FFD23F] text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    secondary: "bg-white text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    accent: "bg-[#FF6B6B] text-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    success: "bg-[#4ECDC4] text-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    danger: "bg-red-500 text-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`} title={title}>
      {children}
    </button>
  );
};

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

const NeoCard: React.FC<NeoCardProps> = ({ children, className = '', color = 'bg-white' }) => (
  <div className={`${color} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    {children}
  </div>
);

const Header = ({ onStart }: { onStart: () => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 border-2 border-black transform -rotate-3">
            <Zap className="h-6 w-6" fill="#FFD23F" strokeWidth={2} />
          </div>
          <span className="font-black text-2xl uppercase tracking-tighter italic">Vector<span className="text-[#FF6B6B]">IT</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {['Features', 'How-to'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-bold text-black uppercase hover:underline decoration-4 underline-offset-4 decoration-[#4ECDC4]">
              {item}
            </a>
          ))}
        </nav>

        <NeoButton onClick={onStart} variant="primary" className="hidden sm:inline-flex text-sm py-2 px-4">
          START NOW
        </NeoButton>
      </div>
    </div>
  </header>
);

const Hero = ({ onStart }: { onStart: () => void }) => (
  <div className="relative pt-32 pb-20 bg-[#F4F4F0] overflow-hidden min-h-screen flex items-center">
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
    <div className="absolute top-40 right-[-5%] w-64 h-64 bg-[#4ECDC4] rounded-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hidden lg:block"></div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left space-y-8">
          <div className="inline-block bg-black text-white px-4 py-2 font-bold transform -rotate-2 shadow-[4px_4px_0px_0px_#4ECDC4]">
            v2.6 RESPONSIVE PREVIEW
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter">
            PIXELS<br />
            TO <span className="text-[#FFD23F] text-stroke-black">PATHS</span><br />
            <span className="text-transparent text-stroke-2 text-stroke-black">INSTANTLY</span>
          </h1>
          <p className="text-xl font-bold text-gray-800 max-w-lg border-l-8 border-[#FF6B6B] pl-6 py-2">
            Convert raster images to scalable vectors. No server uploads. 100% Client-side.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <NeoButton onClick={onStart} variant="primary" className="text-lg">
              CONVERT IMAGE <ArrowRight className="ml-2 h-5 w-5" />
            </NeoButton>
          </div>
        </div>

        <div className="relative h-[500px] hidden lg:block">
          <div className="absolute top-0 right-20 bg-white p-4 border-4 border-black w-64 transform -rotate-6 z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black pb-2 mb-2 font-bold flex justify-between">
              <span>INPUT.JPG</span>
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black"></div>
            </div>
            <div className="bg-gray-200 h-32 w-full border-2 border-black flex items-center justify-center mb-2">
              <ImageIcon className="h-10 w-10 opacity-50" />
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="bg-gray-300 px-2 py-1 border-2 border-black">RASTER</span>
              <span className="bg-gray-300 px-2 py-1 border-2 border-black">1.2MB</span>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-[#4ECDC4] p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <RefreshCw className="h-8 w-8 text-black animate-spin-slow" />
            </div>
          </div>
          <div className="absolute bottom-10 right-0 bg-[#FFD23F] p-4 border-4 border-black w-64 transform rotate-3 z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black pb-2 mb-2 font-bold flex justify-between">
              <span>OUTPUT.SVG</span>
              <div className="w-4 h-4 rounded-full bg-[#4ECDC4] border-2 border-black"></div>
            </div>
            <div className="bg-white h-32 w-full border-2 border-black flex items-center justify-center mb-2 overflow-hidden">
              <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), repeating-linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee)', backgroundSize: '10px 10px' }}></div>
              <div className="absolute">
                <MousePointer2 className="h-12 w-12 text-black fill-current" />
              </div>
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="bg-white px-2 py-1 border-2 border-black">VECTOR</span>
              <span className="bg-white px-2 py-1 border-2 border-black">SCALABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .text-stroke-black {
        -webkit-text-stroke: 2px black;
      }
      .text-stroke-2 {
        -webkit-text-stroke: 2px black;
      }
      .animate-spin-slow {
        animation: spin 3s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const HowTo = () => (
  <section id="how-to" className="py-24 bg-[#FFD23F] border-t-4 border-black relative overflow-hidden">
    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none hidden md:block">
      <MousePointer2 className="w-64 h-64 text-black" />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black uppercase mb-4 inline-block bg-white px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          How It Works
        </h2>
        <p className="font-bold text-xl mt-4 max-w-2xl mx-auto">Three steps to vector freedom. It's actually that simple.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="relative group">
          <NeoCard className="h-full bg-white relative z-10 hover:-translate-y-2 transition-transform duration-200">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl border-4 border-[#FF6B6B] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">1</div>
            <div className="mt-4 text-center">
              <div className="w-20 h-20 bg-[#F4F4F0] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Upload</h3>
              <p className="font-bold text-gray-600">Drag & drop your JPG, PNG or WEBP file. We handle the heavy lifting instantly.</p>
            </div>
          </NeoCard>
          <div className="hidden md:block absolute top-1/2 -right-10 transform -translate-y-1/2 z-0"><ArrowRight className="h-8 w-8 text-black" /></div>
        </div>
        <div className="relative group">
          <NeoCard className="h-full bg-white relative z-10 hover:-translate-y-2 transition-transform duration-200">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl border-4 border-[#4ECDC4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">2</div>
            <div className="mt-4 text-center">
              <div className="w-20 h-20 bg-[#F4F4F0] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Process</h3>
              <p className="font-bold text-gray-600">Our engine traces contours and matches colors in milliseconds. Tweak settings live.</p>
            </div>
          </NeoCard>
          <div className="hidden md:block absolute top-1/2 -right-10 transform -translate-y-1/2 z-0"><ArrowRight className="h-8 w-8 text-black" /></div>
        </div>
        <div className="relative group">
          <NeoCard className="h-full bg-white relative z-10 hover:-translate-y-2 transition-transform duration-200">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl border-4 border-[#FFE66D] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">3</div>
            <div className="mt-4 text-center">
              <div className="w-20 h-20 bg-[#F4F4F0] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Export</h3>
              <p className="font-bold text-gray-600">Download your clean, editable SVG. Ready for Figma, Illustrator, or production code.</p>
            </div>
          </NeoCard>
        </div>
      </div>
    </div>
  </section>
);

const Converter = ({ onClose }: { onClose: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [engineStatus, setEngineStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  const [settings, setSettings] = useState({
    numberofcolors: 16,
    detailLevel: 'smooth'
  });

  useEffect(() => {
    let mounted = true;
    const initEngine = async () => {
      setEngineStatus("loading");
      const success = await loadVectorEngine();
      if (mounted) setEngineStatus(success ? "ready" : "error");
    };
    initEngine();
    return () => { mounted = false; };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large! Please use an image under 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setSvgOutput(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!image) return;

    // Auto-retry load if it failed before
    if (engineStatus !== 'ready') {
      setEngineStatus("loading");
      const success = await loadVectorEngine();
      if (!success) {
        setEngineStatus("error");
        return;
      }
      setEngineStatus("ready");
    }

    setIsProcessing(true);
    setSvgOutput(null);

    setTimeout(() => {
      if (typeof window.ImageTracer === 'undefined') {
        setEngineStatus("error");
        setIsProcessing(false);
        return;
      }

      try {
        const img = new Image();
        img.src = image;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = settings.detailLevel === 'exact' ? 3000 : 2500;

          if (width > MAX_DIM || height > MAX_DIM) {
            const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setIsProcessing(false);
            return;
          }

          // --- Automatic Optimization Logic ---
          // We decide if we need boost or smoothing based on the chosen mode
          const needsBoost = settings.detailLevel === 'smooth' || settings.detailLevel === 'sharp';

          if (needsBoost) {
            ctx.filter = 'contrast(1.1) saturate(1.1)'; // Subtle boost
          }

          ctx.drawImage(img, 0, 0, width, height);
          const imgData = ctx.getImageData(0, 0, width, height);

          // --- Mode Definitions ---
          let ltres = 1, qtres = 1, pathomit = 8, blurradius = 0, blurdelta = 0;

          switch (settings.detailLevel) {
            case 'smooth':
              // "Logo Mode" - Smooth curves, clear lines
              ltres = 1; qtres = 1; pathomit = 4;
              blurradius = 2; blurdelta = 15;
              break;
            case 'sharp':
              // "Photo Mode" - High detail, minimal smoothing
              ltres = 0.5; qtres = 0.5; pathomit = 2;
              blurradius = 0;
              break;
            case 'exact':
              // "1:1 Mode" - Raw pixel data
              ltres = 0.01; qtres = 0.01; pathomit = 1; // Safest minimum
              blurradius = 0;
              break;
            default: break;
          }

          const options = {
            ltres: ltres,
            qtres: qtres,
            pathomit: pathomit,
            colorsampling: 2,
            numberofcolors: typeof settings.numberofcolors === 'string' ? parseInt(settings.numberofcolors) : settings.numberofcolors,
            mincolorratio: 0,
            colorquantcycles: 3,
            scale: 1,
            simplify: 0,
            strokewidth: 0,
            linefilter: false,
            blurradius: blurradius,
            blurdelta: blurdelta
          };

          let svgstr = window.ImageTracer.imagedataToSVG(imgData, options);

          // --- FIX FOR RESPONSIVE PREVIEW ---
          // Replace fixed width/height with 100% to ensure scaling in flex container
          // ImageTracer outputs <svg width="W" height="H" ... >
          svgstr = svgstr.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"');

          setSvgOutput(svgstr);
          setIsProcessing(false);
        };
        img.onerror = () => {
          alert("Could not load image data.");
          setIsProcessing(false);
        };

      } catch (error) {
        console.error("Conversion critical failure:", error);
        alert("Engine error. Please try a simpler image or lower settings.");
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!svgOutput) return;
    try {
      const blob = new Blob([svgOutput], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vector_result.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download failed.");
    }
  };

  const handleCopy = () => {
    if (!svgOutput) return;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = svgOutput;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      alert("Failed to copy code.");
    }
  };

  const retryEngineLoad = async () => {
    setEngineStatus("loading");
    const success = await loadVectorEngine();
    setEngineStatus(success ? "ready" : "error");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F4F0] overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#4ECDC4] border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div><h2 className="font-black text-xl uppercase">Studio<span className="text-[#FF6B6B]">Mode</span></h2></div>
          </div>
          <button onClick={onClose} className="bg-red-500 border-2 border-black p-1 hover:bg-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"><X className="h-6 w-6 text-white" /></button>
        </div>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col gap-6">
              <NeoCard className="h-full flex flex-col relative" color="bg-white">
                <div className="absolute -top-5 left-4 bg-black text-white px-3 py-1 font-bold transform -rotate-2 border-2 border-[#FFD23F]">STEP 01: SOURCE</div>
                <div className="mt-4 flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                  <h3 className="text-2xl font-black uppercase">Upload Bitmap</h3>
                </div>

                {!image ? (
                  <div className="flex-1 border-4 border-dashed border-black bg-[#F4F4F0] hover:bg-[#FFE66D] transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer relative group">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 group-hover:scale-110 transition-transform"><Upload className="h-8 w-8 text-black" /></div>
                    <p className="font-bold text-xl uppercase">Drop it like it's hot</p>
                    <p className="font-bold text-sm text-gray-500 mt-2">JPG, PNG, WEBP</p>
                  </div>
                ) : (
                  <div className="flex-1 relative bg-black border-4 border-black overflow-hidden flex items-center justify-center min-h-[200px]">
                    <img src={image} alt="Original" className="max-h-[300px] w-auto object-contain" />
                    <button onClick={() => { setImage(null); setSvgOutput(null); }} className="absolute top-4 right-4 bg-[#FF6B6B] border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"><X className="h-5 w-5 text-white" /></button>
                  </div>
                )}

                <div className="mt-8 border-t-4 border-black pt-6 bg-[#E0E0E0] -mx-6 -mb-6 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-bold uppercase text-sm">Output Style</label>
                      <select
                        value={settings.detailLevel}
                        onChange={(e) => setSettings({ ...settings, detailLevel: e.target.value })}
                        className="w-full bg-white border-4 border-black font-bold p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <option value="smooth">Smooth (Icons/Logos)</option>
                        <option value="sharp">Detailed (Photos)</option>
                        <option value="exact">Pixel Perfect (Exact)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold uppercase text-sm">Colors</label>
                      <select
                        value={settings.numberofcolors}
                        onChange={(e) => setSettings({ ...settings, numberofcolors: parseInt(e.target.value) })}
                        className="w-full bg-white border-4 border-black font-bold p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <option value="2">2 (B&W)</option>
                        <option value="4">4 Colors</option>
                        <option value="16">16 Colors</option>
                        <option value="32">32 Colors</option>
                        <option value="64">64 Colors</option>
                        <option value="128">128 Colors</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <NeoButton
                      onClick={handleConvert}
                      disabled={!image || isProcessing || engineStatus === 'loading'}
                      className="w-full"
                      variant={engineStatus === 'error' ? 'danger' : 'primary'}
                    >
                      {isProcessing ? (
                        <><Loader2 className="h-5 w-5 animate-spin mr-2" /> PROCESSING...</>
                      ) : engineStatus === 'error' ? (
                        <>ENGINE ERROR (RETRY)</>
                      ) : (
                        <>VECTORIZE <ArrowRight className="h-5 w-5 ml-2" /></>
                      )}
                    </NeoButton>

                    {engineStatus === 'loading' && <div className="mt-2 text-center text-xs font-bold text-gray-500 animate-pulse">PREPARING ENGINE...</div>}

                    {engineStatus === 'error' && (
                      <div className="mt-2 text-center">
                        <p className="text-xs font-bold text-red-500 mb-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3" /> FAILED TO LOAD ENGINE
                        </p>
                        <button
                          onClick={retryEngineLoad}
                          className="text-[10px] underline hover:text-red-700 font-bold uppercase"
                        >
                          Tap to Retry Connection
                        </button>
                      </div>
                    )}

                    {settings.detailLevel === 'exact' && <div className="mt-2 text-center text-xs font-bold text-orange-600">⚠ ULTRA MODE: May freeze browser for large images</div>}
                  </div>
                </div>
              </NeoCard>
            </div>

            <div className="flex flex-col gap-6">
              <NeoCard className="h-full flex flex-col relative" color="bg-[#FFFAEB]">
                <div className="absolute -top-5 right-4 bg-black text-white px-3 py-1 font-bold transform rotate-2 border-2 border-[#4ECDC4]">STEP 02: RESULT</div>
                <div className="mt-4 flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                  <h3 className="text-2xl font-black uppercase">Vector Output</h3>
                  {svgOutput && <span className="font-bold text-xs bg-[#4ECDC4] border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">READY</span>}
                </div>
                <div className="flex-1 bg-white border-4 border-black relative min-h-[300px] flex items-center justify-center p-4 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none" style={{
                    opacity: 0.1,
                    backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }}></div>
                  {!svgOutput ? (
                    <div className="text-center p-8 relative z-10">
                      <div className="bg-gray-200 w-24 h-24 border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Layers className="h-10 w-10 text-gray-400" /></div>
                      <p className="font-bold text-gray-400 uppercase">Waiting for input...</p>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center relative z-10 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                      dangerouslySetInnerHTML={{ __html: svgOutput }}
                    />
                  )}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <NeoButton onClick={handleCopy} disabled={!svgOutput} variant="secondary">{copied ? 'COPIED!' : 'COPY CODE'}</NeoButton>
                  <NeoButton onClick={handleDownload} disabled={!svgOutput} variant="success">DOWNLOAD</NeoButton>
                </div>
              </NeoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-black text-white border-t-4 border-black py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-[#FFD23F]" fill="#FFD23F" />
        <span className="font-black text-2xl uppercase italic">Vector<span className="text-[#FF6B6B]">IT</span></span>
      </div>
      <p className="font-bold text-sm text-gray-400 uppercase tracking-widest">NO COOKIES. NO TRACKING. JUST VECTORS.</p>
    </div>
  </footer>
);

export default function App() {
  const [showConverter, setShowConverter] = useState(false);
  return (
    <div className="min-h-screen font-sans text-black selection:bg-[#FF6B6B] selection:text-white">
      <Header onStart={() => setShowConverter(true)} />
      <main>
        <Hero onStart={() => setShowConverter(true)} />
        <HowTo />
        <section id="features" className="py-24 bg-white border-y-4 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black uppercase mb-4 transform -rotate-1 inline-block bg-[#FFD23F] px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Why It Rules</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[{ icon: Zap, title: "Blazing Fast", desc: "WASM-powered tracing that puts native apps to shame.", color: "bg-[#FF6B6B]" }, { icon: Star, title: "100% Free", desc: "No subscriptions, no hidden fees, no watermark nonsense.", color: "bg-[#4ECDC4]" }, { icon: Layers, title: "Scalable", desc: "True paths and fills. Edit nodes in Illustrator or Figma.", color: "bg-[#FFE66D]" }].map((feature, i) => (
                <div key={i} className="group hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                  <NeoCard className="h-full">
                    <div className={`w-16 h-16 ${feature.color} border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}><feature.icon className="h-8 w-8 text-black" strokeWidth={2.5} /></div>
                    <h3 className="text-2xl font-black uppercase mb-3">{feature.title}</h3>
                    <p className="font-bold text-gray-600 border-l-4 border-black pl-4">{feature.desc}</p>
                  </NeoCard>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {showConverter && <Converter onClose={() => setShowConverter(false)} />}
    </div>
  );
}