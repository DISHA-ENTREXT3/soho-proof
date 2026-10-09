import React, { useState } from 'react';
import { Share2, Linkedin, Twitter, Copy, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ShareChallengeButtonsProps {
  challengeId: string;
  title: string;
  companyName?: string;
  rewardType?: string;
  rewardLabel?: string;
}

export const ShareChallengeButtons: React.FC<ShareChallengeButtonsProps> = ({
  challengeId,
  title,
  companyName = 'Our Startup',
  rewardType = 'Hire',
  rewardLabel = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const fullUrl = `${window.location.origin}/dashboard/challenges/${challengeId}`;
  
  const shareText = `🔥 We just posted a new proof-of-work challenge on Soho Space: "${title}" at ${companyName}! ${
    rewardLabel ? `Reward: ${rewardLabel}.` : ''
  } Skip traditional resumes and submit your real execution to land the role.`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Challenge URL copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy link.', variant: 'destructive' });
    }
  };

  const embedSnippet = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 18px;background-color:#4f46e5;color:#ffffff;font-weight:bold;border-radius:8px;text-decoration:none;font-family:sans-serif;">🚀 Solve our Challenge on Soho Space</a>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setEmbedCopied(true);
      toast({ title: 'Embed code copied!', description: 'HTML snippet copied for your careers page.' });
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', description: 'Could not copy embed code.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* LinkedIn Share Button */}
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          size="sm"
          className="border-[#0072b1]/40 text-[#0072b1] hover:bg-[#0072b1]/10 flex items-center gap-1.5 h-9"
        >
          <Linkedin size={15} />
          Share on LinkedIn
        </Button>
      </a>

      {/* Twitter Share Button */}
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          size="sm"
          className="border-sky-500/40 text-sky-400 hover:bg-sky-500/10 flex items-center gap-1.5 h-9"
        >
          <Twitter size={15} />
          Share on X
        </Button>
      </a>

      {/* Copy Link Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 h-9"
      >
        {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy Link'}
      </Button>

      {/* Embed Modal Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 h-9 text-muted-foreground">
            <Code size={15} />
            Careers Embed
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="text-primary w-5 h-5" /> Embed on Careers Page
            </DialogTitle>
            <DialogDescription>
              Copy this HTML snippet and paste it onto your company recruitment page or Notion job board to direct candidate applications to this challenge on Soho Space.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-secondary/80 rounded-lg text-xs font-mono break-all text-muted-foreground border border-border">
              {embedSnippet}
            </div>

            <Button onClick={handleCopyEmbed} className="w-full flex items-center justify-center gap-2">
              {embedCopied ? <Check size={16} /> : <Copy size={16} />}
              {embedCopied ? 'Embed Snippet Copied!' : 'Copy Careers Embed Code'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
