import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { EXPIRES, securityTxt } from "./security";

const DAY = 24 * 60 * 60 * 1000;

describe("/.well-known/security.txt", () => {
  it("serves the required fields as plain text", async () => {
    const res = GET();
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    const body = await res.text();
    expect(body).toBe(securityTxt());
    expect(body).toMatch(/^Contact: mailto:[^@\s]+@cardondigital\.com$/m);
    expect(body).toContain("Canonical: https://cardondigital.com/.well-known/security.txt");
    expect(body.match(/^Expires: /gm)).toHaveLength(1);
  });

  it("expires less than a year ahead, and not within the next 30 days", () => {
    // Failing here means: confirm the Contact still reaches someone, then move
    // EXPIRES forward (at most a year from the day you do it).
    const left = Date.parse(EXPIRES) - Date.now();
    expect(Number.isNaN(left)).toBe(false);
    expect(left).toBeGreaterThan(30 * DAY);
    expect(left).toBeLessThan(366 * DAY);
  });
});
