import { Link } from "react-router-dom";
import { SocialLinks } from "@/components/ui/SocialLinks";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features",  to: "/#features" },
      { label: "Pricing",   to: "/pricing" },
      { label: "Roadmap",   to: "/#roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",   href: "https://entrextlabs.entrext.com/" },
      { label: "Blog",    to: "/blogs" },
      { label: "Contact", href: "mailto:business@entrext.in" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",      to: "/privacy" },
      { label: "Terms & Conditions",  to: "/terms" },
      { label: "Cookie Policy",       to: "/cookies" },
      { label: "Disclaimer & Refund", to: "/disclaimer" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="Soho Space Logo" width={28} height={28} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-foreground">Soho Space</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Proof-of-execution hiring for the modern workforce.
            </p>
            <div className="text-[10px] uppercase tracking-widest font-bold text-primary/60">
              Made by Entrext Labs
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"href" in link ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to!}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center border-t border-border pt-8 pb-4">
          <SocialLinks />
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} Soho Space by Entrext Labs. All rights reserved. ·{" "}
          <a href="mailto:business@entrext.in" className="hover:text-foreground transition-colors">
            business@entrext.in
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
