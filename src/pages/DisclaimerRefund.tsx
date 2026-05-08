import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-heading text-xl font-bold text-foreground mb-3 pb-2 border-b border-border">{title}</h2>
    <div className="text-muted-foreground text-sm leading-relaxed space-y-3">{children}</div>
  </section>
);

const DisclaimerRefund = () => (
  <div className="relative min-h-screen bg-background">
    <div className="fixed inset-0 z-0 opacity-60 pointer-events-none"><InfiniteGrid /></div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-10">
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Legal</p>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Disclaimer & Refund Policy</h1>
            <p className="text-muted-foreground text-sm">Last updated: April 2025 · Applies to: Soho Space (sohospace.entrext.in)</p>
          </div>

          {/* Disclaimer */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Part A — Disclaimer</h2>

            <Section title="1. No Hiring Guarantee">
              <p>Soho Space provides a platform for founders to evaluate builders through proof-of-work challenges. We do not guarantee that any challenge will result in a successful hire, collaboration, or employment. All hiring decisions are made solely by the Founder and are outside our control.</p>
            </Section>

            <Section title="2. No Accuracy Guarantee">
              <p>While we display builder profiles, XP scores, and skill assessments based on platform activity, we do not independently verify all claims made by users. Entrext Labs is not liable for any loss arising from reliance on inaccurate, incomplete, or misleading profile information.</p>
            </Section>

            <Section title="3. Challenge Outcome Disclaimer">
              <p>Challenge results, rankings, and XP awarded are determined by platform algorithms and Founder evaluation criteria. Entrext Labs does not guarantee the fairness, accuracy, or outcome of any challenge evaluation. We are not liable for disputes between Founders and Builders regarding challenge results.</p>
            </Section>

            <Section title="4. Financial Disclaimer">
              <p>Prize amounts displayed in challenges are set by Founders. Entrext Labs facilitates the platform but does not guarantee payment or release of prizes by Founders. Any payment disputes must be resolved directly between the Founder and Builder. We are not responsible for financial losses arising from unpaid prizes or failed transactions.</p>
            </Section>

            <Section title="5. Third-Party Content">
              <p>The Platform may contain links to third-party websites or integrations. Entrext Labs is not responsible for the content, privacy practices, or availability of any third-party sites. Links do not constitute an endorsement.</p>
            </Section>

            <Section title="6. Service Availability">
              <p>We strive for 99% uptime but do not guarantee uninterrupted access to the Platform. We are not liable for damages arising from service downtime, data loss, or technical errors.</p>
            </Section>
          </div>

          {/* Refund Policy */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Part B — Refund Policy</h2>

            <Section title="7. Free Trial">
              <p>Both our Founder Pro and Builder Pro plans include a 7-day free trial. No payment is required during the trial period. You may cancel at any time before the trial ends without incurring any charge.</p>
            </Section>

            <Section title="8. Paid Subscriptions — 7-Day Refund Window">
              <p>If you are charged for a paid subscription (Founder Pro at $29/month or Builder Pro at $29/month) and are not satisfied, you may request a full refund within 7 days of the charge date. To request a refund, email <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a> with your registered email and reason for the request.</p>
              <p>Refunds will be issued to the original payment method within 5–10 business days, subject to your payment provider's processing times.</p>
            </Section>

            <Section title="9. No Refund After 7 Days">
              <p>After the 7-day refund window, subscription fees are non-refundable. Cancelling your subscription stops future charges but does not entitle you to a refund for the current billing period. You retain access to paid features until the end of the billing period.</p>
            </Section>

            <Section title="10. Exceptional Circumstances">
              <p>In cases of significant technical failure on our part (e.g., extended downtime preventing platform access for more than 72 consecutive hours), we may, at our discretion, offer a pro-rated credit or refund. Such decisions are made on a case-by-case basis.</p>
            </Section>

            <Section title="11. Abuse Prevention">
              <p>We reserve the right to decline refund requests where we reasonably believe a refund is being sought fraudulently or where a user has received the full benefit of the service. Repeat refund requests from the same user within a 12-month period may be declined.</p>
            </Section>

            <Section title="12. Contact for Refunds">
              <p>To request a refund or escalate a billing dispute, contact us at <a href="mailto:business@entrext.in" className="text-primary hover:underline">business@entrext.in</a> within the applicable window. Include your account email, subscription type, and the date of charge.</p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default DisclaimerRefund;
