export type ChallengeCategory = "Tech" | "Growth" | "Hybrid" | "Design" | "Data";
export type ChallengeStatus = "Open" | "In Progress" | "Judging" | "Completed";
export type ChallengeDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type RewardType = "Hire" | "Money" | "Recognition";

export interface HireRewardDetails {
  position: string;
  compensation: string;
  responsibilities: string;
  skillsRequired: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  status: ChallengeStatus;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  rewardType: RewardType;
  rewardLabel: string;
  hireRewardDetails?: HireRewardDetails;
  prize?: string;
  deadline: string;
  maxParticipants: number;
  currentParticipants: number;
  founderId: string;
  founderName: string;
  founderAvatar: string;
  companyName: string;
  scoringCriteria: ScoringCriterion[];
  criteria?: ScoringCriterion[];
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
  talentId: string;
  talentName: string;
  talentAvatar: string;
  submittedAt: string;
  status: "Pending" | "Reviewed" | "Winner";
  score?: number;
  feedback?: string;
  summary: string;
  link: string;
}

export interface Payout {
  id: string;
  challengeId: string;
  winnerSubmissionId: string;
  founderId: string;
  builderId: string;
  builderName: string;
  rewardLabel: string;
  status: "Pending" | "Paid";
  transferReference?: string;
  payoutNotes?: string;
  createdAt: string;
  paidAt?: string;
}

export const CATEGORIES: ChallengeCategory[] = ["Tech", "Growth", "Hybrid", "Design", "Data"];
export const STATUSES: ChallengeStatus[] = ["Open", "In Progress", "Judging", "Completed"];
export const DIFFICULTIES: ChallengeDifficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
