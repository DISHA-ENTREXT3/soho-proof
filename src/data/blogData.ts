export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorInitials: string;
  description: string;
  content1: string;
  content2: string;
  faqs: { question: string; answer: string }[];
}

const generateExtremelyLongContent = (title: string, subtopics: string[]) => {
  return subtopics.map((sub, i) => `
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-foreground mb-6 leading-tight">
        ${i % 2 === 0 ? "Why" : "What"} does ${sub.toLowerCase()} mean for the future of ${title.toLowerCase()}?
      </h2>
      <div class="space-y-6">
        <p class="leading-relaxed text-muted-foreground text-lg">
          In the current architectural landscape, <strong>${sub}</strong> represents a significant shift 
          in how we define excellence. Traditional systems rely on proxy metrics, but ${title.toLowerCase()} 
          demands a move toward verifiable, immutable proof of execution.
        </p>
        <p class="leading-relaxed text-muted-foreground text-lg">
          When teams implement <em>high-fidelity ${sub.toLowerCase()}</em>, they notice an immediate 
          reduction in communicative overhead. By letting the work act as its own documentation, 
          the barrier between idea and execution narrows significantly.
        </p>
        ${i % 3 === 0 ? `
        <div class="glass p-8 rounded-2xl border-primary/20 bg-primary/[0.03] my-8 font-medium italic text-primary">
          "The core transition is moving from 'trust me, I can build it' to 'here is the evidence that I already have.' 
          This is the fundamental law of the Soho Space economy."
        </div>
        ` : ""}
        <p class="leading-relaxed text-muted-foreground text-lg">
          Moreover, the data collected from <strong>${sub}</strong> interactions provides founders with an 
          unprecedented level of depth. Instead of seeing a abstract resume, they see a heatmap of 
          real-world problem-solving and architectural integrity.
        </p>
        <p class="leading-relaxed text-muted-foreground text-lg italic border-l-2 border-border pl-4">
          Ultimately, ${sub.toLowerCase()} isn't just a technical requirement—it's a cultural one. 
          It requires a willingness to be judged solely on the quality of output, eliminating 
          the noise of credentials and bias.
        </p>
      </div>
    </section>
  `).join("");
};

export const blogPosts: BlogPost[] = [];

const categories = ["Hiring Strategy", "Talent Discovery", "Engineering", "Builder Growth", "Founder Insights", "Marketplace Economy"];
const authors = [
  { name: "Jane Cooper", init: "JC" },
  { name: "Sam Rivera", init: "SR" },
  { name: "Alex Zhang", init: "AZ" },
  { name: "Mia Chen", init: "MC" },
  { name: "Logan Paulson", init: "LP" }
];

