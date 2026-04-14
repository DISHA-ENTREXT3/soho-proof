export type ChallengeCategory = "Tech" | "Growth" | "Hybrid" | "Design" | "Data";
export type ChallengeStatus = "Open" | "In Progress" | "Judging" | "Completed";
export type ChallengeDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: ChallengeStatus;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  prize: string;
  deadline: string;
  maxParticipants: number;
  currentParticipants: number;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  companyName: string;
  scoringCriteria: ScoringCriterion[];
  submissions?: Submission[];
  requirements: string[];
  createdAt: string;
}

export interface ScoringCriterion {
  name: string;
  weight: number;
  description: string;
}

export interface Submission {
  id: string;
  challengeId: string;
  talentName: string;
  talentAvatar: string;
  submittedAt: string;
  status: "Pending" | "Reviewed" | "Winner";
  score?: number;
  summary: string;
  link: string;
}

export const CATEGORIES: ChallengeCategory[] = ["Tech", "Growth", "Hybrid", "Design", "Data"];
export const STATUSES: ChallengeStatus[] = ["Open", "In Progress", "Judging", "Completed"];
export const DIFFICULTIES: ChallengeDifficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
