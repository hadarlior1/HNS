import "@testing-library/jest-dom/vitest";

// The app keeps the current step in the address (#/5.3): start every test from a clean URL.
beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

// Tests exercise the video path for every step, independent of which avatar videos exist on disk
// (src/content/videos.ts is regenerated from public/avatar on every build).
vi.mock("../src/content/videos", async () => {
  const { allSteps } = await import("../src/content/lessons");
  return { STEP_VIDEOS: allSteps.map((s) => s.id), MODULE_INTROS: [], EN_NARRATION: false };
});
