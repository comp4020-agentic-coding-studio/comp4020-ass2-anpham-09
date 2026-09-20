import { describe, expect, it } from "vitest";
import { route } from "./url";

// BASE_URL is "/" under vitest, which is the degenerate case the helper still
// has to get right — a doubled slash here would be a broken link on the
// deployed site too.
describe("route", () => {
  it("returns the base for an empty path", () => {
    expect(route("")).toBe("/");
    expect(route("/")).toBe("/");
  });

  it("adds a trailing slash, because Astro builds directories", () => {
    expect(route("sessions")).toBe("/sessions/");
  });

  it("does not double the separator when the path is already absolute", () => {
    expect(route("/sessions/01-the-dead-repo")).toBe("/sessions/01-the-dead-repo/");
  });

  it("is idempotent on an already-trailing-slashed path", () => {
    expect(route("sessions/01/")).toBe("/sessions/01/");
  });
});
