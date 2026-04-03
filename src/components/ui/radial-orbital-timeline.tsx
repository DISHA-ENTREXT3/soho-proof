"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: LucideIcon;
  relatedIds?: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  className?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  className,
}: RadialOrbitalTimelineProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = useMemo(
    () => timelineData.find((item) => item.id === selectedId),
    [selectedId, timelineData]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.15) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
      case "in-progress":
        return "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]";
      case "pending":
        return "bg-muted-foreground/50";
      default:
        return "bg-muted-foreground/50";
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  // Calculate positions for all items
  const positions = useMemo(() => {
    return timelineData.map((item, index) => {
      const totalItems = timelineData.length;
      const angle = (index / totalItems) * 360;
      // Vary radius slightly for a more organic feel
      const radius = 180 + (index % 3) * 30;
      return { id: item.id, angle, radius };
    });
  }, [timelineData]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-background/50 text-foreground transition-colors duration-500 rounded-3xl border border-primary/5 cursor-default", 
        className
      )}
      onClick={handleContainerClick}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Orbital Paths */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-20">
        {[180, 210, 240, 300].map((r) => (
          <div 
            key={r}
            className="absolute border border-primary/20 dark:border-primary/10 rounded-full" 
            style={{ width: r * 2, height: r * 2 }}
          />
        ))}
      </div>

      {/* Connection Lines for Selected Item */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <AnimatePresence>
          {selectedItem && selectedItem.relatedIds?.map((relatedId) => {
            const currentPos = positions.find(p => p.id === selectedId);
            const targetPos = positions.find(p => p.id === relatedId);
            if (!currentPos || !targetPos) return null;

            const getXY = (p: typeof currentPos, rot: number) => {
              const a = ((p.angle + rot) * Math.PI) / 180;
              return {
                x: Math.cos(a) * p.radius + 300, // assuming 600px height, centered
                y: Math.sin(a) * p.radius + 300
              };
            };

            // This is a bit complex since rotation is live. We'll simplify and use relative CSS.
            // However, SVG paths don't easily move with CSS transforms in all browsers.
            // For a better "Wow", we'll use a simplified version or Framer Motion dots.
            return null;
          })}
        </AnimatePresence>
      </svg>

      {/* Central Hub */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-background to-accent/20 backdrop-blur-2xl border border-primary/20 flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary),0.2)]"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent animate-pulse shadow-[0_0_40px_rgba(var(--primary),0.4)] flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-background/30 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </motion.div>

      {/* Orbiting Items */}
      {timelineData.map((item, index) => {
        const pos = positions[index];
        const angle = pos.angle + rotation;
        const x = Math.cos((angle * Math.PI) / 180) * pos.radius;
        const y = Math.sin((angle * Math.PI) / 180) * pos.radius;

        const isRelated = selectedItem?.relatedIds?.includes(item.id);
        const isSelected = selectedId === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <motion.div
            key={item.id}
            className="absolute z-20"
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
          >
            <div className="relative group">
              {/* Interaction Ring */}
              <AnimatePresence>
                {(isSelected || isHovered) && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 rounded-full border-2 border-primary/30 blur-sm"
                  />
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-14 h-14 rounded-full border-border bg-card/60 backdrop-blur-md transition-all duration-500 relative overflow-hidden group-hover:scale-110",
                  isSelected && "border-primary ring-4 ring-primary/20 bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.4)]",
                  isRelated && "border-accent/50 scale-105 bg-accent/5",
                  !isSelected && !isRelated && "hover:border-primary/50 hover:bg-primary/5"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(isSelected ? null : item.id);
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <item.icon className={cn(
                  "w-6 h-6 transition-colors duration-300", 
                  isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                
                {/* Status Indicator */}
                <div className={cn(
                  "absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-background z-10",
                  getStatusColor(item.status),
                  item.status === "in-progress" && "animate-pulse"
                )} />
                
                {/* Energy ripple effect */}
                {isSelected && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/20"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Button>

              {/* Enhanced Label */}
              <div className={cn(
                "absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 transition-all duration-300 pointer-events-none",
                (isHovered || isSelected) && "opacity-100 translate-y-2"
              )}>
                <span className="whitespace-nowrap text-xs font-bold tracking-tight uppercase text-foreground">
                  {item.title}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Info Card - Improved Drawer/Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="absolute bottom-6 right-6 z-40 w-full max-w-[340px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-card/90 backdrop-blur-3xl border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardHeader className="pb-3 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-secondary/80"
                  onClick={() => setSelectedId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("p-2 rounded-lg bg-primary/10", getStatusColor(selectedItem.status).replace(' shadow', ''))}>
                    <selectedItem.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-secondary/50 border-primary/20">
                      {selectedItem.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold font-heading">{selectedItem.title}</CardTitle>
                <span className="text-xs text-muted-foreground font-mono inline-block mt-1">{selectedItem.date}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-foreground/80 text-sm leading-relaxed">
                  {selectedItem.content}
                </CardDescription>
                
                <div className="p-3 rounded-xl bg-secondary/30 border border-primary/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Info className="w-3.5 h-3.5" />
                      Impact Score
                    </span>
                    <span className="text-primary">{selectedItem.energy}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedItem.energy}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-xs font-bold uppercase tracking-wider">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Hint */}
      {!selectedId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium flex items-center gap-2"
        >
          <div className="w-1 h-1 rounded-full bg-primary" />
          Select a node to explore details
          <div className="w-1 h-1 rounded-full bg-primary" />
        </motion.div>
      )}
    </div>
  );
}
