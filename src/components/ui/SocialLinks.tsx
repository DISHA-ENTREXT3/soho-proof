import React from 'react';
import { Instagram, Linkedin, Link as LinkIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sohospace.entrext?igsh=MXBxOGw4MTd3Y3Q2Mg==",
    hoverBg: "#d62976",
    Icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sohospace-entrext/",
    hoverBg: "#0072b1",
    Icon: Linkedin,
  },
  {
    label: "Linktree",
    href: "https://linktr.ee/entrext.pro",
    hoverBg: "#43E660",
    darkIcon: true,
    Icon: LinkIcon,
  },
];

export const SocialLinks = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        {SOCIAL.map(({ label, href, hoverBg, darkIcon, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-12 h-12 flex items-center justify-center rounded-[30px] overflow-hidden transition-all duration-300 bg-secondary/80 hover:scale-110 active:scale-90"
            style={{ "--hover-bg": hoverBg } as React.CSSProperties}
            aria-label={label}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-10 group-hover:opacity-0">
              <Icon className="w-[18px] h-[18px] text-foreground" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              <Icon className={`w-[18px] h-[18px] ${darkIcon ? "text-black" : "text-white"}`} strokeWidth={darkIcon ? 3 : 2} />
            </div>
          </a>
        ))}
      </div>

      <div className="h-8 w-px bg-border mx-2 hidden sm:block" />

      <Button
        variant="default"
        className="h-12 px-6 rounded-[30px] bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2"
        onClick={() => window.open("https://substack.com/@entrextlabs?utm_campaign=profile&utm_medium=profile-page", "_blank")}
      >
        <Mail size={18} />
        Subscribe to Newsletter
      </Button>
    </div>
  );
};
