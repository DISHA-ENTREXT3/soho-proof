import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2, Linkedin, Twitter, Link2, Check,
  MessageCircle, X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareProfileButtonProps {
  profileId: string;
  name: string;
  role: "talent" | "founder";
  /** Extra context string shown in the share text, e.g. "Builder • 4280 XP" or "Founder @ Acme" */
  tagline?: string;
  className?: string;
}

export function ShareProfileButton({
  profileId,
  name,
  role,
  tagline,
  className,
}: ShareProfileButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/profile/${profileId}`;

  const roleLabel = role === "talent" ? "Builder" : "Founder";

  const shareText =
    role === "talent"
      ? `🚀 Check out ${name}'s builder profile on Soho Space — where real skills meet real opportunities.\n${tagline ? tagline + "\n" : ""}${profileUrl}`
      : `🏢 ${name} is hiring on Soho Space — a skills-first hiring platform.\n${tagline ? tagline + "\n" : ""}${profileUrl}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Profile link is ready to paste anywhere." });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const shareOptions = [
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      sublabel: role === "talent" ? "Showcase your builder profile" : "Promote your hiring challenge",
      icon: Linkedin,
      color: "hover:bg-[#0077B5]/15 hover:border-[#0077B5]/40 hover:text-[#0077B5]",
      iconColor: "text-[#0077B5]",
      onClick: () => { window.open(linkedinShareUrl, "_blank", "noopener,noreferrer"); setOpen(false); },
    },
    {
      id: "twitter",
      label: "Share on X (Twitter)",
      sublabel: "Tweet your Soho Space profile",
      icon: Twitter,
      color: "hover:bg-foreground/10 hover:border-foreground/30 hover:text-foreground",
      iconColor: "text-foreground",
      onClick: () => { window.open(twitterShareUrl, "_blank", "noopener,noreferrer"); setOpen(false); },
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      sublabel: "Send profile link to contacts",
      icon: MessageCircle,
      color: "hover:bg-[#25D366]/15 hover:border-[#25D366]/40 hover:text-[#25D366]",
      iconColor: "text-[#25D366]",
      onClick: () => { window.open(whatsappShareUrl, "_blank", "noopener,noreferrer"); setOpen(false); },
    },
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy Profile Link",
      sublabel: "Paste it anywhere you want",
      icon: copied ? Check : Link2,
      color: "hover:bg-primary/15 hover:border-primary/40 hover:text-primary",
      iconColor: copied ? "text-emerald-400" : "text-primary",
      onClick: handleCopy,
    },
  ];

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl border-border hover:border-primary/50 hover:bg-primary/10 transition-all"
      >
        <Share2 size={14} />
        Share Profile
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute left-0 mt-2 w-72 z-50 glass rounded-2xl border border-border shadow-2xl shadow-black/30 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Share {roleLabel} Profile</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{name} · Soho Space</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XIcon size={14} />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-2 space-y-1">
                {shareOptions.map((opt, i) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={opt.onClick}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent text-left transition-all group",
                      opt.color
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 transition-colors", opt.iconColor)}>
                      <opt.icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground">{opt.sublabel}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Branding footer */}
              <div className="px-4 py-3 border-t border-border bg-secondary/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  Powered by <span className="text-primary font-semibold">Soho Space</span> — skills-first hiring
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
