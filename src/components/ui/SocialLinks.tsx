import React from 'react';
import { Instagram, Linkedin, MessageSquare, Link as LinkIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SocialLinks = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
      
      {/* Container for Social Icons */}
      <div className="flex items-center gap-3">
        {/* Instagram */}
        <a 
          href="#" 
          className="group relative w-12 h-12 flex items-center justify-center rounded-[30px] overflow-hidden transition-all duration-300 bg-secondary/80 hover:bg-[#d62976] hover:scale-110 active:scale-90"
          aria-label="Instagram"
        >
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
            <Instagram className="w-[18px] h-[18px] text-foreground group-hover:text-white transition-colors" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <Instagram className="w-[18px] h-[18px] text-white" fill="currentColor" />
          </div>
        </a>

        {/* LinkedIn */}
        <a 
          href="#" 
          className="group relative w-12 h-12 flex items-center justify-center rounded-[30px] overflow-hidden transition-all duration-300 bg-secondary/80 hover:bg-[#0072b1] hover:scale-110 active:scale-90"
          aria-label="LinkedIn"
        >
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
            <Linkedin className="w-[18px] h-[18px] text-foreground group-hover:text-white transition-colors" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <Linkedin className="w-[18px] h-[18px] text-white" fill="currentColor" />
          </div>
        </a>

        {/* Discord */}
        <a 
          href="#" 
          className="group relative w-12 h-12 flex items-center justify-center rounded-[30px] overflow-hidden transition-all duration-300 bg-secondary/80 hover:bg-[#5865F2] hover:scale-110 active:scale-90"
          aria-label="Discord"
        >
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
            <MessageSquare className="w-[18px] h-[18px] text-foreground group-hover:text-white transition-colors" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <MessageSquare className="w-[18px] h-[18px] text-white" fill="currentColor" />
          </div>
        </a>

        {/* Linktree */}
        <a 
          href="#" 
          className="group relative w-12 h-12 flex items-center justify-center rounded-[30px] overflow-hidden transition-all duration-300 bg-secondary/80 hover:bg-[#43E660] hover:scale-110 active:scale-90"
          aria-label="Linktree"
        >
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
            <LinkIcon className="w-[18px] h-[18px] text-foreground hover:text-[#000000] group-hover:text-[#000000] transition-colors" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <LinkIcon className="w-[18px] h-[18px] text-[#000000]" strokeWidth={3} />
          </div>
        </a>
      </div>

      {/* Subscribe Button (Substack Integration later) */}
      <div className="h-8 w-px bg-border mx-2 hidden sm:block" />
      
      <Button 
        variant="default" 
        className="h-12 px-6 rounded-[30px] bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2"
        onClick={() => window.open('#', '_blank')}
      >
        <Mail size={18} />
        Subscribe to Newsletter
      </Button>

    </div>
  );
};
