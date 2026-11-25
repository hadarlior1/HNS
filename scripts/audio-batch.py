"""Join step narrations into ONE audio track for a single HeyGen video, and cut it back afterwards.

  python scripts/audio-batch.py build <name> <id> <id> ...   # → private/videos/<name>.mp3 + <name>.json
  python scripts/audio-batch.py split <name>                 # private/videos/<name>.mp4 → <id>-hd.mp4, then process-video.py

The narration MP3s (public/narration/<id>.mp3, module intros private/heygen-audio/m<id>.mp3) are joined
with GAP seconds of silence between them. HeyGen lip-syncs to the uploaded audio without changing its
timing, so each step's video is cut at exactly the offsets recorded in <name>.json (plus a short margin).
"""

import json
import pathlib
import subprocess
import sys
import wave

import imageio_ffmpeg

ROOT = pathlib.Path(__file__).resolve().parent.parent
FF = imageio_ffmpeg.get_ffmpeg_exe()
OUT = ROOT / "private" / "videos"
RATE = 44100
GAP = 1.2  # seconds of silence between steps
LEAD = 0.25  # keep this much before each step's first word
TAIL = 0.45  # and after its last one (still inside the gap)


def mp3_for(sid: str) -> pathlib.Path:
    if sid.startswith("m"):
        return ROOT / "private" / "heygen-audio" / f"{sid}.mp3"
    return ROOT / "public" / "narration" / f"{sid}.mp3"


def pcm(path: pathlib.Path) -> bytes:
    return subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-i", str(path), "-f", "s16le",
                           "-ac", "1", "-ar", str(RATE), "-"], capture_output=True, check=True).stdout


def build(name: str, ids: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    silence = b"\x00\x00" * int(GAP * RATE)
    data, parts, t = bytearray(silence[: len(silence) // 2]), [], GAP / 2
    for sid in ids:
        a = pcm(mp3_for(sid))
        dur = len(a) / 2 / RATE
        parts.append({"id": sid, "start": round(t, 3), "end": round(t + dur, 3)})
        data += a + silence
        t += dur + GAP
    wav = OUT / f"{name}.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(bytes(data))
    mp3 = OUT / f"{name}.mp3"
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-b:a", "192k", str(mp3)], check=True)
    wav.unlink()
    (OUT / f"{name}.json").write_text(json.dumps(parts, indent=1), encoding="utf-8")
    print(f"{mp3.name}: {len(ids)} parts, {t:.1f}s")


def split(name: str) -> None:
    parts = json.loads((OUT / f"{name}.json").read_text(encoding="utf-8"))
    video = OUT / f"{name}.mp4"
    for p in parts:
        if (ROOT / "public" / "avatar" / f"{p['id']}.webm").exists():
            continue  # already cut and processed (lets an interrupted run resume)
        start = max(0.0, p["start"] - LEAD)
        dur = p["end"] - p["start"] + LEAD + TAIL
        hd = OUT / f"{p['id']}-hd.mp4"
        subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{start:.3f}", "-i", str(video),
                        "-t", f"{dur:.3f}", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                        "-c:a", "aac", "-b:a", "160k", str(hd)], check=True)
        subprocess.run([sys.executable, str(ROOT / "scripts" / "process-video.py"), p["id"]], check=True)
        print(p["id"], "done")


if __name__ == "__main__":
    if sys.argv[1] == "build":
        build(sys.argv[2], sys.argv[3:])
    else:
        split(sys.argv[2])
