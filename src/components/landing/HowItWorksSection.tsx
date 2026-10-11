import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Code2, Award, Handshake, 
  Play, Pause, Volume2, VolumeX, Maximize2, 
  Sparkles, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Founder Posts Challenge",
    description: "Define a real business problem with constraints, deadlines, and evaluation criteria.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Talent Executes",
    description: "Builders submit working solutions — code, growth hacks, designs, strategies.",
  },
  {
    icon: Award,
    step: "03",
    title: "Work Gets Scored",
    description: "Submissions are evaluated on quality, creativity, and execution. XP is awarded.",
  },
  {
    icon: Handshake,
    step: "04",
    title: "Best Talent Gets Hired",
    description: "Founders hire based on proof of ability. No interviews needed.",
  },
];

const HowItWorksSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Attempt auto-play when mounted
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setCurrentTime(current);
    setProgress((current / duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = pct * (videoRef.current.duration || 1);
    setProgress(pct * 100);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/[0.08] blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={13} className="text-primary animate-pulse" />
            <span>Process & Execution</span>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Experience proof-of-work hiring in action. From live challenge drops to verified submissions and automated reputation scoring.
          </p>
        </motion.div>

        {/* Video Showcase Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto mb-20 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Glow Aura */}
          <div className="absolute -inset-1.5 md:-inset-3 bg-gradient-to-r from-primary/30 via-accent/25 to-primary/20 rounded-2xl md:rounded-3xl blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none" />

          {/* Player Shell */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden glass border border-primary/30 shadow-2xl shadow-primary/10 bg-card/80">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-destructive/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/70 inline-block" />
                <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground ml-2">
                  sohospace://challenge-engine-flow.mp4
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="outline" className="text-[11px] font-medium border-primary/30 text-primary bg-primary/10 flex items-center gap-1.5 px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  Live Demo Walkthrough
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono hidden md:inline">
                  1080p HD
                </span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full bg-black/90 overflow-hidden cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/sohospace-teaser-detailed.mp4"
                className="w-full h-full object-cover video-platform-grade"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Color grading subtle tint layer matching Bloom Rose palette */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.08] via-transparent to-primary/[0.04] pointer-events-none mix-blend-color" />
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-primary/20" />

              {/* Top-left Soho Space logo overlay replacing tick icon throughout demo */}
              {currentTime < 48.0 && (
                <div 
                  className="absolute pointer-events-none rounded-[20%] overflow-hidden bg-background border border-primary/20 shadow-md transition-opacity duration-300 z-10"
                  style={{
                    left: "5.78%",
                    top: "6.2%",
                    width: "2.35%",
                    aspectRatio: "1/1",
                  }}
                >
                  <img src="/logo.png" alt="Soho Space" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Outro center Soho Space logo overlay replacing tick icon */}
              {currentTime >= 48.0 && (
                <div 
                  className="absolute pointer-events-none rounded-[22%] overflow-hidden bg-background border border-primary/30 shadow-2xl transition-opacity duration-300 z-10"
                  style={{
                    left: "45.68%",
                    top: "20.1%",
                    width: "8.7%",
                    aspectRatio: "1/1",
                  }}
                >
                  <img src="/logo.png" alt="Soho Space" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Floating Play/Pause Center Indicator when paused */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/40 transform hover:scale-110 transition-transform">
                      <Play size={32} className="ml-1 fill-current" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Custom Overlay Controls */}
              <div 
                className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                  isHovered || !isPlaying ? "opacity-100" : "opacity-0 md:opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Timeline scrubber bar */}
                <div 
                  className="w-full h-1.5 bg-white/20 hover:h-2 rounded-full mb-3 cursor-pointer relative transition-all"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transform scale-0 hover:scale-100 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5 fill-white" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors"
                      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <span className="text-xs text-white/80 font-medium hidden sm:inline">
                      Soho Space Walkthrough
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/60 font-mono hidden sm:inline">
                      Auto-loops • 60 FPS
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-colors"
                      aria-label="Toggle Fullscreen"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Process Milestone Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ 
                scale: 1.04,
                transition: { duration: 0.25, ease: "easeOut" }
              }}
              className="group relative h-full"
            >
              <div className="glass p-8 h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border-border/50 hover:border-primary/40 bg-card/60">
                {/* Theme Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <span className="text-5xl font-heading font-bold text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </span>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {step.description}
                  </p>
                  <div className="mt-6 w-8 h-1 bg-border group-hover:bg-primary group-hover:w-full transition-all duration-500" />
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border group-hover:hidden transition-all pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
