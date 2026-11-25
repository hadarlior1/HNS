import { narrate, narrationUrl } from "../src/lib/narration";
import * as speech from "../src/lib/speech";

class FakeAudio {
  static last: FakeAudio;
  src: string;
  paused = false;
  onplaying: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  playResult: Promise<void> = Promise.resolve();
  constructor(src: string) {
    this.src = src;
    FakeAudio.last = this;
  }
  play() {
    return this.playResult;
  }
  pause() {
    this.paused = true;
  }
}

beforeEach(() => vi.stubGlobal("Audio", FakeAudio));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("narrate", () => {
  it("plays the step's recorded MP3 and reports start/end", () => {
    const onStart = vi.fn();
    const onEnd = vi.fn();
    narrate("1.1", "טקסט", { onStart, onEnd });
    expect(FakeAudio.last.src).toBe(narrationUrl("1.1"));
    expect(narrationUrl("1.1")).toBe("/narration/1.1.mp3");
    FakeAudio.last.onplaying?.();
    FakeAudio.last.onended?.();
    expect(onStart).toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalled();
  });

  it("Hebrew: a missing MP3 never falls back to the browser voice (a man's voice on Windows)", () => {
    const speak = vi.spyOn(speech, "speak").mockImplementation(() => {});
    const onStart = vi.fn();
    narrate("9.9", "טקסט גיבוי", { onStart });
    FakeAudio.last.onerror?.();
    expect(speak).not.toHaveBeenCalled();
    expect(onStart).toHaveBeenCalled(); // silent captions run instead
  });

  it("English without recordings speaks with the browser voice", () => {
    const speak = vi.spyOn(speech, "speak").mockImplementation(() => {});
    narrate("9.9", "fallback text", {}, { lang: "en" });
    expect(speak).toHaveBeenCalledWith("fallback text", expect.any(Object), expect.objectContaining({ lang: "en" }));
  });

  it("stop pauses the audio and suppresses a late fallback", () => {
    const speak = vi.spyOn(speech, "speak").mockImplementation(() => {});
    const stop = narrate("1.1", "טקסט");
    stop();
    expect(FakeAudio.last.paused).toBe(true);
    FakeAudio.last.onerror?.();
    expect(speak).not.toHaveBeenCalled();
  });
});
