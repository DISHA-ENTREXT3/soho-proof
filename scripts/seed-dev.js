import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  } else {
    // Try application default
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } catch (e) {
      console.error("Failed to initialize Firebase Admin. Please set FIREBASE_SERVICE_ACCOUNT in .env");
      process.exit(1);
    }
  }
}

const auth = admin.auth();
const db = admin.firestore();

const devUsers = [
  {
    name: 'Team 0',
    email: 'team0@entrext.com',
    password: 'team0pass',
    role: 'founder'
  },
  {
    name: 'Team 1',
    email: 'team1@entrext.com',
    password: 'team1pass',
    role: 'talent'
  }
];

async function seed() {
  console.log("Starting developer account seed...");
  
  for (const user of devUsers) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`User ${user.email} already exists, updating password...`);
        await auth.updateUser(userRecord.uid, {
          password: user.password,
          displayName: user.name
        });
      } catch (err) {
        userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.name,
          emailVerified: true
        });
        console.log(`Created new user: ${user.email}`);
      }

      const uid = userRecord.uid;
      
      // Update/Create Firestore profile
      const userRef = db.collection('users').doc(uid);
      
      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      const profileData = {
        uid,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: 'pro',
        onboardingComplete: true,
        avatarInitials: initials,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (user.role === 'founder') {
        Object.assign(profileData, {
          companyName: `Entrext ${user.name} Corp`,
          industry: 'Technology',
          location: 'Global',
          bio: 'Developer account for testing founder functionality.',
          challengeCount: 0
        });
      } else {
        Object.assign(profileData, {
          xp: 2500,
          wins: 10,
          streak: 5,
          level: 'Legend',
          skills: ['React', 'TypeScript', 'Node.js', 'Firebase'],
          bio: 'Developer account for testing builder functionality.',
          location: 'Remote',
          submissionCount: 0
        });
      }

      // Merge with existing data if any, but ensure subTier is pro
      await userRef.set(profileData, { merge: true });
      console.log(`✅ Seeded ${user.email} (${user.role}) with Pro status.`);

    } catch (error) {
      console.error(`❌ Error seeding user ${user.email}:`, error);
    }
  }
  
  console.log("Seed complete.");
  process.exit(0);
}

seed();
