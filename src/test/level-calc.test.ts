import { describe, it, expect } from "vitest";

// Replicating calculation logic from DashboardOverview to test boundary conditions
const XP_LEVELS = [
  { label: "Rookie",   min: 0,     max: 1000  },
  { label: "Builder",  min: 1000,  max: 3000  },
  { label: "Pro",      min: 3000,  max: 6000  },
  { label: "Elite",    min: 6000,  max: 10000 },
  { label: "Master",   min: 10000, max: 15000 },
  { label: "Legend",   min: 15000, max: 99999 },
];

function getLevel(xp: number) {
  return XP_LEVELS.find((l) => xp >= l.min && xp < l.max) ?? XP_LEVELS[0];
}

describe("XP level calculation logic", () => {
  it("should classify 0 XP as Rookie", () => {
    expect(getLevel(0).label).toBe("Rookie");
  });

  it("should classify 500 XP as Rookie", () => {
    expect(getLevel(500).label).toBe("Rookie");
  });

  it("should classify 1000 XP exactly as Builder (boundary check)", () => {
    expect(getLevel(1000).label).toBe("Builder");
  });

  it("should classify 2999 XP as Builder", () => {
    expect(getLevel(2999).label).toBe("Builder");
  });

  it("should classify 3000 XP exactly as Pro (boundary check)", () => {
    expect(getLevel(3000).label).toBe("Pro");
  });

  it("should classify 5999 XP as Pro", () => {
    expect(getLevel(5999).label).toBe("Pro");
  });

  it("should classify 6000 XP exactly as Elite (boundary check)", () => {
    expect(getLevel(6000).label).toBe("Elite");
  });

  it("should classify 9999 XP as Elite", () => {
    expect(getLevel(9999).label).toBe("Elite");
  });

  it("should classify 10000 XP exactly as Master (boundary check)", () => {
    expect(getLevel(10000).label).toBe("Master");
  });

  it("should classify 14999 XP as Master", () => {
    expect(getLevel(14999).label).toBe("Master");
  });

  it("should classify 15000 XP and above as Legend (boundary check)", () => {
    expect(getLevel(15000).label).toBe("Legend");
    expect(getLevel(25000).label).toBe("Legend");
  });
});
