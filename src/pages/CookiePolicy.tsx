import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
  </section>
);

const CookiePolicy = () => (
  <div className="relative min-h-screen bg-background">
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none"><InfiniteGrid /></div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-10">
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Cookie Policy</h1>
            <p className="text-muted-foreground text-sm">Last updated: April 2025 · Applies to: Soho Space (sohospace.entrext.in)</p>
          </div>

          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files placed on your device when you visit a website. They help the website function correctly, remember your preferences, and provide analytical data. This policy explains how Soho Space, operated by Entrext Labs, uses cookies and similar technologies in compliance with the EU ePrivacy Directive.</p>
          </Section>

          <Section title="2. Essential / Strictly Necessary Cookies">
            <p>These cookies are required for the Platform to function. They cannot be disabled. They include:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Firebase Auth Session:</strong> Maintains your authentication state across page visits.</li>
              <li><strong className="text-foreground">CSRF Protection Tokens:</strong> Protects against cross-site request forgery attacks.</li>
              <li><strong className="text-foreground">Theme Preference:</strong> Remembers your dark/light mode selection (stored in localStorage).</li>
            </ul>
          </Section>

          <Section title="3. Performance / Analytics Cookies">
            <p>These cookies help us understand how users interact with the Platform so we can improve performance and usability. We use anonymised, aggregate data only. You may opt out via your browser settings.</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Google Analytics (anonymised):</strong> Tracks page views, session duration, and feature usage without collecting personally identifiable information.</li>
            </ul>
          </Section>

          <Section title="4. Functional Cookies">
            <p>These cookies enable enhanced functionality and personalisation. Disabling them may affect certain platform features.</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Sidebar State:</strong> Remembers whether your dashboard sidebar is expanded or collapsed.</li>
              <li><strong className="text-foreground">Tab Preferences:</strong> Remembers which tab was last active in settings or auth pages.</li>
            </ul>
          </Section>

          <Section title="5. Targeting / Advertising Cookies">
            <p>We do not currently use any targeting or advertising cookies. We do not run retargeting campaigns or sell advertising space. If this changes, we will update this policy and request your explicit consent.</p>
          </Section>

          <Section title="6. Third-Party Cookies">
            <p>Some third-party services integrated into the Platform may set their own cookies:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Google Firebase:</strong> Required for authentication and database functionality.</li>
              <li><strong className="text-foreground">Vercel:</strong> Deployment infrastructure — may set performance-related cookies.</li>
            </ul>
            <p>These third parties have their own privacy and cookie policies which we encourage you to review.</p>
          </Section>

          <Section title="7. Managing Cookies">
            <p>You can control and delete cookies through your browser settings. Here is how to manage cookies in common browsers:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong className="text-foreground">Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong className="text-foreground">Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>
            <p>Note: Blocking essential cookies will prevent you from logging in and using the Platform.</p>
          </Section>

          <Section title="8. Opt-Out Mechanism">
            <p>To opt out of analytics tracking, you may install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out Browser Add-on</a>. For other opt-out requests, contact us at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>.</p>
          </Section>

          <Section title="9. Contact">
            <p>Questions about our cookie practices? Email us at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default CookiePolicy;