const mainTopics = [
  { 
    title: "The Death of the Resume: Why Proof-of-Work is the New Standard", 
    category: "Hiring Strategy",
    subtopics: ["The Credential Inflation", "Verification vs. Trust", "Objectifying Talent Discovery", "The Architecture of a Challenge", "Reducing Time-to-Hire", "Eliminating Cognitive Bias"]
  },
  { 
    title: "How to Recruit Top 1% Developers in the Alpha Era", 
    category: "Talent Discovery",
    subtopics: ["What Alpha Builders Want", "The Incentive Gap", "Designing Bounties that Work", "Global Talent Arbitrage", "Speed as a Weapon", "The Engineering Branding Matrix"]
  },
  { 
    title: "Scaling Your Startup with Bounty-Based Engineering", 
    category: "Engineering",
    subtopics: ["Atomic Task Definition", "Verification Protocols", "Managing External Contributors", "The New Engineering Manager Role", "Cost Efficiency at Scale", "Security in Decentralized Work"]
  },
  { title: "The Alpha Builder Mindset", category: "Builder Growth", subtopics: ["Rapid Shipping", "Architectural Integrity", "Competitive Drive", "Skill Staking", "Portfolio Optimization", "Mental Resilience"] },
  { title: "Why Founders Hate Job Boards", category: "Marketplace Economy", subtopics: ["Signal vs Noise", "The Recruitment Bottleneck", "Ghosting in Tech", "High Cost of Acquisition", "Quality Degradation", "The Alternative Path"] },
  { title: "Meritocratic Hiring Systems", category: "Hiring Strategy", subtopics: ["Objective Scoring", "Bias Removal", "Scalable Vetting", "Global Inclusion", "Standardized Benchmarking", "Data-Driven Offers"] },
  { title: "The Cost of Bad Hires", category: "Founder Insights", subtopics: ["Financial Impact", "Cultural Erosion", "Technical Debt", "Opportunity Cost", "Management Overhead", "Recovery Strategies"] },
  { title: "Remote Work vs Remote Output", category: "Engineering", subtopics: ["Measuring Impact", "Asynchronous Velocity", "Tooling for Accountability", "Global Payouts", "Engagement Metrics", "Building at Distance"] },
  { title: "From Junior to Elite", category: "Builder Growth", subtopics: ["The XP Ladder", "Mentorship via Review", "Stack Expansion", "Building in Public", "Earning Reputation", "The Seniority Leap"] },
  { title: "Setting Challenge Criteria", category: "Founder Insights", subtopics: ["Technical Scope", "Evaluation Guardrails", "Timeboxing", "Submission Verification", "Feedback Loops", "Automated Assessment"] },
  { title: "The Rise of Solo-Developers", category: "Builder Growth", subtopics: ["Autonomy", "Personal Branding", "High Leverage Tools", "Networked Productivity", "Income Diversification", "The Indie-Stack"] },
  { title: "Global Talent Arbitrage", category: "Marketplace Economy", subtopics: ["Unlocking New Markets", "Exchange Rate Mastery", "Cross-Border Payments", "Cultural Integration", "Timezone Advantages", "Competitive Bidding"] },
  { title: "Winning Your First Challenge", category: "Builder Growth", subtopics: ["Preparation", "Execution Focus", "Documentation Quality", "Follow-up", "Iterative Learning", "Landing the Hire"] },
  { title: "Verifiable Skill Graphs", category: "Engineering", subtopics: ["Data Structure of Skill", "Interoperable Proofs", "Algorithmic Trust", "Preventing Fraud", "Dynamic Leveling", "The Future of LinkedIn"] },
  { title: "Technical Evaluation Science", category: "Hiring Strategy", subtopics: ["Psychometrics", "Code Quality Metrics", "Efficiency Ratios", "Consistency over Speed", "The Evaluator's Playbook", "Standard Deviation in Teams"] },
  { title: "Startups vs Big Tech", category: "Marketplace Economy", subtopics: ["Agility vs Stability", "Ownership Density", "Speed of Promotion", "Risk/Reward Matrix", "The Alpha Environment", "Legacy Code vs Green Field"] },
  { title: "Automating the First Interview", category: "Founder Insights", subtopics: ["Workflow Integration", "Pre-Vetting Bots", "Self-Serve Evaluation", "Candidate Experience", "Data Exports", "The Virtual Recruiter"] },
  { title: "XP as Social Capital", category: "Builder Growth", subtopics: ["Reputation Scores", "Access Passports", "Tiered Opportunities", "Community Standing", "Influence via Output", "Monetizing Trust"] },
  { title: "Engineering Culture 2.0", category: "Engineering", subtopics: ["Radical Transparency", "Merit-First Promotion", "Silent Collaboration", "Documentation as Truth", "Output Obsession", "The Anti-Meeting Movement"] },
  { title: "Real-Time Dashboard Hiring", category: "Founder Insights", subtopics: ["Live Analytics", "Funnel Visibility", "Instant Offers", "Performance Monitoring", "Resource Allocation", "Decision Support"] },
  { title: "Web Dev in 2026", category: "Engineering", subtopics: ["Standard Edge Computing", "AI-First Architecture", "Component Marketplaces", "Hyper-Responsive UI", "Protocol Layers", "The Post-Framework Era"] },
  { title: "Auth vs Onboarding SEO", category: "Hiring Strategy", subtopics: ["User Friction", "Retention Loops", "Conversion Science", "Progressive Profiling", "Data Capture Strategy", "Seamless Gating"] },
  { title: "Decentralized Trust Markets", category: "Marketplace Economy", subtopics: ["Permissionless Proof", "Immutable Reputation", "Smart Contracts for Work", "Escrow Safety", "Global Compliance", "The Soho Space Node"] },
  { title: "Competitive Coding Psychology", category: "Builder Growth", subtopics: ["Pressure Performance", "Flow State Trigger", "Gamification of Work", "Dopamine Loops", "Mental Endurance", "The Winner's Circle"] },
  { title: "Preparing for Rapid Scale", category: "Founder Insights", subtopics: ["Infrastructure Resilience", "Hiring Velocity", "System Modularization", "Process Debt", "Global Readiness", "Scaling from 1 to 100"] },
  { title: "Talent Hoarding Risks", category: "Marketplace Economy", subtopics: ["Resource Stagnation", "Skill Atrophy", "Economic Friction", "The Liquidity of Labor", "Adaptive Teams", "Project-Based Matching"] },
  { title: "Founders as Builders", category: "Founder Insights", subtopics: ["Hands-on Leadership", "Technical Directives", "Product Intuition", "Velocity Management", "The Visionary Architect", "Executing the MVP"] },
  { title: "AI Impact on Dev Market", category: "Engineering", subtopics: ["The New Baseline", "Prompt Engineering vs Architecture", "Automated Debugging", "Content Generation", "AI Evaluation", "The Augmented Developer"] },
  { title: "Global Builder Networks", category: "Builder Growth", subtopics: ["Collaborative Execution", "Peer Review Systems", "Knowledge Sharing", "Mentorship at Scale", "The Social Layer", "Collective Intelligence"] },
  { title: "Roadmap to 2030 Work", category: "Marketplace Economy", subtopics: ["The Automation Era", "Human-Centric Creativity", "Specialization vs Generalization", "Lifelong Proof", "The Global Desktop", "Final Predictions"] }
];

for(let i = 0; i < 30; i++) {
  const topic = mainTopics[i];
  const author = authors[i % authors.length];
  blogPosts.push({
    id: i + 1,
    slug: topic.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, ""),
    title: topic.title,
    category: topic.category,
    readTime: `${10 + (i % 5)} min`,
    date: `April ${1 + i}, 2025`,
    author: author.name,
    authorInitials: author.init,
    description: `A comprehensive guide on ${topic.title}. We dive deep into AEO-aligned strategies for ${topic.category.toLowerCase()} in the Soho Space ecosystem.`,
    content1: generateExtremelyLongContent(topic.title, topic.subtopics.slice(0, 3)),
    content2: generateExtremelyLongContent(topic.title, topic.subtopics.slice(3)),
    faqs: [
      { question: `How does ${topic.title} apply to startups?`, answer: `It provides a framework for ${topic.category.toLowerCase()} that prioritizes speed and verifiable quality.` },
      { question: "What is the biggest challenge in implementation?", answer: "Shifting the organizational mindset from credential-focused to execution-focused." },
      { question: "Where can I find challenges related to this?", answer: "Visit the Soho Space dashboard under the Challenges section." }
    ]
  });
}
