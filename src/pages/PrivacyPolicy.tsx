import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy = () => (
  <div className="relative min-h-screen bg-background">
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none"><InfiniteGrid /></div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-10">
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">Last updated: April 2025 · Applies to: Soho Space (sohospace.entrext.in)</p>
          </div>

          <Section title="1. Introduction">
            <p>Soho Space ("we", "our", or "us") is operated by Entrext Labs. We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our platform and any related services.</p>
            <p>If you have questions or concerns, please contact us at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>.</p>
          </Section>

          <Section title="2. What Data We Collect">
            <p><strong className="text-foreground">Personal Data:</strong> Name, email address, and role (Founder/Builder) provided at registration or via Google OAuth.</p>
            <p><strong className="text-foreground">Profile Data:</strong> Bio, location, skills, social links (GitHub, Twitter, LinkedIn, portfolio), company name, industry — provided during onboarding and settings.</p>
            <p><strong className="text-foreground">Technical Data:</strong> IP address, browser type and version, time zone, operating system, device identifiers, and pages visited.</p>
            <p><strong className="text-foreground">Usage Data:</strong> XP earned, challenges participated in, submission history, login frequency, and feature interactions.</p>
            <p><strong className="text-foreground">Communications:</strong> Any messages sent to us via email or support channels.</p>
          </Section>

          <Section title="3. Legal Basis for Processing">
            <p><strong className="text-foreground">Consent:</strong> When you register and accept our Terms, you consent to processing your data for service delivery.</p>
            <p><strong className="text-foreground">Contractual Necessity:</strong> Processing required to deliver the core platform service (authentication, profiles, challenges).</p>
            <p><strong className="text-foreground">Legitimate Interest:</strong> Platform analytics, fraud prevention, security monitoring, and service improvement.</p>
            <p><strong className="text-foreground">Legal Obligation:</strong> Where required by applicable law (GDPR Article 6, CCPA).</p>
          </Section>

          <Section title="4. How We Use Your Data">
            <p>To create and manage your account; to personalise your experience; to display your public profile to other users; to process challenge submissions; to send service-related notifications; to improve platform safety and functionality; and to comply with legal obligations.</p>
          </Section>

          <Section title="5. International Data Transfers">
            <p>We operate globally. Your data may be stored and processed in countries outside your own, including the United States and the European Economic Area. We use Firebase (Google Cloud) infrastructure. Google is certified under the EU-U.S. Data Privacy Framework. By using our service, you consent to such transfers.</p>
          </Section>

          <Section title="6. User Rights">
            <p><strong className="text-foreground">Access:</strong> Request a copy of your personal data.</p>
            <p><strong className="text-foreground">Correction:</strong> Update your profile via Settings at any time.</p>
            <p><strong className="text-foreground">Deletion:</strong> Request deletion of your account and associated data via Settings → Account → Delete Account, or by emailing us.</p>
            <p><strong className="text-foreground">Portability:</strong> Request your data in a machine-readable format.</p>
            <p><strong className="text-foreground">Objection / Restriction:</strong> Object to certain processing activities by contacting us.</p>
            <p>To exercise any right, email <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="7. Data Retention">
            <p>We retain personal data for as long as your account is active or as needed to provide services. Upon account deletion, we remove your data within 90 days, except where retention is required by law.</p>
          </Section>

          <Section title="8. Security">
            <p>We use Firebase Authentication, Firestore security rules, HTTPS encryption in transit, and role-based access controls. No security system is impenetrable, but we continuously monitor for vulnerabilities.</p>
          </Section>

          <Section title="9. Third-Party Services">
            <p>We use Google Firebase (auth, database, hosting), Google Analytics (anonymised), and Vercel (deployment). Each third-party has its own privacy policy. We do not sell your data to any third party.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this policy periodically. Material changes will be communicated via email or a prominent banner on the platform. Continued use after changes constitutes acceptance.</p>
          </Section>

          <Section title="11. Contact">
            <p>Entrext Labs · <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a></p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default PrivacyPolicy;
