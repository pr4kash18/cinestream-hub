import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrls: Record<string, string>;
  fallbackUrl?: string;
  qualities: string[];
  initialQuality?: string;
}

const VideoPlayer = ({ open, onClose, title, videoUrls, fallbackUrl, qualities, initialQuality }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const available = qualities.filter((q) => videoUrls[q]);
  const firstAvailable = available[0] || qualities[0] || "1080p";
  const [quality, setQuality] = useState(initialQuality && (videoUrls[initialQuality] || fallbackUrl) ? initialQuality : firstAvailable);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSrc = videoUrls[quality] || fallbackUrl || "";

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const t = (parseFloat(e.target.value) / 100) * duration;
    v.currentTime = t;
    setProgress(parseFloat(e.target.value));
  };

  const switchQuality = (q: string) => {
    const v = videoRef.current;
    const time = v?.currentTime || 0;
    setQuality(q);
    setLoading(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        if (playing) videoRef.current.play();
      }
    }, 100);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/40 hover:bg-background/70 text-foreground transition-colors"
        aria-label="Close player"
      >
        <X className="w-6 h-6" />
      </button>

      <div ref={containerRef} className="relative w-full h-full sm:w-[90vw] sm:h-[85vh] sm:max-w-6xl flex items-center justify-center bg-black sm:rounded-xl overflow-hidden">
        {currentSrc ? (
          <>
            <video
              ref={videoRef}
              src={currentSrc}
              className="w-full h-full object-contain bg-black"
              autoPlay
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedData={() => setLoading(false)}
              onWaiting={() => setLoading(true)}
              onCanPlay={() => setLoading(false)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onError={() => { setError("Failed to load video"); setLoading(false); }}
              onClick={togglePlay}
            />

            {loading && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-center px-4">
                <div>
                  <p className="text-foreground font-semibold mb-1">{error}</p>
                  <p className="text-sm text-muted-foreground">Try a different quality below.</p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-10">
              <p className="text-foreground font-semibold mb-2 truncate">{title}</p>

              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={onSeek}
                className="w-full h-1 accent-primary cursor-pointer mb-3"
                aria-label="Seek"
              />

              <div className="flex items-center gap-3 text-foreground">
                <button onClick={togglePlay} className="hover:text-primary transition-colors" aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button onClick={toggleMute} className="hover:text-primary transition-colors" aria-label={muted ? "Unmute" : "Mute"}>
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {fmt((progress / 100) * duration)} / {fmt(duration)}
                </span>

                <div className="ml-auto flex items-center gap-2">
                  <div className="flex bg-background/40 rounded-md p-0.5">
                    {qualities.map((q) => {
                      const has = !!videoUrls[q] || (q === firstAvailable && fallbackUrl);
                      return (
                        <button
                          key={q}
                          onClick={() => has && switchQuality(q)}
                          disabled={!has}
                          className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors ${quality === q ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"} disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={toggleFullscreen} className="hover:text-primary transition-colors" aria-label="Fullscreen">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center px-6">
            <p className="text-foreground font-semibold mb-1">No video available</p>
            <p className="text-sm text-muted-foreground">The admin hasn't uploaded a playable file for this title yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
