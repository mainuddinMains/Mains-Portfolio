import { describe, expect, it } from "vitest";
import { formatDateRange, formatMonthYear } from "./date";

describe("date formatting", () => {
  it("formats month and year in UTC", () => {
    expect(formatMonthYear("2025-01-01")).toBe("Jan 2025");
    expect(formatMonthYear(undefined)).toBe("");
    expect(formatMonthYear("garbage")).toBe("");
  });

  it("formats ranges", () => {
    expect(formatDateRange("2024-01-15", "2025-03-01")).toBe("Jan 2024 – Mar 2025");
    expect(formatDateRange("2024-01-15", undefined)).toBe("Jan 2024 – Present");
    expect(formatDateRange("2024-05-01", "2024-05-03")).toBe("May 2024");
    expect(formatDateRange(undefined, undefined)).toBe("");
  });

  it("returns only the start date when the end is omitted and the ongoing label is empty", () => {
    expect(formatDateRange("2024-01-15", undefined, "")).toBe("Jan 2024");
  });
});
