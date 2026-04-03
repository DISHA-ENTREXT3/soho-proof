import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Zod Schemas ---
const ChallengeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  difficulty: z.string(),
  xpReward: z.number().int().positive(),
  prize: z.string(),
  deadline: z.string().transform((str) => new Date(str)),
  maxParticipants: z.number().int().positive(),
  founderName: z.string(),
  founderAvatar: z.string(),
  companyName: z.string(),
  requirements: z.array(z.string()).transform((arr) => JSON.stringify(arr)),
  scoringCriteria: z.array(z.object({
    name: z.string(),
    weight: z.number().int().positive(),
    description: z.string()
  }))
});

const SubmissionSchema = z.object({
  challengeId: z.string(),
  talentName: z.string(),
  talentAvatar: z.string(),
  summary: z.string(),
  link: z.string().url(),
});

// --- Routes ---

// Get all challenges
app.get("/api/challenges", async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      include: { scoringCriteria: true },
      orderBy: { createdAt: "desc" }
    });
    
    // Parse requirements back to array
    const parsedChallenges = challenges.map(c => ({
      ...c,
      requirements: JSON.parse(c.requirements as string)
    }));
    
    res.json(parsedChallenges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// Get single challenge
app.get("/api/challenges/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { 
        scoringCriteria: true,
        submissions: {
          orderBy: { submittedAt: "desc" }
        }
      }
    });
    
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    
    res.json({
      ...challenge,
      requirements: JSON.parse(challenge.requirements as string)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

// Create challenge
app.post("/api/challenges", async (req, res) => {
  try {
    const validatedData = ChallengeSchema.parse(req.body);
    const { scoringCriteria, ...challengeData } = validatedData;
    
    const challenge = await prisma.challenge.create({
      data: {
        ...challengeData,
        scoringCriteria: {
          create: scoringCriteria
        }
      }
    });
    
    res.status(201).json(challenge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create challenge" });
  }
});

// Submit work
app.post("/api/submissions", async (req, res) => {
  try {
    const validatedData = SubmissionSchema.parse(req.body);
    
    const submission = await prisma.submission.create({
      data: validatedData
    });
    
    // Increment challenge participant count
    await prisma.challenge.update({
      where: { id: validatedData.challengeId },
      data: { currentParticipants: { increment: 1 } }
    });
    
    res.status(201).json(submission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to submit work" });
  }
});

// Get user profile
app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { submissions: { include: { challenge: true } } }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
