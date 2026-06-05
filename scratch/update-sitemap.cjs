const fs = require('fs');

const mainTopics = [
  { title: 'The Death of the Resume: Why Proof-of-Work is the New Standard' },
  { title: 'How to Recruit Top 1% Developers in the Alpha Era' },
  { title: 'Scaling Your Startup with Bounty-Based Engineering' },
  { title: 'The Alpha Builder Mindset' },
  { title: 'Why Founders Hate Job Boards' },
  { title: 'Meritocratic Hiring Systems' },
  { title: 'The Cost of Bad Hires' },
  { title: 'Remote Work vs Remote Output' },
  { title: 'From Junior to Elite' },
  { title: 'Setting Challenge Criteria' },
  { title: 'The Rise of Solo-Developers' },
  { title: 'Global Talent Arbitrage' },
  { title: 'Winning Your First Challenge' },
  { title: 'Verifiable Skill Graphs' },
  { title: 'Technical Evaluation Science' },
  { title: 'Startups vs Big Tech' },
  { title: 'Automating the First Interview' },
  { title: 'XP as Social Capital' },
  { title: 'Engineering Culture 2.0' },
  { title: 'Real-Time Dashboard Hiring' },
  { title: 'Web Dev in 2026' },
  { title: 'Auth vs Onboarding SEO' },
  { title: 'Decentralized Trust Markets' },
  { title: 'Competitive Coding Psychology' },
  { title: 'Preparing for Rapid Scale' },
  { title: 'Talent Hoarding Risks' },
  { title: 'Founders as Builders' },
  { title: 'AI Impact on Dev Market' },
  { title: 'Global Builder Networks' },
  { title: 'Roadmap to 2030 Work' }
];

let blogUrls = '';
for (const topic of mainTopics) {
  const slug = topic.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
  blogUrls += `
  <url>
    <loc>https://sohospace.entrext.in/blogs/${slug}</loc>
    <lastmod>2026-06-05T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
sitemap = sitemap.replace('</urlset>', blogUrls + '\n</urlset>');
fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap updated successfully!');
