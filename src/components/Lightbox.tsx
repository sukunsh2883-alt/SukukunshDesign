import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import Hls from "hls.js";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: "image" | "video";
  src: string;
  title: string;
  category?: string;
  description?: string;
}

export default function Lightbox({
  isOpen,
  onClose,
  mediaType,
  src,
  title,
  category,
  description
}: LightboxProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isHlsLoading, setIsHlsLoading] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle Video Loading (including HLS)
  useEffect(() => {
    if (!isOpen || mediaType !== "video" || !src) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    setIsHlsLoading(false);
    setIsPlaying(true);
    setIsMuted(false);

    // Is it an HLS playlist?
    const isM3U8 = src.includes(".m3u8");

    if (isM3U8) {
      if (Hls.isSupported()) {
        setIsHlsLoading(true);
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsHlsLoading(false);
          videoElement.play().catch((err) => console.log("HLS play error:", err));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                break;
            }
          }
        });
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // Native safari/iOS support
        videoElement.src = src;
        videoElement.play().catch((err) => console.log("Safari HLS play error:", err));
      }
    } else {
      // Standard video format
      videoElement.src = src;
      videoElement.play().catch((err) => console.log("Standard video play error:", err));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoElement) {
        videoElement.src = "";
      }
    };
  }, [isOpen, mediaType, src]);

  if (!isOpen) return null;

  // Toggle Video Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Absolute Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] rounded-full border border-white/10 bg-black/40 p-3 text-white transition-all hover:scale-110 hover:bg-white/10"
        aria-label="Close Lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Lightbox Canvas Container */}
      <div
        className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center p-4 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaType === "image" ? (
          <div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={src}
              alt={title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="relative flex aspect-video max-h-[65vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-black shadow-2xl">
            {isHlsLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                <p className="mt-4 text-xs tracking-widest text-muted uppercase">Buffering Stream...</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              playsInline
              loop
              autoPlay
              onClick={togglePlay}
            />

            {/* Custom overlay controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/60 backdrop-blur-md px-4 py-2 border border-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="rounded-lg p-1.5 text-white hover:bg-white/10 transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="rounded-lg p-1.5 text-white hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-wider text-muted uppercase font-mono">Cinema Mode</span>
                <button
                  onClick={handleFullscreen}
                  className="rounded-lg p-1.5 text-white hover:bg-white/10 transition-colors"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content details overlay */}
        <div className="mt-6 w-full text-center md:text-left max-w-3xl">
          {category && (
            <span className="text-[10px] tracking-[0.25em] text-[#FF6A00] font-sans font-medium uppercase block mb-1">
              {category}
            </span>
          )}
          <h3 className="font-serif italic text-2xl md:text-3xl text-white tracking-wide">
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-sm text-neutral-400 font-sans leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
