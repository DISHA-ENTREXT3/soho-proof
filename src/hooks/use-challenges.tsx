import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/challenge";

const API_URL = "http://localhost:3001/api";

export const useChallenges = () => {
  return useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/challenges`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};

export const useChallenge = (id: string | undefined) => {
  return useQuery<Challenge>({
    queryKey: ["challenge", id],
    queryFn: async () => {
      if (!id) throw new Error("Challenge ID is required");
      const response = await fetch(`${API_URL}/challenges/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
