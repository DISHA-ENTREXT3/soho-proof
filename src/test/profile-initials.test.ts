import { describe, it, expect } from "vitest";

// Replicating the helper logic from use-profile.ts to test it under various states
function getInitials(profile: { name?: string } | null, user: { email?: string | null } | null) {
  return profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";
}

describe("Profile initials logic", () => {
  it("should extract two letters from two-word name", () => {
    expect(getInitials({ name: "Alex Rivera" }, null)).toBe("AR");
    expect(getInitials({ name: "john doe" }, null)).toBe("JD");
  });

  it("should extract one letter from single word name", () => {
    expect(getInitials({ name: "Jane" }, null)).toBe("J");
  });

  it("should extract at most two letters from multi-word names", () => {
    expect(getInitials({ name: "Alice Bob Charlie" }, null)).toBe("AB");
  });

  it("should fallback to email if name is missing or empty", () => {
    expect(getInitials(null, { email: "test@example.com" })).toBe("TE");
    expect(getInitials({ name: "" }, { email: "alex@example.com" })).toBe("AL");
  });

  it("should fallback to '??' if both name and email are missing", () => {
    expect(getInitials(null, null)).toBe("??");
    expect(getInitials(null, { email: null })).toBe("??");
  });
});
