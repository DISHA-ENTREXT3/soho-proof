import express from "express";
import cors from "cors";
import { z } from "zod";
import dotenv from "dotenv";
import * as admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
// Note: In production, provide the service account key
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or admin.credential.cert(serviceAccount)
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();
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
  deadline: z.string().transform((str) => new Date(str).toISOString()),
  maxParticipants: z.number().int().positive(),
  founderName: z.string(),
  founderAvatar: z.string(),
  companyName: z.string(),
  requirements: z.array(z.string()),
  scoringCriteria: z.array(z.object({
    name: z.string(),
    weight: z.number().int().positive(),
    description: z.string()
  }))
});

// --- Routes ---

// Get all challenges
app.get("/api/challenges", async (req, res) => {
  try {
    const snapshot = await db.collection("challenges").orderBy("createdAt", "desc").get();
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(challenges);
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// Get single challenge
app.get("/api/challenges/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection("challenges").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Challenge not found" });
    
    // Fetch submissions as well
    const submissionsSnapshot = await db.collection("submissions")
      .where("challengeId", "==", id)
      .orderBy("submittedAt", "desc")
      .get();
      
    const submissions = submissionsSnapshot.docs.map(s => ({
      id: s.id,
      ...s.data()
    }));

    res.json({
      id: doc.id,
      ...doc.data(),
      submissions
    });
  } catch (error) {
    console.error(`GET /api/challenges/${id} error:`, error);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

// Create challenge
app.post("/api/challenges", async (req, res) => {
  try {
    const validatedData = ChallengeSchema.parse(req.body);
    const challengeRef = await db.collection("challenges").add({
      ...validatedData,
      currentParticipants: 0,
      status: "Open",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({ id: challengeRef.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error("POST /api/challenges error:", error);
    res.status(500).json({ error: "Failed to create challenge" });
  }
});

// Submit work
app.post("/api/submissions", async (req, res) => {
  try {
    const { challengeId, ...submissionData } = req.body;
    
    const batch = db.batch();
    
    const submissionRef = db.collection("submissions").doc();
    batch.set(submissionRef, {
      challengeId,
      ...submissionData,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "Pending"
    });
    
    const challengeRef = db.collection("challenges").doc(challengeId);
    batch.update(challengeRef, {
      currentParticipants: admin.firestore.FieldValue.increment(1)
    });
    
    await batch.commit();
    
    res.status(201).json({ id: submissionRef.id });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    res.status(500).json({ error: "Failed to submit work" });
  }
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
