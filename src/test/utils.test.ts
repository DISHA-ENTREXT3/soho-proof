import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge classes", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional classes", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("bg-red-500", isTrue && "text-white", isFalse && "hidden")).toBe("bg-red-500 text-white");
  });

  it("should merge conflicting Tailwind classes", () => {
    // twMerge should override px-2 with px-4
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle empty or null values gracefully", () => {
    expect(cn("text-sm", null, undefined, "")).toBe("text-sm");
  });
});
