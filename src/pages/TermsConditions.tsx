import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
  </section>
);

const TermsConditions = () => (
  <div className="relative min-h-screen bg-background">
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none"><InfiniteGrid /></div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-10">
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground text-sm">Last updated: April 2025 · Applies to: Soho Space (sohospace.entrext.in)</p>
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using Soho Space ("the Platform"), operated by Entrext Labs, you agree to be bound by these Terms and Conditions. If you do not agree, you must not use the Platform. These Terms apply to all users — Founders and Builders alike.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>You must be at least 16 years of age to create an account. By registering, you represent that you meet this requirement and that all information you provide is accurate. Accounts are personal and non-transferable.</p>
          </Section>

          <Section title="3. User Account Responsibilities">
            <p>You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a> of any unauthorised account access.</p>
            <p>You are responsible for all activity conducted under your account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </Section>

          <Section title="4. Intellectual Property">
            <p><strong className="text-foreground">Platform IP:</strong> All software, design, trademarks, branding, and proprietary systems of Soho Space are owned by Entrext Labs. You may not copy, modify, distribute, or reverse-engineer any part of the platform.</p>
            <p><strong className="text-foreground">Your Data:</strong> You retain ownership of the content you submit (profiles, challenge submissions, bio). By submitting content, you grant Entrext Labs a non-exclusive, worldwide, royalty-free licence to display and use that content solely to operate the Platform.</p>
            <p><strong className="text-foreground">Challenge Submissions:</strong> Unless explicitly agreed otherwise in a challenge brief, submissions and intellectual property rights therein remain with the submitting Builder unless a Founder explicitly purchases rights through a separate contractual agreement.</p>
          </Section>

          <Section title="5. Prohibited Activities">
            <p>You agree not to: impersonate any person or entity; post false, misleading, or defamatory content; upload malicious code or attempt to breach platform security; scrape, harvest, or extract user data without consent; use the platform for spam, phishing, or unlawful solicitation; submit fraudulent challenge entries; or engage in any activity that violates applicable law.</p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, Entrext Labs shall not be liable for: any indirect, incidental, special, or consequential damages; loss of profits, data, goodwill, or business interruption; or any damages arising from reliance on platform content or decisions made based on builder profiles or challenge results.</p>
            <p>The Platform is provided "as is" without warranties of any kind, express or implied. We do not guarantee continuous, uninterrupted, or error-free access.</p>
          </Section>

          <Section title="7. Termination of Service">
            <p>We may terminate or suspend your account at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to the Platform, other users, or third parties. You may terminate your account via Settings at any time. Upon termination, your right to use the Platform ceases immediately.</p>
          </Section>

          <Section title="8. Governing Law">
            <p>These Terms are governed by the laws of India. Users are subject to the laws of their local jurisdiction where applicable. Any disputes shall be subject to the exclusive jurisdiction of courts located in India, unless local mandatory laws provide otherwise.</p>
          </Section>

          <Section title="9. Changes to Terms">
            <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes your acceptance of the revised Terms. We will notify you of material changes via email or platform notification.</p>
          </Section>

          <Section title="10. Contact">
            <p>For questions regarding these Terms, contact us at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a>.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default TermsConditions;
