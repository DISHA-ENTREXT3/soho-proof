// Vercel Serverless Function entry point
// Re-exports the Express app from /server/index.ts so Vercel can serve it
// at the /api/* route prefix defined in vercel.json
export { default } from "../server/index";
