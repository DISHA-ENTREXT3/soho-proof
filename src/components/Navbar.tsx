import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "/#features", isAnchor: true },
  { label: "How It Works", href: "/#how-it-works", isAnchor: true },
  { label: "Pricing", href: "/pricing", isAnchor: false },
  { label: "FAQ", href: "/#faq", isAnchor: true },
];

import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border bg-background/80"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading font-bold text-primary-foreground text-sm">S</span>
          </div>
          <span className="font-heading font-bold text-lg text-foreground">
            Soho Space
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => window.location.href = "/auth"}
          >
            Log In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ModeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-glass-border overflow-hidden bg-background"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/auth"}>Log In</Button>
                <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => window.location.href = "/auth"}>Get Started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
