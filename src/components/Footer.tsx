import { SocialLinks } from "@/components/ui/SocialLinks";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-xs">S</span>
              </div>
              <span className="font-heading font-bold text-foreground">Soho Space</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Proof-of-execution hiring for the modern workforce.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Roadmap", "Changelog"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center border-t border-border pt-8 pb-4">
          <SocialLinks />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Soho Space. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
