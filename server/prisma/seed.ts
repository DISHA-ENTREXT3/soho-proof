import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.scoringCriterion.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding challenges...");

  const user = await prisma.user.create({
    data: {
      id: "u1",
      name: "John Doe",
      xp: 4280,
      reputation: "Elite",
      level: "Elite",
    },
  });

  const challengesData = [
    {
      id: "1",
      title: "Build a Real-Time Dashboard",
      description: "Create a production-ready analytics dashboard with real-time data updates, interactive charts, and responsive design. Must handle 10k+ data points efficiently.",
      category: "Tech",
      status: "Open",
      difficulty: "Advanced",
      xpReward: 500,
      prize: "$2,500",
      deadline: new Date("2026-04-20"),
      maxParticipants: 15,
      currentParticipants: 8,
      founderName: "Sarah Chen",
      founderAvatar: "SC",
      companyName: "Launchpad AI",
      requirements: JSON.stringify([
        "React or Vue frontend",
        "WebSocket or SSE for real-time updates",
        "At least 3 chart types",
        "Mobile responsive",
        "Deploy to a public URL",
      ]),
      scoringCriteria: {
        create: [
          { name: "Code Quality", weight: 30, description: "Clean, maintainable, well-tested code" },
          { name: "Performance", weight: 25, description: "Load time, responsiveness, efficiency" },
          { name: "UI/UX", weight: 25, description: "Visual design, usability, accessibility" },
          { name: "Innovation", weight: 20, description: "Creative solutions and extra features" },
        ],
      },
    },
    {
      id: "2",
      title: "Viral Growth Hack Campaign",
      description: "Design and prototype a viral referral loop for a B2C fintech app. Include wireframes, copy, incentive structure, and projected metrics.",
      category: "Growth",
      status: "Open",
      difficulty: "Intermediate",
      xpReward: 350,
      prize: "$1,500",
      deadline: new Date("2026-04-15"),
      maxParticipants: 20,
      currentParticipants: 14,
      founderName: "Jake Morrison",
      founderAvatar: "JM",
      companyName: "Finley",
      requirements: JSON.stringify([
        "Full referral loop documentation",
        "Wireframes or prototype",
        "Incentive structure breakdown",
        "3-month projection model",
      ]),
      scoringCriteria: {
        create: [
          { name: "Strategy", weight: 35, description: "Strength of the growth loop" },
          { name: "Creativity", weight: 25, description: "Originality of approach" },
          { name: "Feasibility", weight: 25, description: "Can this be built in 2 weeks?" },
          { name: "Metrics", weight: 15, description: "Projected impact and reasoning" },
        ],
      },
    },
    {
      id: "3",
      title: "API Rate Limiter Design",
      description: "Design and implement a distributed rate limiting system that can handle 100k+ requests per second with minimal latency.",
      category: "Tech",
      status: "In Progress",
      difficulty: "Expert",
      xpReward: 700,
      prize: "$4,000",
      deadline: new Date("2026-04-25"),
      maxParticipants: 10,
      currentParticipants: 10,
      founderName: "Marcus Webb",
      founderAvatar: "MW",
      companyName: "Nextera",
      requirements: JSON.stringify([
        "System design document",
        "Working implementation in any language",
        "Load test results",
        "Failure scenario handling",
      ]),
      scoringCriteria: {
        create: [
          { name: "Architecture", weight: 35, description: "System design and scalability" },
          { name: "Implementation", weight: 30, description: "Working code with tests" },
          { name: "Documentation", weight: 20, description: "Clear technical docs" },
          { name: "Edge Cases", weight: 15, description: "Handling failure scenarios" },
        ],
      },
    },
    {
      id: "4",
      title: "Brand Identity Sprint",
      description: "Create a complete brand identity for a sustainable fashion startup. Include logo, color palette, typography, and brand guidelines.",
      category: "Design",
      status: "Judging",
      difficulty: "Intermediate",
      xpReward: 400,
      prize: "$2,000",
      deadline: new Date("2026-04-05"),
      maxParticipants: 25,
      currentParticipants: 22,
      founderName: "Priya Sharma",
      founderAvatar: "PS",
      companyName: "EcoWear",
      requirements: JSON.stringify([
        "Logo in SVG and PNG formats",
        "Color palette with hex codes",
        "Typography recommendations",
        "Brand guidelines PDF",
        "3 mockup applications",
      ]),
      scoringCriteria: {
        create: [
          { name: "Visual Impact", weight: 30, description: "First impression and memorability" },
          { name: "Coherence", weight: 25, description: "Consistency across touchpoints" },
          { name: "Versatility", weight: 25, description: "Works across formats and sizes" },
          { name: "Brand Fit", weight: 20, description: "Alignment with sustainability values" },
        ],
      },
    },
  ];

  for (const c of challengesData) {
    await prisma.challenge.create({
      data: c,
    });
  }

  console.log("Seeding submissions...");

  await prisma.submission.create({
    data: {
      id: "s1",
      challengeId: "1",
      talentName: "Alex Rivera",
      talentAvatar: "AR",
      submittedAt: new Date("2026-04-05"),
      status: "Pending",
      summary: "Built with React, D3.js, and WebSocket. Supports real-time streaming of 50k+ data points with virtual scrolling.",
      link: "https://github.com/example/dashboard",
    },
  });

  await prisma.submission.create({
    data: {
      id: "s2",
      challengeId: "1",
      talentName: "Mia Zhang",
      talentAvatar: "MZ",
      submittedAt: new Date("2026-04-04"),
      status: "Reviewed",
      score: 88,
      summary: "Vue 3 + ECharts implementation with SSE. Includes dark mode, export to PDF, and accessibility features.",
      link: "https://github.com/example/vue-dash",
    },
  });

  await prisma.submission.create({
    data: {
      id: "s3",
      challengeId: "4",
      talentName: "Sam Okonkwo",
      talentAvatar: "SO",
      submittedAt: new Date("2026-04-02"),
      status: "Winner",
      score: 95,
      summary: "Complete brand system with 3D logo animations, comprehensive guidelines, and 12 application mockups.",
      link: "https://figma.com/example/brand",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
