## Product Overview
- Product Type: SaaS Marketplace / Proof-of-Execution Hiring Platform
- Primary Function: Connecting startup founders with technical talent through challenge-based skills verification.
- Target Audience: Startup Founders (hiring) and "Alpha Builders" (technical talent looking for work).
- Monetization Model: Tiered Subscription (Monthly Pro plans for Founders and Builders with 7-day trials).
- Deployment Type: Client-side rendered React application (Vite) hosted via Vercel with Firebase backend.

## Core Capabilities
- Feature 1: Proof-of-work profiles demonstrating real verified skills and XP.
- Feature 2: Automated challenge evaluation and leaderboards for talent discovery.
- Feature 3: Dual-sided portal system (Founder vs Talent) with role-guarded dashboards.

## Surface Classification

### Public Pages (Indexable Candidates)
| Route | Purpose | Confidence |
|------|--------|-----------|
| / | Landing page / Value proposition | High |
| /pricing | Plan details and subscription tiers | High |
| /profile/:id | Publicly shareable builder/founder proof profiles | High |
| /privacy | Legal compliance / Privacy Policy | High |
| /terms | Legal compliance / Terms & Conditions | High |
| /cookies | Legal compliance / Cookie Policy | High |
| /disclaimer | Legal compliance / Refund Policy | High |
| /auth | New user registration | Medium |
| /login | Existing user authentication | Medium |

### Private / App Pages (Never Index)
| Route Pattern | Reason | Confidence |
|--------------|--------|-----------|
| /dashboard/* | User-specific authenticated workflow | High |
| /onboarding/* | First-time user setup flow | High |
| /dashboard/settings | Personal account management | High |

## User Journey
- Entry Point: Landing page (/) or Shared Profile (/profile/:id)
- Core Interaction: Builders completing challenges to earn XP; Founders posting bounties.
- Conversion Action: Upgrading to Pro plan or successfully hiring talent.
- Post-Conversion State: Active platform participation (ongoing challenges and hiring).

## Content Signals
- Blog Detected: No
- FAQ Detected: No (Content implies a future roadmap)
- Guides / Docs: No (Instructional UI only)
- Trust Pages Detected: Privacy, Terms, Cookies, Disclaimer

## SEO-Safe Assumptions
- What this product IS: A meritocratic hiring platform focused on proof-of-work rather than resumes.
- What this product IS NOT: A general job board or a social networking site.

## Confidence Summary
- Overall Confidence Score (0–1): 0.95
- High Confidence Areas: Routing structure, user roles, monetization model, core utility.
- Low Confidence Areas: Exact search intent for "Public Profiles" (builders vs companies).

## SEO Execution Constraints
- Routes that must never be indexed: Everything under `/dashboard` and `/onboarding`.
- Routes safe for canonicalization: `/`, `/pricing`, `/privacy`, `/terms`, `/cookies`, `/disclaimer`.
- Areas requiring conservative SEO: Dynamic `/profile/:id` pages (should ensure canonicals point to full URL).
