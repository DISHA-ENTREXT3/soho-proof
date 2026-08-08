import express from "express";
import cors from "cors";
import { z } from "zod";
import dotenv from "dotenv";
import * as admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
// Note: In production, provide the service account key
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : admin.credential.applicationDefault();

  admin.initializeApp({
    credential: process.env.FIREBASE_SERVICE_ACCOUNT 
      ? admin.credential.cert(serviceAccount) 
      : serviceAccount,
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
  rewardType: z.enum(["Hire", "Money", "Recognition"]),
  rewardLabel: z.string(),
  hireRewardDetails: z.object({
    position: z.string(),
    compensation: z.string(),
    responsibilities: z.string(),
    skillsRequired: z.string(),
  }).optional(),
  prize: z.string().optional(),
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
}).superRefine((data, ctx) => {
  if (data.rewardType === "Hire") {
    const details = data.hireRewardDetails;
    const missing =
      !details ||
      !details.position.trim() ||
      !details.compensation.trim() ||
      !details.responsibilities.trim() ||
      !details.skillsRequired.trim();
    if (missing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "hireRewardDetails with all fields is required when rewardType is Hire",
        path: ["hireRewardDetails"],
      });
    }
  }
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

// --- Webhooks ---

// Dodo Payments Webhook
app.post("/api/webhooks/dodo", async (req, res) => {
  try {
    const { event, data } = req.body;
    
    console.log(`Received Dodo Webhook: ${event}`, JSON.stringify(data));

    if (event === "order.succeeded") {
      const userId = data.external_customer_id;
      
      if (!userId) {
        console.error("No external_customer_id found in Dodo webhook data");
        return res.status(400).json({ error: "Missing user ID" });
      }

      // Update user in Firestore
      await db.collection("users").doc(userId).update({
        subscriptionTier: "pro",
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`User ${userId} upgraded to Pro via Dodo Payments`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Dodo Webhook error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

// --- Founder Agent API Endpoints ---
app.get(["/api/v1/founder-agent/message", "/api/founder-agent/message"], (_req, res) => {
  res.json({ status: "active", agent: "FounderAgent v1" });
});

app.post(["/api/v1/founder-agent/message", "/api/founder-agent/message"], async (req, res) => {
  try {
    const { message, prompt } = req.body || {};
    const content = message || prompt || "";

    const responseText = content
      ? `Founder Agent: Received your message "${content}". How else can I assist you with your startup challenges or hiring?`
      : "Founder Agent: Ready to assist with your challenges and talent matching.";

    res.json({
      success: true,
      response: responseText,
      message: responseText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Founder Agent error:", error);
    res.status(500).json({ error: "Founder Agent processing failed" });
  }
});

// Catch-all 404 for unhandled API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

